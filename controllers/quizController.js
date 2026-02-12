import Quiz from "../models/quizModel.js";

/**
 * CREATE QUIZ
 */
export const createQuiz = async (req, res) => {
  try {
    const { lessonId, title, questions } = req.body;

    if (!lessonId || !title || !questions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newQuiz = await Quiz.create({
      lessonId,
      title,
      questions
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: newQuiz
    });

  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


/**
 * GET QUIZ BY LESSON ID ✅ FIXED
 */
export const getQuizByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const quiz = await Quiz.findOne({ lessonId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Quiz fetch error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


/**
 * SUBMIT QUIZ
 */
export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;

    quiz.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId == question._id.toString());
      if (!userAnswer) return;

      const correctChoice = question.choices.find(c => c.isCorrect === true);
      if (correctChoice && correctChoice._id.toString() === userAnswer.selectedChoiceId) {
        score++;
      }
    });

    res.json({
      success: true,
      score,
      totalQuestions: quiz.questions.length
    });

  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


/**
 * UPDATE QUIZ
 */
export const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedQuiz) return res.status(404).json({ message: "Quiz not found" });

    res.json({
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz
    });

  } catch (error) {
    console.error("Update quiz error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    await quiz.deleteOne();

    res.json({ message: "Quiz deleted successfully" });

  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
