import express from "express";
import {
  createQuiz,
  getQuizByLesson,
  submitQuiz,
  updateQuiz,
  deleteQuiz
} from "../controllers/quizController.js";

const router = express.Router();

// Create quiz
router.post("/", createQuiz);

// Get quiz by lessonId
router.get("/:lessonId", getQuizByLesson);

// Submit quiz (score calculation)
router.post("/:quizId/submit", submitQuiz);

// Update quiz
router.put("/:id", updateQuiz);

// Delete quiz
router.delete("/:id", deleteQuiz);

export default router;
