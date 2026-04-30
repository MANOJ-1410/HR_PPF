// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { protect, restrictTo } = require('../middlewares/authMiddleware');
// // const { loginValidation, signupValidation } = require('../validations/AuthValidation');

// // Public routes
// // router.post('/login', loginValidation, authController.login);

// // Protected routes (require authentication)
// router.use(protect); // All routes after this middleware are protected

// // SuperAdmin only routes
// router.get('/admins', restrictTo('superadmin'), authController.getAllAdmins);
// // router.post('/create-admin', restrictTo('superadmin'), signupValidation, authController.createAdmin);
// router.delete('/admin/:id', restrictTo('superadmin'), authController.deleteAdmin);
// router.patch('/update-password', restrictTo('superadmin'), authController.updatePassword);

// // SuperAdmin and Admin routes
// // router.post('/create-candidate', restrictTo('superadmin', 'admin'), signupValidation, authController.createCandidate);

// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// 1. REGISTER
// ==========================================
// backend/routes/authRoutes.js

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // ✅ MANUAL HASHING (Simple and Explicit)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Store the hash we just made
      role: 'hr',
      canLogin: true
    });

    await newUser.save();
    res.status(201).json({ message: "HR User created successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// 2. LOGIN
// ==========================================
// backend/routes/authRoutes.js

// ... imports remain the same ...

// KEEP YOUR REGISTER ROUTE AS IS (The one sending plain password)

// === DEBUG LOGIN ROUTE ===
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("----------------------------------------------");
    console.log("LOGIN ATTEMPT FOR:", email);
    console.log("PASSWORD ENTERED:", password);

    // 1. Find User
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ USER NOT FOUND IN DB");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ USER FOUND:", user.email);
    console.log("🔑 STORED PASSWORD IN DB:", user.password);

    // 2. Check if password exists
    if (!user.password) {
      console.log("❌ PASSWORD FIELD IS EMPTY IN DB");
      return res.status(400).json({ message: "Server Error: Password not set" });
    }

    // 3. Compare
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("⚖️ BCRYPT MATCH RESULT:", isMatch);

    if (!isMatch) {
      // DEBUG: Did we accidentally store plain text?
      if (password === user.password) {
        console.log("⚠️ CRITICAL: Password is stored as PLAIN TEXT. The pre-save hook failed.");
        console.log("   --> Fix: Your User Model is not hashing correctly.");
      } else {
        console.log("❌ HASH MISMATCH. (Double hashing or Salt issue)");
      }
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4. Success
    console.log("✅ LOGIN SUCCESSFUL");
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "your_jwt_secret_key", 
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;