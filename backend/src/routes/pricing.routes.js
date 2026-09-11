const express = require("express");
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// POST /api/pricing/recommend
// Proxies the request to the Python FastAPI ML service
router.post("/recommend", async (req, res) => {
  try {
    const { category, description, rating, brand } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        success: false,
        message: "Both 'category' and 'description' are required.",
      });
    }

    const response = await fetch(`${ML_SERVICE_URL}/recommend-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, description, rating: rating || null, brand: brand || null }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        success: false,
        message: `ML service error: ${errText}`,
      });
    }

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error("ML pricing service error:", error.message);
    res.status(503).json({
      success: false,
      message: "Pricing service unavailable. Is the ML server running on port 8000?",
    });
  }
});

module.exports = router;
