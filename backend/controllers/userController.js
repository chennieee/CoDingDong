const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//helper function to generate tokens during user authentication
// --> signupUser, loginUser
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '3d' });
};

//helper function to check if 2 timings are on the same date
// --> completeLesson, resetStreakDaily
const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};


//API requests
// Signup User
const signupUser = async (req, res) => {
    const { username, password, isTest } = req.body;

    try {
        //if successful, signup user + update database
        //else throw error
        console.log('Signup request received:', { username, password, isTest }); 
        const user = await User.signup(username, password, isTest);
        console.log('User created:', user);

        //create a token
        const token = createToken(user._id);

        //send response
        res.status(200).json({ 
            _id: user._id,
            username: user.username,
            xp: user.xp,
            streak: user.streak,
            lastLessonDate: user.lastLessonDate,
            completedLessons: user.completedLessons,
            friends: user.friends,
            sentFriendRequests: user.sentFriendRequests,
            receivedFriendRequests: user.receivedFriendRequests,
            token
        });

    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(400).json({ error: error.message });
    }
};


// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        //login user + checks user against database
        //throws error if wrong
        const user = await User.login(username, password);

        //create a token
        const token = createToken(user._id);

        //send response
        res.status(200).json({ 
            _id: user._id,
            username: user.username,
            xp: user.xp,
            streak: user.streak,
            lastLessonDate: user.lastLessonDate,
            completedLessons: user.completedLessons,
            friends: user.friends,
            sentFriendRequests: user.sentFriendRequests,
            receivedFriendRequests: user.receivedFriendRequests,
            token
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(400).json({ error: error.message });
    }
};


// GET User Profile
const getUserProfile = async (req, res) => {
    const { id } = req.params; //user ID

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'User not found'});
    }

    try {
        console.log('Fetching user profile for ID:', req.params.id); //debugging
        //find user
        const user = await User.findById(id);

        //send response
        if (!user) {
            //return error if no user is found
            console.log('User not found for ID:', id);
            return res.status(404).json({ error: 'User not found'});
        }
        res.status(200).json(user); //else return the found user profile
    
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(400).send(error);
    }
};


// GET user lesson progress
const getUserLessonProgress = async (req, res) => {
    const { id } = req.params; //userId

    try {
        const { completedLessons, nextLesson, lockedLessons } = await User.getLessonProgress(id);
        res.status(200).json({ completedLessons, nextLesson, lockedLessons });
    } catch (error) {
        console.error('Error fetching user lesson progress:', error);
        res.status(400).json({ error: error.message });
    }
};


// DELETE User Profile (""not sure if need)


// Export userController functions
module.exports = {
    signupUser,
    loginUser,
    getUserProfile,
    getUserLessonProgress
};