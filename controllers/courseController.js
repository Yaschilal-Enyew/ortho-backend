import Course from "../models/courseModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Admin


export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    let imageUrl = null;

    // If file uploaded via multer
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_images', // optional folder in Cloudinary
      });
      imageUrl = result.secure_url;
    }

    const newCourse = await Course.create({
      title,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Admin
export const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found" });

    let imageUrl = null;

    // If file uploaded via multer
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_images', // optional folder in Cloudinary
      });
      imageUrl = result.secure_url;
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.image = imageUrl || course.image; // corrected line

    const updatedCourse = await course.save();
    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Admin
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await course.deleteOne(); // safer than remove()
    res.json({ success: true, message: "Course removed successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

