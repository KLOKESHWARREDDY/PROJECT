import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';

// EVENT CONTROLLER - Handles all event-related operations
// This controller manages creating, reading, updating, and deleting events
// Teachers can create events, students can view published events

// CREATE EVENT - Teacher creates a new event
// Step 1: Extract event data from request body (title, description, date, location, etc.)
// Step 2: Check if user is authenticated (req.user must exist)
// Step 3: Set default status to 'draft' unless explicitly set to 'published'
// Step 4: Save new event to MongoDB with teacher reference
// Step 5: Return created event data to client
// Request: POST /api/events with body containing event details
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, image, status } = req.body;

    // For publishing, require all fields
    if (status === 'published') {
      if (!title || !description || !date || !location) {
        return res.status(400).json({ message: 'Please fill all fields to publish' });
      }
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Default status is 'draft' unless explicitly set
    const eventStatus = status || 'draft';

    const event = await Event.create({
      title: title || "Untitled Draft",
      description: description || "",
      date: date || "",
      location: location || "",
      category: category || 'Tech',
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      teacher: req.user._id,
      createdBy: req.user._id,
      status: eventStatus,
      publishedAt: eventStatus === 'published' ? new Date() : null,
    });

    await event.populate('teacher', 'name email');

    res.status(201).json(event);

  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating event' });
  }
};

// GET ALL EVENTS - Returns published events for students
// Step 1: Query MongoDB for events with status 'published' and isDeleted false
// Step 2: Populate teacher field with name and email for display
// Step 3: Sort by publishedAt date (newest first)
// Step 4: Return array of events to client
// Request: GET /api/events (public endpoint)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: 'published',
      isDeleted: false
    })
      .populate('teacher', 'name email')
      .sort({ publishedAt: -1, createdAt: -1 });

    console.log("Events from DB (public):", events.length);
    res.json(events);
  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching events' });
  }
};

// GET TEACHER'S EVENTS - Returns all events created by the logged-in teacher
// Step 1: Verify user is authenticated
// Step 2: Query MongoDB for events where teacher matches current user
// Step 3: Include all event statuses (draft, published, archived)
// Step 4: Populate teacher details
// Step 5: Return teacher's events
// Request: GET /api/events/my-events (requires teacher authentication)
export const getTeacherEvents = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log("Logged user:", req.user._id);

    // Teacher can see all their events including drafts and archived
    const events = await Event.find({
      teacher: req.user._id,
      $or: [
        { isDeleted: { $exists: false } },
        { isDeleted: false }
      ]
    })
      .populate('teacher', 'name email')
      .sort({ updatedAt: -1, createdAt: -1 });

    console.log("Teacher events found:", events.length);
    res.json(events);
  } catch (error) {
    console.error('Get Teacher Events Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching events' });
  }
};

// GET SINGLE EVENT - Returns event details by ID
// Step 1: Extract event ID from request parameters
// Step 2: Find event in MongoDB by ID
// Step 3: Check if user is event owner OR event is published
// Step 4: If not authorized, return 403 error
// Step 5: Return event data
// Request: GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    console.log("User:", req.user);

    const event = await Event.findById(req.params.id)
      .populate("teacher", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If user is not the creator and event is not published, deny access
    const isOwner = req.user && req.user._id && event.teacher._id.toString() === req.user._id.toString();
    const isPublished = event.status === 'published';

    if (!isOwner && !isPublished) {
      return res.status(403).json({ message: "Event not found" });
    }

    res.json(event);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE EVENT - Updates event details
// Step 1: Extract event ID from request parameters
// Step 2: Extract update data from request body
// Step 3: Build query - only teacher who owns event can update
// Step 4: Update event in MongoDB with new data
// Step 5: If title/date/location changed, notify registered students
// Step 6: Return updated event
// Request: PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Update - ID:", id);
    console.log("Update - User:", req.user);
    console.log("Update - Data:", updates);

    // Build query - filter by teacher for teachers
    const query = { _id: id };
    if (req.user.role === 'teacher') {
      query.teacher = req.user._id;
    }

    // Only remove these fields for security
    delete updates.archivedAt;
    delete updates.createdBy;
    // Allow status and publishedAt to be updated

    // Find and update the event
    const event = await Event.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('teacher', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log("Updated event:", event);

    // Notify registered students about updates (only if important fields changed)
    // We check if title, date, or location changed
    if (updates.title || updates.date || updates.location) {
      const registrations = await Registration.find({ event: id, status: 'approved' });
      for (const reg of registrations) {
        await createNotification(
          reg.student,
          'Event Updated',
          `The event "${event.title}" has been updated. Check the details for changes.`,
          'general',
          id
        );
      }
    }

    res.json(event);
  } catch (error) {
    console.error('Update Event Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating event' });
  }
};

// DELETE EVENT - Soft deletes an event (marks as archived)
// Step 1: Extract event ID from request parameters
// Step 2: Verify user is authenticated
// Step 3: Find and update event - set isDeleted true and status 'archived'
// Step 4: Only the event owner (teacher) can delete
// Step 5: Notify all registered students about deletion
// Step 6: Return success message
// Request: DELETE /api/events/:id (requires teacher authentication)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Delete - ID:", id);
    console.log("Delete - User:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Soft delete - just mark isDeleted as true
    const event = await Event.findOneAndUpdate(
      { _id: id, teacher: req.user._id },
      { $set: { isDeleted: true, status: 'archived' } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log('Event soft deleted:', id);

    res.json({
      message: 'Event deleted successfully',
      eventId: id
    });

    // Notify all registered students about event deletion
    const registrations = await Registration.find({ event: id });
    for (const reg of registrations) {
      await createNotification(
        reg.student,
        'Event Deleted',
        `The event "${event.title}" has been deleted by the organizer.`,
        'delete',
        id
      );
    }
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};

// ========== DRAFT + PUBLISH SYSTEM ==========

// Helper to create notification
const createNotification = async (userId, title, message, type, relatedId = null) => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// PUBLISH EVENT - Makes event visible to students
// Step 1: Extract event ID from request parameters
// Step 2: Verify user is authenticated
// Step 3: Update event status to 'published' and set publishedAt timestamp
// Step 4: Only the event owner can publish
// Step 5: Notify approved registrants about the published event
// Step 6: Return success message with updated event
// Request: PUT /api/events/:id/publish (requires teacher authentication)
export const publishEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, teacher: req.user._id },
      {
        $set: {
          status: 'published',
          publishedAt: new Date(),
          archivedAt: null
        }
      },
      { new: true }
    ).populate('teacher', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log('Event published:', id);
    res.json({ message: 'Event published successfully', event });

    // Notify all registered students about the event
    const registrations = await Registration.find({ event: id, status: 'approved' });
    for (const reg of registrations) {
      await createNotification(
        reg.student,
        'Event Published',
        `The event "${event.title}" is now live!`,
        'publish',
        id
      );
    }
  } catch (error) {
    console.error('Publish Event Error:', error);
    res.status(500).json({ message: error.message || 'Server error publishing event' });
  }
};

// UNPUBLISH EVENT - Reverts event back to draft status
// Step 1: Extract event ID from request parameters
// Step 2: Verify user is authenticated
// Step 3: Update event status back to 'draft' and clear publishedAt
// Step 4: Only the event owner can unpublish
// Step 5: Return success message with updated event
// Request: PUT /api/events/:id/unpublish (requires teacher authentication)
export const unpublishEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, teacher: req.user._id },
      {
        $set: {
          status: 'draft',
          publishedAt: null
        }
      },
      { new: true }
    ).populate('teacher', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log('Event unpublished:', id);
    res.json({ message: 'Event unpublished successfully', event });
  } catch (error) {
    console.error('Unpublish Event Error:', error);
    res.status(500).json({ message: error.message || 'Server error unpublishing event' });
  }
};

// COMPLETE EVENT - Marks event as finished
// Step 1: Extract event ID from request parameters
// Step 2: Verify user is authenticated
// Step 3: Update event status to 'completed'
// Step 4: Only the event owner can mark as completed
// Step 5: Return success message with updated event
// Request: PUT /api/events/:id/complete (requires teacher authentication)
export const completeEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, teacher: req.user._id },
      {
        $set: {
          status: 'completed',
          publishedAt: null
        }
      },
      { new: true }
    ).populate('teacher', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log('Event completed:', id);
    res.json({ message: 'Event marked as completed', event });
  } catch (error) {
    console.error('Complete Event Error:', error);
    res.status(500).json({ message: error.message || 'Server error completing event' });
  }
};

// SCHEDULE PUBLISH EVENT - Sets a future date to automatically publish
// Step 1: Extract event ID from request parameters
// Step 2: Extract publishAt date from request body
// Step 3: Verify user is authenticated
// Step 4: Validate that schedule date is in the future
// Step 5: Update event with scheduled publish date
// Step 6: Return success message with event
// Request: PUT /api/events/:id/schedule (requires teacher authentication)
export const schedulePublishEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { publishAt } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!publishAt) {
      return res.status(400).json({ message: 'Schedule date is required' });
    }

    const scheduleDate = new Date(publishAt);
    if (scheduleDate <= new Date()) {
      return res.status(400).json({ message: 'Schedule date must be in the future' });
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, teacher: req.user._id },
      {
        $set: {
          status: 'draft',
          publishAt: scheduleDate
        }
      },
      { new: true }
    ).populate('teacher', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log('Event scheduled for publish:', id, 'at', scheduleDate);
    res.json({ message: 'Event scheduled for publish', event });
  } catch (error) {
    console.error('Schedule Publish Error:', error);
    res.status(500).json({ message: error.message || 'Server error scheduling event' });
  }
};
