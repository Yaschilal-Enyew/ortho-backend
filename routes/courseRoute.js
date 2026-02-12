import express from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Public routes
router.get("/",  getCourses);        // Get all courses
router.get("/:id", getCourseById);  // Get single course by ID

// Admin routes (add your auth middleware later)
router.post("/", upload.single('image'), createCourse);     // Create new course
router.put("/:id", upload.single('image'), updateCourse);   // Update course
router.delete("/:id", deleteCourse);// Delete course

export default router;
