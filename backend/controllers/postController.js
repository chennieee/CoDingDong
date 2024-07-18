const Post = require('../models/Post');
const mongoose = require('mongoose');


//API requests
// POST -- Create a new post
const createPost = async (req, res) => {
    const { title, text, userId } = req.body;

    try {
        const post = await Post.create({ title, text, userId });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// GET all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); //Sort by latest
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// GET a single post by ID
const getOnePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id).populate('comments.userId', 'username');
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// POST - Comment on a post
const addComment = async (req, res) => {
    const { id } = req.params;
    const { userId, text } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        post.comments.push({ userId, text });
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Export postController functions
module.exports = {
    createPost,
    getAllPosts,
    getOnePost,
    addComment
}