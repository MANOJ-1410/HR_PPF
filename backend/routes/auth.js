const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your Mongoose User Model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- SEED TEST CREDENTIALS ---
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@mv.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const newAdmin = new User({
        name: "Test Admin",
        email: "admin@mv.com",
        password: hashedPassword,
        role: "hr",
        canLogin: true
      });
      await newAdmin.save();
      console.log("✅ Seeded test HR credentials: admin@mv.com / admin123");
    }
  } catch (error) {
    console.error("Failed to seed admin:", error);
  }
};
seedAdmin();

// 1. REGISTER (Run this once via Postman to create your HR account)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'hr' // Hardcode the role
    });

    await newUser.save();
    res.status(201).json({ message: "HR User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. LOGIN (This connects to your React Login Page)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "YOUR_SECRET_KEY", 
      { expiresIn: "1d" }
    );

    // Set Cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: isProduction ? "none" : "lax",
    });

    // Send response
    res.status(200).json({
      message: "Login successful",
      token, // Optional: frontend can still use it for non-sensitive data
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// 3. UPDATE PASSWORD
router.put('/update-password', async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect current password" });

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. VERIFY SESSION (Check if user is logged in on page refresh)
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "YOUR_SECRET_KEY");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// 5. LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;