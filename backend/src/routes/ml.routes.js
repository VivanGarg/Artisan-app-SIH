const express = require("express");
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Image enhancement is CPU-bound (GrabCut on a multi-megapixel phone photo),
// so it needs a far longer budget than the text endpoints.
const TIMEOUTS = { text: 20_000, image: 90_000 };

/**
 * Forward a request to the Python ML service.
 *
 * The frontend should never need to know that a second service exists, or be
 * able to reach it directly - on a phone the ML service is not routable, only
 * this API is. Failures are translated into something an artisan-facing UI can
 * actually show instead of a raw stack trace.
 */
async function proxy(path, body, res, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${ML_SERVICE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await response.text();
    if (!response.ok) {
      let detail = text;
      try {
        detail = JSON.parse(text).detail || text;
      } catch (_) {
        /* non-JSON error body - use it as-is */
      }
      return res.status(response.status).json({ success: false, message: detail });
    }

    return res.json({ success: true, data: JSON.parse(text) });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({
        success: false,
        message: "The AI service took too long. Try a smaller photo, or retry.",
      });
    }
    console.error(`ML proxy ${path} failed:`, error.message);
    return res.status(503).json({
      success: false,
      message: "AI service unavailable. Is the ML server running on port 8000?",
    });
  } finally {
    clearTimeout(timer);
  }
}

// POST /api/ml/catalog - spoken transcript -> title, description, keywords, category
router.post("/catalog", async (req, res) => {
  const { transcript, category } = req.body;
  if (!transcript || !transcript.trim()) {
    return res.status(400).json({ success: false, message: "transcript is required" });
  }
  return proxy("/catalog", { transcript, category: category || null }, res, TIMEOUTS.text);
});

// POST /api/ml/enhance-image - phone photo -> listing-grade image
router.post("/enhance-image", async (req, res) => {
  const { image_base64, remove_background } = req.body;
  if (!image_base64) {
    return res.status(400).json({ success: false, message: "image_base64 is required" });
  }
  return proxy(
    "/enhance-image",
    { image_base64, remove_background: remove_background !== false },
    res,
    TIMEOUTS.image
  );
});

// POST /api/ml/listing/draft - the whole artisan flow in one call
router.post("/listing/draft", async (req, res) => {
  const { transcript, image_base64, category, remove_background } = req.body;
  if (!transcript || !transcript.trim()) {
    return res.status(400).json({ success: false, message: "transcript is required" });
  }
  return proxy(
    "/listing/draft",
    {
      transcript,
      image_base64: image_base64 || null,
      category: category || null,
      remove_background: remove_background !== false,
    },
    res,
    image_base64 ? TIMEOUTS.image : TIMEOUTS.text
  );
});

module.exports = router;
