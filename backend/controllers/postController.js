const Post = require('../models/Post');
const User = require('../models/User');

//API requests
// POST -- Create a new post
const createPost = async (req, res) => {
    const { title, text, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

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
        // Fetch post
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Fetch user details for post author
        const author = await User.findById(post.userId);
        const postWithAuthor = {
            ...post.toObject(),
            user: author ? { _id: author._id, username: author.username } : null
        };

        // Fetch user details for post comments
        const commentsWithUserDetails = await Promise.all(post.comments.map(async (comment) => {
            const user = await User.findById(comment.userId);
            return {
                ...comment.toObject(),
                user: user ? { _id: user._id, username: user.username } : null
            };
        }));

        const postWithUserDetails = {
            ...postWithAuthor,
            comments: commentsWithUserDetails
        };

        res.status(200).json(postWithUserDetails);
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