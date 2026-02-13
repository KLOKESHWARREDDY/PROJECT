const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { isTeacher } = require('../middleware/roleMiddleware');

// Event Routes
router.get('/', protect, getEvents);
router.post('/', protect, isTeacher, createEvent);

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Events routes working" });
});

module.exports = router;
