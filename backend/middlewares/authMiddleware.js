// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Protect routes - verify JWT token
// const protect = async (req, res, next) => {
//   try {
//     let token;
    
//     // Get token from header
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     } else if (req.headers['authorization']) {
//       // Support your current format without 'Bearer'
//       token = req.headers['authorization'];
//     }

//     if (!token) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'You are not logged in! Please log in to get access.'
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

//     // Check if user still exists
//     const currentUser = await User.findById(decoded.id);
//     if (!currentUser) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'The user belonging to this token does no longer exist.'
//       });
//     }

//     // Check if user can login
//     if (!currentUser.canLogin) {
//       return res.status(403).json({
//         status: 'fail',
//         message: 'Access denied for your account type.'
//       });
//     }

//     // Grant access to protected route
//     req.user = currentUser;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       status: 'fail',
//       message: 'Invalid token. Please log in again!'
//     });
//   }
// };

// // Restrict to certain roles
// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         status: 'fail',
//         message: 'You do not have permission to perform this action'
//       });
//     }
//     next();
//   };
// };

// module.exports = {
//   protect,
//   restrictTo
// };


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['authorization']) {
      token = req.headers['authorization'];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'No token provided.'
      });
    }

    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

    // 2. Find user AND exclude password field
    const currentUser = await User.findById(decoded.id).select('-password');
    
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 3. Check account status
    if (!currentUser.canLogin) {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account is deactivated.'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    // Specific error messages for the frontend
    let message = 'Invalid token.';
    if (error.name === 'TokenExpiredError') message = 'Token expired. Please login again.';

    return res.status(401).json({
      status: 'fail',
      message: message
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user was populated in the 'protect' middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied: insufficient permissions.'
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };