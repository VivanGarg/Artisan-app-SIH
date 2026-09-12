"""
FastAPI service for the KalaSetu ML features (SIH26090).

Covers all three AI features the problem statement asks for:

  1. /enhance-image     - AI Image Enhancer      (image_enhance.py)
  2. /catalog           - Multilingual Cataloger (cataloger.py)
  3. /recommend-price   - Fair-price band        (predict.py)

  and /listing/draft, which chains all three in one call: an artisan speaks,
  snaps a photo, and gets back a complete listing.

Run:
    uvicorn app:app --host 0.0.0.0 --port 8000
"""
import base64
import binascii
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from cataloger import Cataloger
from image_enhance import enhance_to_data_uri
from predict import PriceRecommender

app = FastAPI(title="KalaSetu Artisan ML API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Loaded once at import: the models are a few MB and loading them per request
# would dominate the response time.
recommender = PriceRecommender()
cataloger = Cataloger()

MAX_IMAGE_BYTES = 12 * 1024 * 1024


# --------------------------------------------------------------------------
# request models
# --------------------------------------------------------------------------

class ProductInput(BaseModel):
    category: str
    description: str
    rating: Optional[float] = None
    brand: Optional[str] = None


class CatalogInput(BaseModel):
    transcript: str
    category: Optional[str] = None      # artisan's own choice wins if supplied


class ImageInput(BaseModel):
    image_base64: str                   # raw base64 or a full data: URI
    remove_background: bool = True


class DraftInput(BaseModel):
    transcript: str
    image_base64: Optional[str] = None
    category: Optional[str] = None
    remove_background: bool = True


def _decode_image(payload: str) -> bytes:
    """Accept either a bare base64 string or a full data: URI."""
    if not payload:
        raise HTTPException(status_code=400, detail="image_base64 is empty")
    if payload.startswith("data:"):
        _, _, payload = payload.partition(",")
    try:
        raw = base64.b64decode(payload, validate=False)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=400, detail="image_base64 is not valid base64")
    if not raw:
        raise HTTPException(status_code=400, detail="decoded image is empty")
    if len(raw) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"image exceeds {MAX_IMAGE_BYTES // (1024 * 1024)}MB limit",
        )
    return raw


# --------------------------------------------------------------------------
# endpoints
# --------------------------------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "features": {
            "pricing": True,
            "cataloger": True,
            "category_model": cataloger.classifier is not None,
            "image_enhance": True,
        },
    }


@app.post("/recommend-price")
def recommend_price(product: ProductInput):
    return recommender.recommend(
        category=product.category,
        description=product.description,
        rating=product.rating,
        brand=product.brand,
    )


@app.post("/catalog")
def catalog(body: CatalogInput):
    """Spoken transcript -> title, description, bullets, keywords, category."""
    if not body.transcript.strip():
        raise HTTPException(status_code=400, detail="transcript is empty")
    return cataloger.catalog(body.transcript, category=body.category)


@app.post("/enhance-image")
def enhance_image(body: ImageInput):
    """Phone photo -> listing-grade image on a clean background."""
    raw = _decode_image(body.image_base64)
    try:
        data_uri, report = enhance_to_data_uri(raw, remove_background=body.remove_background)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"could not process image: {e}")
    return {"image": data_uri, "report": report}


@app.post("/listing/draft")
def draft_listing(body: DraftInput):
    """
    The whole artisan flow in one call: speak, optionally attach a photo, get a
    complete draft listing back.

    Each stage degrades independently - a failed image enhance or an
    unresolvable category still returns everything else, with the problem
    reported rather than the request failing. An artisan on a weak connection
    should never lose their whole listing because one stage struggled.
    """
    if not body.transcript.strip():
        raise HTTPException(status_code=400, detail="transcript is empty")

    listing = cataloger.catalog(body.transcript, category=body.category)
    warnings = []

    price = None
    if listing["category"]:
        try:
            price = recommender.recommend(
                category=listing["category"],
                description=listing["description"],
            )
        except Exception as e:
            warnings.append(f"pricing unavailable: {e}")
    else:
        warnings.append("category could not be determined - ask the artisan, then re-price")

    image, image_report = None, None
    if body.image_base64:
        try:
            image, image_report = enhance_to_data_uri(
                _decode_image(body.image_base64),
                remove_background=body.remove_background,
            )
        except HTTPException as e:
            warnings.append(f"image rejected: {e.detail}")
        except Exception as e:
            warnings.append(f"image enhancement failed: {e}")

    return {
        "listing": listing,
        "price": price,
        "image": image,
        "image_report": image_report,
        "warnings": warnings,
    }
