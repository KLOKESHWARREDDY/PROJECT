import express from "express";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead,
  deleteNotification 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for logged-in user
router.get("/", protect, getNotifications);

// Mark single notification as read
router.put("/:id/read", protect, markAsRead);

// Mark all notifications as read
router.put("/read-all", protect, markAllAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

export default router;
