const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Get all events (Student & Teacher)
router.get('/', protect, getEvents);

// Create event (Teacher only)
router.post('/', protect, authorize('teacher'), createEvent);

module.exports = router;
