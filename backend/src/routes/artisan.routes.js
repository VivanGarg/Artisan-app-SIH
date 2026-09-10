const express = require("express");
const { seedArtisans } = require("../data/seedData");

const router = express.Router();

// GET /api/artisans
router.get("/", (req, res) => {
  res.json({
    success: true,
    count: seedArtisans.length,
    data: seedArtisans
  });
});

// GET /api/artisans/:id
router.get("/:id", (req, res) => {
  const artisan = seedArtisans.find(a => a.id === req.params.id);
  if (!artisan) {
    return res.status(404).json({ success: false, message: "Artisan not found" });
  }
  res.json({ success: true, data: artisan });
});

module.exports = router;
