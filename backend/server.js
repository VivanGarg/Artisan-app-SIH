require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const artisanRoutes = require("./src/routes/artisan.routes");
const orderRoutes = require("./src/routes/order.routes");
const pricingRoutes = require("./src/routes/pricing.routes");
const mlRoutes = require("./src/routes/ml.routes");

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true }));
// Artisan photos arrive as base64 in the JSON body, so the default 100kb
// limit would reject every upload with a 413.
app.use(express.json({ limit: "15mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/ml", mlRoutes);

const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "KalaSetu Artisan Marketplace API is running",
    timestamp: new Date().toISOString()
  });
});

let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
    console.log(`✨ KalaSetu API Server running on port ${PORT}`);
  });
}

module.exports = { app, server };