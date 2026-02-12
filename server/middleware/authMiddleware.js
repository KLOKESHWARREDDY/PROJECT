const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // ✅ CHECK FOR TOKEN IN HEADER
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // ✅ DEBUG: Log token (remove in production)
      console.log('🔐 Token received:', token ? token.substring(0, 20) + '...' : 'EMPTY');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ DEBUG: Log decoded payload
      console.log('🔐 Decoded payload:', decoded);

      // Get user from database (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      // ✅ DEBUG: Check if user found
      if (!user) {
        console.log('❌ User not found for ID:', decoded.id);
        return res.status(401).json({ message: 'User not found for this token' });
      }

      console.log('✅ User authenticated:', user.email, '- Role:', user.role);

      // Attach user to request object
      req.user = user;

      next();
    } catch (error) {
      // ✅ Provide specific error messages
      console.error('❌ Token verification failed:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please login again' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  } else {
    // ✅ Provide specific error
    console.log('❌ No authorization header found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
