import cloudinary from "../config/cloudinary.js"
import newsModel from "../models/newsModel.js";

export const addpost = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    let imageUrl = null;

    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'news_images',
      });
      imageUrl = result.secure_url;
    }

    const newPost = await newsModel.create({
      title,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: 'News post created successfully.',
      data: newPost,
    });
  } catch (error) {
    console.error('Error adding post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await newsModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // If the post has an image, delete it from Cloudinary
    if (post.image) {
      const publicId = post.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`news_images/${publicId}`);
    }

    await newsModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find the existing post
    const post = await newsModel.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    let imageUrl = post.image;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      // delete old image from cloudinary if it exists
      if (post.image) {
        const publicId = post.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`news_images/${publicId}`);
      }

      // upload new image
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'news_images' });
      imageUrl = result.secure_url;
    }

    // update the post fields
    post.title = title || post.title;
    post.description = description || post.description;
    post.image = imageUrl;

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
      error: error.message,
    });
  }
};

// Get all posts
export const allPosts = async (req, res) => {
  try {
    const posts = await newsModel.find().sort({ date: -1 }) // newest first because humans like shiny new things

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No posts found.'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully.',
      posts
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    })
  }
}


// Paginate Posts
export const paginatePosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1       // current page
    const limit = parseInt(req.query.limit) || 5     // posts per page
    const skip = (page - 1) * limit                  // how many to skip from the beginning

    const totalPosts = await newsModel.countDocuments()  // count total posts
    const posts = await newsModel.find()
      .sort({ date: -1 })  // newest first
      .skip(skip)         // skip old posts from previous pages
      .limit(limit)       // limit results to "limit" number

    const totalPages = Math.ceil(totalPosts / limit)

    // figure out if there are more pages
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    res.status(200).json({
      success: true,
      message: 'Posts fetched successfully with pagination.',
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
      posts
    })
  } catch (error) {
    console.error('Error paginating posts:', error)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    })
  }
}


