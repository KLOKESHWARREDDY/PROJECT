import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Ticket from '../models/Ticket.js';

// Create Event (Teacher only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      teacher: req.user._id,
    });

    await event.populate('teacher', 'name email');

    res.status(201).json(event);

  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating event' });
  }
};

// Get ALL Events - For Students (only active events)
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "active" })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });
    
    console.log("Events from DB:", events);
    res.json(events);
  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching events' });
  }
};

// Get Teacher's Events (only events created by logged-in teacher)
export const getTeacherEvents = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log("Logged user:", req.user._id);
    
    const events = await Event.find({ teacher: req.user._id })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });
    
    console.log("Events found:", events.length);
    res.json(events);
  } catch (error) {
    console.error('Get Teacher Events Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching events' });
  }
};

// Get Single Event by ID
export const getEventById = async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    console.log("User:", req.user);

    // Build query - if user is teacher, filter by teacher
    const query = { _id: req.params.id };
    if (req.user.role === 'teacher') {
      query.teacher = req.user._id;
    }
    
    const event = await Event.findOne(query)
      .populate("teacher", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Update - ID:", id);
    console.log("Update - User:", req.user);

    // Build query - filter by teacher for teachers
    const query = { _id: id };
    if (req.user.role === 'teacher') {
      query.teacher = req.user._id;
    }

    // Find and update the event
    const event = await Event.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('teacher', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Update Event Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating event' });
  }
};

// Delete Event - Also deletes related registrations and tickets
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("Delete - ID:", id);
    console.log("Delete - User:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Only allow the teacher who created the event to delete it
    const event = await Event.findOneAndDelete({
      _id: id,
      teacher: req.user._id
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    console.log('Event deleted:', id);
    
    // Delete all related registrations
    const deletedRegistrations = await Registration.deleteMany({ event: id });
    console.log('Registrations deleted:', deletedRegistrations.deletedCount);
    
    // Delete all related tickets
    const deletedTickets = await Ticket.deleteMany({ event: id });
    console.log('Tickets deleted:', deletedTickets.deletedCount);
    
    res.json({ 
      message: 'Event deleted successfully', 
      eventId: id,
      registrationsDeleted: deletedRegistrations.deletedCount,
      ticketsDeleted: deletedTickets.deletedCount
    });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};
