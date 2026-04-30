const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Hardcoded SuperAdmin credentials
const HARDCODED_SUPERADMIN = {
  email: "superadmin@mv.com",
  password: "super123",
  role: "superadmin"
};

// Initialize hardcoded SuperAdmin in database
const initializeSuperAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ 
      email: HARDCODED_SUPERADMIN.email,
      role: 'superadmin'
    });
    
    if (!existingAdmin) {
      const newSuperAdmin = new User({
        email: HARDCODED_SUPERADMIN.email,
        password: HARDCODED_SUPERADMIN.password,
        role: HARDCODED_SUPERADMIN.role,
        canLogin: true
      });
      await newSuperAdmin.save();
      console.log('Hardcoded SuperAdmin created in database');
    } else {
      console.log('SuperAdmin already exists in database');
    }
  } catch (error) {
    console.error('Error initializing SuperAdmin:', error);
  }
};

// Call initialization when module loads
initializeSuperAdmin();

const signToken = (id, role) => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  
  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    }
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Check if user is allowed to login
    if (!user.canLogin) {
      return res.status(403).json({
        status: 'fail',
        message: 'Login access denied for your account type'
      });
    }

    // For admins who haven't set password yet, redirect to set password
    if (user.role === 'admin' && !user.hasSetPassword) {
      return res.status(200).json({
        status: 'first_login',
        message: 'Please set your password',
        userId: user._id
      });
    }

    // Verify password (only if user has set password)
    if (user.password && !(await user.comparePassword(password.trim()))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // Send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    // Only superadmin can view all admins
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only superadmin can view all admins'
      });
    }

    const admins = await User.find({ role: 'admin' }).select('-password');
    res.status(200).json({
      status: 'success',
      results: admins.length,
      data: { admins }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { email, name } = req.body; // Only name and email needed
    
    // Only superadmin can create admins
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only superadmin can create admins'
      });
    }

    const newAdmin = await User.create({
      email,
      name,
      role: 'admin',
      canLogin: true,
      hasSetPassword: false, // Admin needs to set password on first login
      createdBy: req.user._id
      // No password field - admin will set it later
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newAdmin._id,
          email: newAdmin.email,
          role: newAdmin.role,
          name: newAdmin.name,
          hasSetPassword: newAdmin.hasSetPassword
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    // Only superadmin can delete admins
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only superadmin can delete admins'
      });
    }

    const admin = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: 'admin' 
    });
    
    if (!admin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createCandidate = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Only superadmin and admin can create candidates
    if (!['superadmin', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Unauthorized to create candidates'
      });
    }

    const newCandidate = await User.create({
      email,
      password,
      name,
      role: 'candidate',
      canLogin: false,  // Candidates cannot login
      createdBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newCandidate._id,
          email: newCandidate.email,
          role: newCandidate.role,
          name: newCandidate.name
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Admin sets password on first login  
exports.setPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(404).json({
        status: 'fail',
        message: 'Admin not found'
      });
    }

    if (user.hasSetPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Password already set'
      });
    }

    user.password = password;
    user.hasSetPassword = true;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Only superadmin can update their password
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only superadmin can update password'
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};