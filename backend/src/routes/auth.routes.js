const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");
const { isConnected } = require("../config/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "kalasetu_jwt_secret_2026_sih";

// Runtime in-memory user cache
const localUsers = new Map();

// Default demo users
const initDemoUsers = async () => {
  const hash = await bcrypt.hash("password123", 10);
  localUsers.set("artisan@kalasetu.gov.in", {
    _id: "usr-art-1",
    name: "Smt. Yashoda Bai",
    email: "artisan@kalasetu.gov.in",
    password: hash,
    role: "artisan",
    pehchanId: "MP-CH-2018-912"
  });
  localUsers.set("buyer@kalasetu.gov.in", {
    _id: "usr-buy-1",
    name: "Aarav Sharma",
    email: "buyer@kalasetu.gov.in",
    password: hash,
    role: "buyer"
  });
};
initDemoUsers();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, pehchanId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    let existingUser = null;
    if (isConnected()) {
      try {
        existingUser = await User.findOne({ email: cleanEmail });
      } catch {
        existingUser = localUsers.get(cleanEmail);
      }
    } else {
      existingUser = localUsers.get(cleanEmail);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}`;

    const userData = {
      _id: userId,
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: role || "buyer",
      pehchanId: role === "artisan" ? pehchanId : undefined
    };

    localUsers.set(cleanEmail, userData);

    if (isConnected()) {
      try {
        await User.create(userData);
      } catch (e) {
        console.warn("DB user save notice:", e.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed: " + error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = null;

    if (isConnected()) {
      try {
        user = await User.findOne({ email: cleanEmail });
      } catch {
        user = localUsers.get(cleanEmail);
      }
    } else {
      user = localUsers.get(cleanEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Authorized",
    user: req.user
  });
});

module.exports = router;