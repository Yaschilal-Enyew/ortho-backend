import express from "express";
import {
  createLesson,
  getLessonsByCourse,
  getLessonById,
  updateLesson,
  deleteLesson
} from "../controllers/lessonController.js";

import  upload  from "../middleware/multer.js";

const router = express.Router();

// Student routes
router.get("/:courseId", getLessonsByCourse);
router.get("/:id", getLessonById);

// Admin routes (video upload optional)
router.post("/", upload.single("video"), createLesson);
router.put("/:id", upload.single("video"), updateLesson);
router.delete("/:id", deleteLesson);

export default router;
