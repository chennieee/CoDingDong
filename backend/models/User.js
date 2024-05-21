// Users collection
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    streak: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    }
    //profilePic: { type: String, default: '' }
    //friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Hash password


// Create & Export userModel
const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;