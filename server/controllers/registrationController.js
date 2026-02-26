import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Ticket from '../models/Ticket.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import QRCode from 'qrcode';
import { generateTicketPDF } from '../services/ticketService.js';
import { sendTicketConfirmationEmail } from '../services/emailService.js';

// REGISTRATION CONTROLLER - Handles student event registrations
// This controller manages registration creation, approval, rejection, and cancellation
// Students register for events, teachers approve/reject registrations

// Helper function to create notification - used internally
// Step 1: Create notification object with user, title, message, type
// Step 2: Save to MongoDB
// Step 3: Handle any errors silently (non-blocking)
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

// CREATE REGISTRATION - Student registers for an event
// Step 1: Extract eventId from request body
// Step 2: Get student ID from authenticated user (req.user)
// Step 3: Validate eventId is provided
// Step 4: Check if event exists in database
// Step 5: Check if student already registered for this event
// Step 6: Create new registration with status 'pending'
// Step 7: Send notification to event teacher
// Step 8: Return success message with registration data
// Request: POST /api/registrations with body { eventId }
export const createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    console.log("=== CREATE REGISTRATION ===");
    console.log("eventId:", eventId);
    console.log("studentId:", studentId);

    // Validate eventId is provided
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      student: studentId,
      event: eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: 'Already registered for this event',
        status: existingRegistration.status
      });
    }

    // Create registration
    const registration = await Registration.create({
      student: studentId,
      event: eventId,
      teacher: event.teacher,
      status: 'pending',
    });

    console.log("Registration created:", registration._id);

    // Populate for response
    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    // Send notification to teacher
    const eventWithTeacher = await Event.findById(eventId).populate('teacher', 'name');
    await createNotification(
      eventWithTeacher.teacher._id,
      'New Registration',
      `A student registered for your event "${eventWithTeacher.title}"`,
      'registration',
      registration._id
    );

    // Send confirmation notification to student
    await createNotification(
      studentId,
      'Registration Requested',
      `You successfully requested to join "${eventWithTeacher.title}". Status: Pending.`,
      'registration_sent',
      registration._id
    );

    res.status(201).json({
      message: 'Registration successful! Awaiting approval.',
      registration,
    });
  } catch (error) {
    console.error('Create Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET STUDENT REGISTRATIONS - Returns all registrations for a specific student
// Step 1: Extract student ID from request parameters
// Step 2: Verify requesting user owns these registrations
// Step 3: Query MongoDB for registrations matching student ID
// Step 4: Populate event and teacher details
// Step 5: Sort by creation date (newest first)
// Step 6: Return array of registrations
// Request: GET /api/registrations/student/:id
export const getStudentRegistrations = async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log("=== GET STUDENT REGISTRATIONS ===");
    console.log("Student ID from params:", studentId);
    console.log("Current user:", req.user._id);

    // Ensure user can only see their own registrations
    if (studentId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ student: studentId })
      .populate('event', 'title date location description image')
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    console.log("Found registrations:", registrations.length);
    res.json(registrations);
  } catch (error) {
    console.error('Get Student Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// GET TEACHER REGISTRATIONS - Returns all registrations for teacher's events
// Step 1: Get teacher ID from authenticated user
// Step 2: Query MongoDB for registrations where teacher matches logged in user
// Step 3: Populate student and event details
// Step 4: Sort by creation date (newest first)
// Step 5: Return array of all registrations across teacher's events
// Request: GET /api/registrations/teacher (requires teacher authentication)
export const getTeacherRegistrations = async (req, res) => {
  try {
    console.log("=== GET TEACHER REGISTRATIONS ===");
    console.log("Teacher ID:", req.user._id);

    // Find all registrations where teacher matches logged-in teacher
    const registrations = await Registration.find({ teacher: req.user._id })
      .populate('student', 'name email college regNo department')
      .populate('event', 'title date location')
      .sort({ createdAt: -1 });

    console.log("Found registrations:", registrations.length);
    res.json(registrations);
  } catch (error) {
    console.error('Get Teacher Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};


// Get registrations for a specific event (Teacher only)
export const getEventRegistrations = async (req, res) => {
  try {
    const { id } = req.params; // Event ID
    console.log("=== GET EVENT REGISTRATIONS ===");
    console.log("Event ID:", id);
    console.log("Teacher ID:", req.user._id);

    // Verify event exists and belongs to teacher
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ event: id })
      .populate('student', 'name email college regNo department')
      .populate('event', 'title date location')
      .sort({ createdAt: -1 });

    console.log(`Found ${registrations.length} registrations for event ${id}`);
    res.json(registrations);
  } catch (error) {
    console.error('Get Event Registrations Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// APPROVE REGISTRATION - Teacher approves a student's registration
// Flow:
//  1. Verify registration exists and teacher owns the event
//  2. Update registration status → 'approved'
//  3. Generate unique ticket code + QR code data URL
//  4. Persist Ticket document (including qrCode, issuedAt, emailSent=false)
//  5. Generate PDF in memory via ticketService
//  6. Send confirmation email + PDF attachment via emailService (non-blocking)
//  7. Mark ticket.emailSent = true on success
//  8. Notify student via in-app notification
// Request: PUT /api/registrations/approve/:id  (teacher only)
export const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== APPROVE REGISTRATION ===');
    console.log('Registration ID:', id);

    // ── 1. Fetch registration ─────────────────────────────────────────────
    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // ── 2. Verify teacher owns the event ──────────────────────────────────
    const event = await Event.findById(registration.event);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to approve this registration' });
    }

    // Guard: skip if already approved (idempotent)
    if (registration.status === 'approved') {
      return res.status(200).json({
        message: 'Registration already approved',
        registration,
      });
    }

    // ── 3. Fetch full student details ─────────────────────────────────────
    const student = await User.findById(registration.student).select(
      'name email college regNo department'
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // ── 4. Update registration status ─────────────────────────────────────
    registration.status = 'approved';
    await registration.save();

    // ── 5. Generate unique ticket code ────────────────────────────────────
    const ticketCode =
      'TKT-' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    // ── 6. Generate QR code data URL ──────────────────────────────────────
    const qrPayload = JSON.stringify({
      ticketCode,
      eventId: registration.event.toString(),
      studentId: registration.student.toString(),
    });
    const qrCodeDataURL = await QRCode.toDataURL(qrPayload, { width: 200 });

    // ── 7. Persist Ticket document ────────────────────────────────────────
    const ticket = await Ticket.create({
      student: registration.student,
      event: registration.event,
      registration: registration._id,
      ticketCode,
      qrCode: qrCodeDataURL,
      issuedAt: new Date(),
      emailSent: false,
    });

    // Store ticketId reference on registration
    registration.ticketId = ticket.ticketCode;
    await registration.save();

    // Populate for response
    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location category');

    // ── 8. Respond immediately so the teacher isn't waiting ───────────────
    res.json({
      message: 'Registration approved! Confirmation email is being sent.',
      registration,
      ticket: { ticketCode: ticket.ticketCode },
    });

    // ── 9. Generate PDF & send email (non-blocking) ───────────────────────
    // Running after res.json() so email delivery time doesn't affect API latency.
    (async () => {
      try {
        console.log(`[approveRegistration] Generating PDF for ticket ${ticketCode}…`);

        const pdfBuffer = await generateTicketPDF({
          ticketCode,
          event: {
            _id: event._id,
            title: event.title,
            date: event.date,
            location: event.location,
            category: event.category,
          },
          student: {
            _id: student._id,
            name: student.name,
            email: student.email,
            regNo: student.regNo,
            department: student.department,
            college: student.college,
          },
        });

        console.log(`[approveRegistration] PDF generated (${pdfBuffer.length} bytes). Sending email…`);

        await sendTicketConfirmationEmail({
          to: student.email,
          student,
          event,
          ticketCode,
          pdfBuffer,
        });

        // Mark email as sent in DB
        await Ticket.findByIdAndUpdate(ticket._id, { emailSent: true });
        console.log(`✅ [approveRegistration] Email sent and ticket updated for ${student.email}`);
      } catch (emailErr) {
        // Log but never crash — approval already succeeded
        console.error(
          `❌ [approveRegistration] Failed to send ticket email for ${ticketCode}:`,
          emailErr.message
        );
      }
    })();

    await createNotification(
      registration.student._id,
      'Registration Approved 🎉',
      `Your registration for "${event.title}" has been approved! Check your email for the ticket.`,
      'approval',
      registration._id
    );

    // ── 11. Popularity Check & Notification ──────────────────────────────────
    // If the event hits exactly 5 approved registrations, trigger "Popular Event" notification
    const approvedCount = await Registration.countDocuments({ event: event._id, status: 'approved' });
    if (approvedCount === 5) {
      console.log(`[approveRegistration] Event ${event.title} reached popularity threshold! Sending notifications.`);
      // Find students who haven't registered
      const allStudents = await User.find({ role: 'student' });
      const currentRegistrations = await Registration.find({ event: event._id });
      const registeredStudentIds = currentRegistrations.map(r => r.student.toString());

      const unnotifiedStudents = allStudents.filter(s => !registeredStudentIds.includes(s._id.toString()));

      const popularNotifications = unnotifiedStudents.map(student => ({
        user: student._id,
        title: 'Trending Event 🔥',
        message: `Spots are filling up fast for "${event.title}". Check it out now!`,
        type: 'popular_event',
        relatedId: event._id
      }));

      if (popularNotifications.length > 0) {
        await Notification.insertMany(popularNotifications);
      }
    }

    console.log('Registration approved successfully:', id);

  } catch (error) {
    console.error('Approve Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error approving registration' });
  }
};

// REJECT REGISTRATION - Teacher rejects a student's registration
// Step 1: Extract registration ID from request parameters
// Step 2: Find registration in database
// Step 3: Verify teacher owns the event
// Step 4: Update registration status to 'rejected'
// Step 5: Send notification to student
// Step 6: Return success message
// Request: PUT /api/registrations/:id/reject
export const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("=== REJECT REGISTRATION ===");
    console.log("Registration ID:", id);

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Verify teacher owns the event
    const event = await Event.findById(registration.event);
    if (event.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status
    registration.status = 'rejected';
    await registration.save();

    await registration.populate('student', 'name email');
    await registration.populate('event', 'title date location');

    console.log("Registration rejected successfully");

    // Send notification to student
    await createNotification(
      registration.student._id,
      'Registration Rejected',
      `Your registration for "${registration.event.title}" has been rejected.`,
      'rejection',
      registration._id
    );

    res.json({
      message: 'Registration rejected',
      registration,
    });
  } catch (error) {
    console.error('Reject Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// CANCEL REGISTRATION - Student cancels their own registration
// Step 1: Extract registration ID from request parameters
// Step 2: Get user ID from authenticated user
// Step 3: Find registration in database
// Step 4: Verify student owns this registration
// Step 5: If already approved, also delete the associated ticket
// Step 6: Delete registration from database
// Step 7: Return success message
// Request: DELETE /api/registrations/:id (student only)
export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("=== CANCEL REGISTRATION ===");
    console.log("Registration ID:", id);
    console.log("User ID:", req.user._id);

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Verify student owns the registration
    console.log("Registration student:", registration.student);
    console.log("User ID:", req.user._id);

    if (registration.student.toString() !== req.user._id.toString()) {
      console.log("Authorization failed!");
      return res.status(403).json({ message: 'Not authorized to cancel this registration' });
    }

    // Check if already approved - if so, also delete ticket
    if (registration.status === 'approved') {
      await Ticket.deleteOne({ registration: id });
    }

    // Delete registration
    await Registration.findByIdAndDelete(id);

    console.log("Registration cancelled successfully");
    res.json({
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get single registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id)
      .populate('student', 'name email')
      .populate('event', 'title date location')
      .populate('teacher', 'name')
      .lean();

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Append ticket data if it exists (handles older records without ticketId in schema)
    const ticket = await Ticket.findOne({ registration: id });
    if (ticket) {
      registration.ticketCode = ticket.ticketCode;
      registration.qrCode = ticket.qrCode;
    }

    res.json(registration);
  } catch (error) {
    console.error('Get Registration Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get pending registrations count for teacher's events
export const getPendingRegistrationsCount = async (req, res) => {
  try {
    console.log("=== GET PENDING REGISTRATIONS COUNT ===");
    console.log("Teacher ID:", req.user._id);

    // Count registrations where teacher matches logged-in teacher AND status is pending
    const count = await Registration.countDocuments({
      teacher: req.user._id,
      status: 'pending'
    });

    console.log("Pending registrations count:", count);
    res.json({ count });
  } catch (error) {
    console.error('Get Pending Count Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// APPROVE ALL REGISTRATIONS
export const approveAllRegistrations = async (req, res) => {
  try {
    const { registrationIds } = req.body;
    console.log("=== APPROVE ALL REGISTRATIONS ===");
    console.log("Registration IDs:", registrationIds);

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return res.status(400).json({ message: 'No registration IDs provided' });
    }

    const results = [];
    const errors = [];

    // Process each registration
    // Note: We process them sequentially to avoid race conditions and ensure proper ticket generation
    for (const id of registrationIds) {
      try {
        const registration = await Registration.findById(id);
        if (!registration) {
          errors.push({ id, message: 'Registration not found' });
          continue;
        }

        // Verify teacher owns the event
        const event = await Event.findById(registration.event);
        if (!event) {
          errors.push({ id, message: 'Event not found' });
          continue;
        }

        if (event.teacher.toString() !== req.user._id.toString()) {
          errors.push({ id, message: 'Not authorized' });
          continue;
        }

        if (registration.status === 'approved') {
          // Already approved, just skip or add to results if needed
          results.push(registration);
          continue;
        }

        // Update status
        registration.status = 'approved';
        await registration.save();

        // Generate unique ticket code
        const ticketCode =
          'TKT-' +
          Date.now().toString(36).toUpperCase() +
          Math.random().toString(36).substring(2, 8).toUpperCase();

        const qrPayload = JSON.stringify({
          ticketCode,
          eventId: registration.event.toString(),
          studentId: registration.student.toString(),
        });
        const qrCodeDataURL = await QRCode.toDataURL(qrPayload, { width: 200 });

        // Persist ticket document
        const ticket = await Ticket.create({
          student: registration.student,
          event: registration.event,
          registration: registration._id,
          ticketCode,
          qrCode: qrCodeDataURL,
          issuedAt: new Date(),
          emailSent: false,
        });

        registration.ticketId = ticket.ticketCode;
        await registration.save();

        // Fire-and-forget: generate PDF + send email (does NOT block the loop)
        const studentDoc = await User.findById(registration.student)
          .select('name email college regNo department');

        if (studentDoc) {
          (async () => {
            try {
              const pdfBuffer = await generateTicketPDF({
                ticketCode,
                event: {
                  _id: event._id, title: event.title,
                  date: event.date, location: event.location, category: event.category,
                },
                student: {
                  _id: studentDoc._id, name: studentDoc.name, email: studentDoc.email,
                  regNo: studentDoc.regNo, department: studentDoc.department,
                },
              });
              await sendTicketConfirmationEmail({
                to: studentDoc.email, student: studentDoc,
                event, ticketCode, pdfBuffer,
              });
              await Ticket.findByIdAndUpdate(ticket._id, { emailSent: true });
              console.log(`✅ Bulk approval email sent: ${ticketCode} → ${studentDoc.email}`);
            } catch (emailErr) {
              console.error(`❌ Bulk email failed for ticket ${ticketCode}:`, emailErr.message);
            }
          })();
        }

        // In-app notification
        await createNotification(
          registration.student,
          'Registration Approved 🎉',
          `Your registration for "${event.title}" has been approved! Check your email for the ticket.`,
          'approval',
          registration._id
        );

        // ── Popularity Check & Notification ──────────────────────────────────
        // If the event hits exactly 5 approved registrations, trigger "Popular Event" notification
        const approvedCount = await Registration.countDocuments({ event: event._id, status: 'approved' });
        if (approvedCount === 5) {
          console.log(`[approveAllRegistrations] Event ${event.title} reached popularity threshold! Sending notifications.`);
          // Find students who haven't registered
          const allStudents = await User.find({ role: 'student' });
          const currentRegistrations = await Registration.find({ event: event._id });
          const registeredStudentIds = currentRegistrations.map(r => r.student.toString());

          const unnotifiedStudents = allStudents.filter(s => !registeredStudentIds.includes(s._id.toString()));

          const popularNotifications = unnotifiedStudents.map(student => ({
            user: student._id,
            title: 'Trending Event 🔥',
            message: `Spots are filling up fast for "${event.title}". Check it out now!`,
            type: 'popular_event',
            relatedId: event._id
          }));

          if (popularNotifications.length > 0) {
            await Notification.insertMany(popularNotifications);
          }
        }

        results.push({ ...registration.toObject(), ticketId: ticket.ticketCode });

      } catch (err) {
        console.error(`Error approving registration ${id}:`, err);
        errors.push({ id, message: err.message });
      }
    }

    console.log(`Approved ${results.length} registrations, ${errors.length} failed`);
    res.json({
      message: `Approved ${results.length} registrations`,
      results,
      errors
    });

  } catch (error) {
    console.error('Approve All Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// REJECT ALL REGISTRATIONS
export const rejectAllRegistrations = async (req, res) => {
  try {
    const { registrationIds } = req.body;
    console.log("=== REJECT ALL REGISTRATIONS ===");
    console.log("Registration IDs:", registrationIds);

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return res.status(400).json({ message: 'No registration IDs provided' });
    }

    const results = [];
    const errors = [];

    for (const id of registrationIds) {
      try {
        const registration = await Registration.findById(id);
        if (!registration) {
          errors.push({ id, message: 'Registration not found' });
          continue;
        }

        // Verify teacher owns the event
        const event = await Event.findById(registration.event);
        if (!event) {
          errors.push({ id, message: 'Event not found' });
          continue;
        }

        if (event.teacher.toString() !== req.user._id.toString()) {
          errors.push({ id, message: 'Not authorized' });
          continue;
        }

        if (registration.status === 'rejected') {
          results.push(registration);
          continue;
        }

        // Update status
        registration.status = 'rejected';
        await registration.save();

        // Send notification
        await createNotification(
          registration.student,
          'Registration Rejected',
          `Your registration for "${event.title}" has been rejected.`,
          'rejection',
          registration._id
        );

        results.push(registration);

      } catch (err) {
        console.error(`Error rejecting registration ${id}:`, err);
        errors.push({ id, message: err.message });
      }
    }

    console.log(`Rejected ${results.length} registrations, ${errors.length} failed`);
    res.json({
      message: `Rejected ${results.length} registrations`,
      results,
      errors
    });

  } catch (error) {
    console.error('Reject All Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
