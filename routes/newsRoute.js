import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { addpost, allPosts, deletePost, paginatePosts, updatePost } from "../controllers/newsController.js";
import upload from "../middleware/multer.js";

const newsRoute = express.Router();

// Create post with image
newsRoute.post('/add', adminAuth, upload.single('image'), addpost);

// Delete post
newsRoute.delete('/delete/:id', adminAuth, deletePost);

// Update post WITH multer middleware
newsRoute.put('/update/:id', adminAuth, upload.single('image'), updatePost);

// Get all posts
newsRoute.get('/posts', allPosts);

// Pagination
newsRoute.get('/paginates', paginatePosts);

export default newsRoute;
