import Lesson from "../models/lessonModel.js";
import cloudinary from "../config/cloudinary.js";

export const createLesson = async (req, res) => {
  try {
    const { title, courseId, description } = req.body;

    if (!title || !courseId) {
      return res.status(400).json({ message: "Title and courseId are required." });
    }

    let videoUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "lesson_videos",
      });
      videoUrl = result.secure_url;
    }

    const lesson = await Lesson.create({
      title,
      courseId,
      description,
      videoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.find({ courseId: req.params.courseId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { title, description } = req.body;

    let updateData = { title, description };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "lesson_videos",
      });
      updateData.videoUrl = result.secure_url;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: "Lesson updated",
      data: updatedLesson,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    await lesson.deleteOne();

    res.json({ success: true, message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
