require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

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