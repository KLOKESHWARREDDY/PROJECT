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

// EVENT ROUTES - Handles event CRUD operations
// Teachers can create/update/delete events, students can view published events

// GET /api/events - Get all published events (requires authentication)
router.get('/', protect, getEvents);

// GET /api/events/my-events - Get teacher's own events (requires teacher role)
router.get('/my-events', protect, isTeacher, getTeacherEvents);

// GET /api/events/:id - Get single event by ID
router.get('/:id', protect, getEventById);

// POST /api/events - Create new event (teacher only)
router.post('/', protect, isTeacher, createEvent);

// PUT /api/events/:id - Update event (teacher only)
router.put('/:id', protect, isTeacher, updateEvent);

// DELETE /api/events/:id - Delete event (teacher only) - soft delete
router.delete('/:id', protect, isTeacher, deleteEvent);

// DRAFT + PUBLISH ROUTES
// PUT /api/events/:id/publish - Publish event (teacher only)
router.put('/:id/publish', protect, isTeacher, publishEvent);

// PUT /api/events/:id/unpublish - Unpublish event (teacher only)
router.put('/:id/unpublish', protect, isTeacher, unpublishEvent);

// PUT /api/events/:id/complete - Mark event as completed (teacher only)
router.put('/:id/complete', protect, isTeacher, completeEvent);

// PUT /api/events/:id/schedule - Schedule event publish (teacher only)
router.put('/:id/schedule', protect, isTeacher, schedulePublishEvent);

// TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Events routes working" });
});

export default router;
