"""
AI Image Enhancer for KalaSetu (SIH26090, expected-solution feature 1).

Takes the photo an artisan snaps on a phone - usually a handloom piece on a
charpai, a cluttered floor, or against a wall in poor light - and returns a
listing-grade image: subject isolated on a clean background, colour cast and
exposure corrected, framed square the way marketplaces expect.

Deliberately classical CV (OpenCV + PIL) rather than a segmentation network:
it needs no model download, runs in well under a second on a laptop CPU, and
works fully offline - which matters because the artisans this is built for are
on weak rural connectivity. Segmentation degrades honestly: if it cannot find a
confident subject it says so in the report and returns the colour-corrected
image rather than mangling it.
"""
from __future__ import annotations

import base64
import io
from dataclasses import dataclass, asdict

import cv2
import numpy as np
from PIL import Image, ImageOps

MAX_EDGE = 2048          # cap work size; phone photos are far larger than needed
OUTPUT_EDGE = 1200       # square output, comfortably above marketplace minimums
SUBJECT_MARGIN = 0.06    # breathing room around the subject in the final frame


@dataclass
class EnhanceReport:
    """What we did and how confident we are - surfaced in the UI, not hidden."""
    background_removed: bool
    subject_coverage: float      # fraction of frame the subject occupies
    sharpness_before: float
    sharpness_after: float
    brightness_before: float
    brightness_after: float
    warnings: list


def _load(image_bytes: bytes) -> np.ndarray:
    """Decode to BGR, honouring EXIF rotation so phone portraits aren't sideways."""
    pil = Image.open(io.BytesIO(image_bytes))
    pil = ImageOps.exif_transpose(pil).convert("RGB")

    w, h = pil.size
    if max(w, h) > MAX_EDGE:
        scale = MAX_EDGE / max(w, h)
        pil = pil.resize((int(w * scale), int(h * scale)), Image.LANCZOS)

    return cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)


def _sharpness(bgr: np.ndarray) -> float:
    """Variance of the Laplacian - the standard cheap blur metric."""
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def _brightness(bgr: np.ndarray) -> float:
    return float(cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).mean())


def _white_balance(bgr: np.ndarray) -> np.ndarray:
    """Gray-world correction. Indoor rural light carries a heavy yellow cast."""
    result = bgr.astype(np.float32)
    means = [result[:, :, c].mean() for c in range(3)]
    gray = float(np.mean(means))
    for c in range(3):
        if means[c] > 1e-5:
            result[:, :, c] *= gray / means[c]
    return np.clip(result, 0, 255).astype(np.uint8)


def _fix_exposure(bgr: np.ndarray) -> np.ndarray:
    """CLAHE on luminance only, so shadows lift without wrecking saturation."""
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(l)
    return cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2BGR)


def _segment(bgr: np.ndarray):
    """
    GrabCut seeded with a centre rectangle, then cleaned up.

    Returns (mask, coverage, warnings). mask is None when the result is not
    trustworthy - a subject filling nearly everything or nearly nothing means
    GrabCut latched onto the background, and compositing that would ruin the
    photo, so we leave the original background alone instead.
    """
    warnings = []
    h, w = bgr.shape[:2]
    inset_x, inset_y = int(w * 0.06), int(h * 0.06)
    rect = (inset_x, inset_y, w - 2 * inset_x, h - 2 * inset_y)

    mask = np.zeros((h, w), np.uint8)
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    try:
        cv2.grabCut(bgr, mask, rect, bgd, fgd, 5, cv2.GC_INIT_WITH_RECT)
    except cv2.error as e:
        return None, 0.0, ["segmentation failed: " + str(e)]

    binary = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

    # Close holes (zari gaps, open embroidery), then keep only the largest blob
    # so stray background patches don't survive into the composite.
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=2)
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel, iterations=1)

    n, labels, stats, _ = cv2.connectedComponentsWithStats(binary, connectivity=8)
    if n > 1:
        largest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        binary = np.where(labels == largest, 255, 0).astype(np.uint8)

    coverage = float((binary > 0).sum()) / (h * w)
    if coverage < 0.05:
        warnings.append("subject too small to isolate confidently - kept original background")
        return None, coverage, warnings
    if coverage > 0.97:
        warnings.append("could not separate subject from background - kept original background")
        return None, coverage, warnings

    # Feather the edge so the composite doesn't look cut out with scissors.
    binary = cv2.GaussianBlur(binary, (5, 5), 0)
    return binary, coverage, warnings


def _compose(bgr: np.ndarray, mask) -> np.ndarray:
    """Composite onto white and frame square with the subject centred."""
    h, w = bgr.shape[:2]

    if mask is not None:
        alpha = (mask.astype(np.float32) / 255.0)[:, :, None]
        white = np.full_like(bgr, 255, dtype=np.uint8)
        bgr = (bgr * alpha + white * (1 - alpha)).astype(np.uint8)

        ys, xs = np.where(mask > 32)
        if len(xs) and len(ys):
            pad_x, pad_y = int(w * SUBJECT_MARGIN), int(h * SUBJECT_MARGIN)
            x0 = max(0, int(xs.min()) - pad_x)
            x1 = min(w, int(xs.max()) + pad_x)
            y0 = max(0, int(ys.min()) - pad_y)
            y1 = min(h, int(ys.max()) + pad_y)
            if x1 > x0 and y1 > y0:
                bgr = bgr[y0:y1, x0:x1]

    # Letterbox onto a white square rather than stretching - aspect distortion
    # on a saree is immediately obvious and looks unprofessional.
    h, w = bgr.shape[:2]
    side = max(h, w)
    canvas = np.full((side, side, 3), 255, dtype=np.uint8)
    y_off, x_off = (side - h) // 2, (side - w) // 2
    canvas[y_off:y_off + h, x_off:x_off + w] = bgr

    return cv2.resize(canvas, (OUTPUT_EDGE, OUTPUT_EDGE), interpolation=cv2.INTER_AREA)


def enhance(image_bytes: bytes, remove_background: bool = True):
    """Run the full pipeline. Returns (jpeg_bytes, EnhanceReport)."""
    original = _load(image_bytes)
    sharp_before, bright_before = _sharpness(original), _brightness(original)

    warnings = []
    if sharp_before < 60:
        warnings.append("photo looks blurry - consider retaking in better light")
    if bright_before < 55:
        warnings.append("photo is very dark - brightened, but a retake would look better")
    elif bright_before > 215:
        warnings.append("photo is overexposed - some detail may be unrecoverable")

    corrected = _fix_exposure(_white_balance(original))

    mask, coverage = None, 0.0
    if remove_background:
        mask, coverage, seg_warnings = _segment(corrected)
        warnings.extend(seg_warnings)

    final = _compose(corrected, mask)

    ok, buf = cv2.imencode(".jpg", final, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    if not ok:
        raise RuntimeError("failed to encode enhanced image")

    report = EnhanceReport(
        background_removed=mask is not None,
        subject_coverage=round(coverage, 3),
        sharpness_before=round(sharp_before, 1),
        sharpness_after=round(_sharpness(final), 1),
        brightness_before=round(bright_before, 1),
        brightness_after=round(_brightness(final), 1),
        warnings=warnings,
    )
    return buf.tobytes(), report


def enhance_to_data_uri(image_bytes: bytes, remove_background: bool = True):
    """Convenience wrapper: returns a data: URI the frontend can drop into <img>."""
    jpeg, report = enhance(image_bytes, remove_background)
    uri = "data:image/jpeg;base64," + base64.b64encode(jpeg).decode("ascii")
    return uri, asdict(report)
