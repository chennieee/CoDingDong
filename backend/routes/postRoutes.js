const express = require('express');

const {
    createPost,
    getAllPosts,
    getOnePost,
    addComment
} = require('../controllers/postController');

const router = express.Router();

// POST -- Create a new post
router.post('/create', createPost);

// GET all posts
router.get('/posts', getAllPosts);

// GET a single post by ID
router.get('/post/:id', getOnePost);

// POST - Comment on a post
router.post('/comment/:id', addComment);

// Export router
module.exports = router;