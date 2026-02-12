import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  choices: [choiceSchema]
});

const quizSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  title: { type: String, required: true },
  questions: [questionSchema]
});

export default mongoose.model("Quiz", quizSchema);
