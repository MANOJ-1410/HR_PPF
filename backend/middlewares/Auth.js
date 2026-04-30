const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ensureAuthenticated = async (req, res, next) => {
    // Check for token in headers OR cookies
    const authHeader = req.headers['authorization'];
    const cookieToken = req.cookies?.token;
    
    const token = authHeader || cookieToken;

    if (!token) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token is required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_SECRET_KEY');
        
        // Enhanced: Get full user details from database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(403)
                .json({ message: 'User not found' });
        }
        
        // Check if user can access protected routes
        if (!user.canLogin) {
            return res.status(403)
                .json({ message: 'Access denied for your account type' });
        }
        
        req.user = user; // Full user object instead of just decoded token
        next();
    } catch (err) {
        return res.status(403)
            .json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

module.exports = ensureAuthenticated;