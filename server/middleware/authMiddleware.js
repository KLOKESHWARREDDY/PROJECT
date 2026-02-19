import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Middleware
 * =============================================================================
 * Purpose: Protects routes by verifying JWT tokens
 * 
 * This middleware checks if a request has a valid authentication token.
 * If valid, it attaches the user object to the request for downstream use.
 * 
 * How it works:
 * 1. Extracts token from Authorization header (Bearer scheme)
 * 2. Verifies token using JWT_SECRET from environment
 * 3. Looks up user by ID from token payload
 * 4. Attaches user to req.user (without password)
 * 5. Calls next() to pass control to the route handler
 * 
 * Token Format: Bearer <jwt_token>
 * 
 * Error Responses:
 * - 401: No token, invalid token, or user not found
 * =============================================================================
 */

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eventsphere_secret_key_2024');
      
      console.log('[Auth Middleware] Decoded token:', decoded);

      // Get user from token - use id from JWT payload
      const userId = decoded.id || decoded._id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Invalid token - no user ID' });
      }
      
      const user = await User.findById(userId).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Set user on request - ensure both _id and id are available
      req.user = {
        _id: user._id,
        id: user._id.toString(),
        ...user.toObject()
      };
      
      console.log('[Auth Middleware] User authenticated:', req.user.email, 'Role:', req.user.role);

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default { protect };
