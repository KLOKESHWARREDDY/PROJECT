const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isTeacher } = require('../middleware/roleMiddleware');
const {
  registerEvent,
  getMyRegistrations,
  getEventRegistrations,
  getAllPendingRegistrations,
  approveRegistration,
  rejectRegistration,
} = require('../controllers/registrationController');

// Student routes
router.post('/register', protect, registerEvent); // Register for an event
router.get('/my-registrations', protect, getMyRegistrations); // Get student's registrations

// Teacher routes (for their events)
router.get('/all', protect, isTeacher, getAllPendingRegistrations); // Get all pending registrations across all teacher's events
router.get('/event/:eventId', protect, isTeacher, getEventRegistrations);
router.put('/:id/approve', protect, isTeacher, approveRegistration);
router.put('/:id/reject', protect, isTeacher, rejectRegistration);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Registration routes working' });
});

module.exports = router;
