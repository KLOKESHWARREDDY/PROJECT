import express from "express";
import { 
  createRegistration, 
  getStudentRegistrations, 
  getTeacherRegistrations,
  approveRegistration, 
  rejectRegistration,
  cancelRegistration,
  getRegistrationById,
  getPendingRegistrationsCount
} from '../controllers/registrationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isTeacher } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Create new registration
router.post("/", protect, createRegistration);

// Get student's registrations
router.get("/student/:id", protect, getStudentRegistrations);

// Get teacher's registrations (all registrations for teacher's events)
router.get("/teacher", protect, isTeacher, getTeacherRegistrations);

// Get pending registrations count for teacher dashboard
router.get("/teacher/pending-count", protect, isTeacher, getPendingRegistrationsCount);

// Approve registration
router.put("/approve/:id", protect, isTeacher, approveRegistration);

// Reject registration
router.put("/reject/:id", protect, isTeacher, rejectRegistration);

// Cancel registration (student cancels their own)
router.delete("/:id", protect, cancelRegistration);

// Get single registration by ID (for ticket view)
router.get("/:id", protect, getRegistrationById);

// Get ticket by registration ID (alias for getRegistrationById)
router.get("/ticket/:id", protect, getRegistrationById);

export default router;
