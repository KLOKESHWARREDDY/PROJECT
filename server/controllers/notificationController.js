import Notification from '../models/Notification.js';

// NOTIFICATION CONTROLLER - Handles user notifications
// This controller manages notifications for events, registrations, and system updates

// GET NOTIFICATIONS - Returns all notifications for logged-in user
// Step 1: Get user ID from authentication middleware
// Step 2: Query MongoDB for notifications matching user ID
// Step 3: Sort by creation date (newest first)
// Step 4: Limit to 50 most recent notifications
// Step 5: Count unread notifications
// Step 6: Return notifications array and unread count
// Request: GET /api/notifications (requires authentication)
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching notifications' });
  }
};

// CREATE NOTIFICATION - Helper function to create notification (used internally)
// Step 1: Accept userId, title, message, type, and optional relatedId
// Step 2: Create notification object in MongoDB
// Step 3: Return created notification or null on error
// This is called by other controllers when events occur
const createNotification = async (userId, title, message, type, relatedId = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId
    });
    
    return notification;
  } catch (error) {
    console.error('Create Notification Error:', error);
    return null;
  }
};

// MARK AS READ - Marks single notification as read
// Step 1: Extract notification ID from request parameters
// Step 2: Get user ID from authentication middleware
// Step 3: Find and update notification - set isRead to true
// Step 4: Only update if notification belongs to user
// Step 5: Return updated notification
// Request: PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { isRead: true } },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Mark Read Error:', error);
    res.status(500).json({ message: error.message || 'Server error marking notification' });
  }
};

// MARK ALL AS READ - Marks all user notifications as read
// Step 1: Get user ID from authentication middleware
// Step 2: Update all notifications where isRead is false
// Step 3: Set isRead to true for all
// Step 4: Return success message
// Request: PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    
    await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark All Read Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// DELETE NOTIFICATION - Removes a notification
// Step 1: Extract notification ID from request parameters
// Step 2: Get user ID from authentication middleware
// Step 3: Find and delete notification from database
// Step 4: Only delete if notification belongs to user
// Step 5: Return success message
// Request: DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    await Notification.findOneAndDelete({ _id: id, user: userId });
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
