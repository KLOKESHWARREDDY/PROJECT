const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      console.log('🔐 JWT Token received:', token?.substring(0, 20) + '...');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('🔐 JWT Decoded:', decoded);

      // Try both id and _id from decoded token
      const userId = decoded.id || decoded._id;
      
      if (!userId) {
        console.error('❌ No user ID in token');
        return res.status(401).json({ message: 'Invalid token - no user ID' });
      }

      req.user = await User.findById(userId).select('-password');
      
      if (!req.user) {
        console.error('❌ User not found in database');
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('✅ User authenticated:', req.user.email);
      
      next();
    } catch (error) {
      console.error('❌ JWT Verify Error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed: ' + error.message });
    }
  } else {
    console.error('❌ No authorization header');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
