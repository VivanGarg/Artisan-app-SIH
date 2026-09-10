const mongoose = require("mongoose");

let isConnected = false;

// Disable command buffering so operations fail fast or use in-memory fallback
mongoose.set("bufferCommands", false);

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.warn("⚠️ MONGO_URI not provided. Operating with in-memory persistence fallback.");
        return false;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        isConnected = true;
        console.log("✅ MongoDB connected successfully");
        return true;
    } catch (error) {
        console.warn(`⚠️ MongoDB not connected (${error.message}). Operating with in-memory persistence fallback.`);
        return false;
    }
};

module.exports = { connectDB, isConnected: () => isConnected };