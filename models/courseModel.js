import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // course thumbnail
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
