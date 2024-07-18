// Posts collection
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    comments: [ //array of comments
        commentSchema
    ]
}, { timestamps: true });

// Create & Export postModel
const PostModel = mongoose.model('posts', postSchema);
module.exports = PostModel;