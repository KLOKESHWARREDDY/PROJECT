import express from "express";
import { 
  createEvent, 
  getEvents, 
  getTeacherEvents, 
  getEventById, 
  updateEvent, 
  deleteEvent,
  publishEvent,
  unpublishEvent,
  completeEvent,
  schedulePublishEvent
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTeacher } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Event Routes
router.get('/', protect, getEvents);  // Get all published events (public)
router.get('/my-events', protect, isTeacher, getTeacherEvents);  // Get only THIS teacher's events (all)
router.get('/:id', protect, getEventById);  // Get single event by ID
router.post('/', protect, isTeacher, createEvent);  // Create event (teacher only)
router.put('/:id', protect, isTeacher, updateEvent);  // Update event (teacher only)
router.delete('/:id', protect, isTeacher, deleteEvent);  // Delete event (teacher only) - soft delete

// ========== Draft + Publish Routes ==========
router.put('/:id/publish', protect, isTeacher, publishEvent);  // Publish event
router.put('/:id/unpublish', protect, isTeacher, unpublishEvent);  // Unpublish event (back to draft)
router.put('/:id/complete', protect, isTeacher, completeEvent);  // Archive event
router.put('/:id/schedule', protect, isTeacher, schedulePublishEvent);  // Schedule publish

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Events routes working" });
});

export default router;
