const express = require("express");
const { seedProducts } = require("../data/seedData");
const Product = require("../models/product");
const { isConnected } = require("../config/db");

const router = express.Router();

// In-memory runtime state clone for offline/dev resilience
let localProducts = JSON.parse(JSON.stringify(seedProducts));

// Seed DB if connected and empty
const initDB = async () => {
  if (isConnected()) {
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(seedProducts);
        console.log("🌱 Database seeded with initial GI crafts");
      }
    } catch (e) {
      console.warn("DB seed error (non-fatal):", e.message);
    }
  }
};
setTimeout(initDB, 1500);

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, giOnly, search, minPrice, maxPrice, sort } = req.query;

    let products = [];
    if (isConnected()) {
      try {
        let query = {};
        if (category && category !== "All Crafts" && category !== "All") {
          query.category = category;
        }
        if (giOnly === "true") {
          query.giCertified = true;
        }
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { cluster: { $regex: search, $options: "i" } },
            { artisanName: { $regex: search, $options: "i" } }
          ];
        }
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = Number(minPrice);
          if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        let sortOption = {};
        if (sort === "price-low") sortOption = { price: 1 };
        else if (sort === "price-high") sortOption = { price: -1 };
        else sortOption = { createdAt: -1 };

        products = await Product.find(query).sort(sortOption);
      } catch (err) {
        products = localProducts;
      }
    } else {
      products = localProducts;
    }

    // Apply filters on memory if DB wasn't used or fallback
    if (!isConnected() || products.length === 0) {
      let filtered = [...localProducts];
      if (category && category !== "All Crafts" && category !== "All") {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (giOnly === "true") {
        filtered = filtered.filter(p => p.giCertified);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          p =>
            p.title.toLowerCase().includes(q) ||
            p.cluster.toLowerCase().includes(q) ||
            p.artisanName.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }
      if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

      if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
      else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);

      products = filtered;
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (isConnected()) {
      try {
        product = await Product.findOne({ $or: [{ _id: id }, { id: id }] });
      } catch (e) {
        product = null;
      }
    }

    if (!product) {
      product = localProducts.find(p => p.id === id || p._id === id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/products/:id/review
router.post("/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { author, location, rating, comment } = req.body;

    const newReview = {
      id: `rev-${Date.now()}`,
      author: author || "Anonymous Patron",
      location: location || "India",
      rating: Number(rating) || 5,
      badge: "Verified Patron via ONDC",
      comment,
      createdAt: new Date()
    };

    const prod = localProducts.find(p => p.id === id);
    if (prod) {
      prod.reviews.unshift(newReview);
      prod.reviewCount = prod.reviews.length;
    }

    res.json({ success: true, message: "Review added successfully", data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to post review" });
  }
});

module.exports = router;
