/**
 * Role-based Authorization Middleware
 * =============================================================================
 * Purpose: Restricts access to routes based on user roles
 * 
 * These middleware functions are used after the authMiddleware to ensure
 * users have the appropriate permissions for specific operations.
 * 
 * Functions:
 * - isTeacher: Allows only teachers to proceed
 * - isStudent: Allows only students to proceed
 * 
 * Usage: Use after the protect middleware in route definitions
 * Example: router.post('/events', protect, isTeacher, createEvent)
 * 
 * Error Response:
 * - 403 Forbidden: User does not have required role
 * =============================================================================
 */

export const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
};

export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Students only.' });
  }
};

export default { isTeacher, isStudent };
