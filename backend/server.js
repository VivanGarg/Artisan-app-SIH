require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Artisan API is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});