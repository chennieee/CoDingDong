const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

//helper function to generate tokens during user authentication
// --> signupUser, loginUser
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '3d' });
};

//helper function to check if 2 timings are on the same date
// -->
const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};


//API requests
// Signup User
const signupUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        //if successful, signup user + update database
        //else throw error 
        const user = await User.signup(username, password);

        //create a token
        const token = createToken(user._id);

        //send response
        res.status(200).json({ username, token });


    } catch (error) {
        res.status(500).json({ error: error.message });
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
        res.status(200).json({ username, token });

    } catch (error) {
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

    //find user
    const user = await User.findById(id).populate('friends');

    //send response
    if (!user) {
        //return error if no user is found
        return res.status(404).json({ error: 'User not found'});
    }
    res.status(200).json(user); //else return the found user profile
};


// GET user friends
const getUserFriends = async (req, res) => {
    const { id } = req.params; //userId

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'User not found'});
    }

    //find user
    const user = await User.findById(id).populate('friends', 'username');

    //send response
    if (!user) {
        //return error if no user is found
        return res.status(404).json({ error: 'User not found'});
    }
    res.status(200).json(user.friends); //else return the found user profile
};


// GET user lesson progress
const getUserLessonProgress = async (req, res) => {
    const { id } = req.params;

    try {
        const { completedLessons, nextLesson, lockedLessons } = await User.getLessonProgress(id);
        res.status(200).json({ completedLessons, nextLesson, lockedLessons });
    } catch (error) {
        console.error('Error fetching user lesson progress:', error);
        res.status(500).json({ error: error.message });
    }
};


// UPDATE XP, streak, lastLessonDate and completedLessons after completing lesson
// --> called after a lesson is completed
const completeLesson = async (req, res) => {
    const { id } = req.params; //user ID
    const xpEarned = 5; //xp awarded for completing lesson

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // update xp
        user.xp += xpEarned;

        // update streak
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        if (user.lastLessonDate) {
            const lastLessonDate = new Date(user.lastLessonDate);

            if (isSameDay(now, lastLessonDate)) {
                // lastLessonDate is today --> no change to streak
            } else if (isSameDay(yesterday, lastLessonDate)) {
                // lastLessonDate is yesterday --> increment streak
                user.streak += 1;
            } else {
                // lastLessonDate is more than 1 day ago --> begin streak
                user.streak = 1;
            }

        } else {
            // user has not completed any lessons --> begin streak
            user.streak = 1;
        }

        // update lastLessonDate to now
        user.lastLessonDate = now;

        // update completedLessons
        user.completedLessons.push({ lessonId, completionDate: now });

        // save the updated user document
        await user.save();

        // send response (updated user document)
        res.status(200).json(user);
    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Reset streak if missed
// --> called at the start of every day
const resetStreakDaily = async (req, res) => {
    const { id } = req.params; //user ID

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        if (user.lastLessonDate) {
            const lastLessonDate = new Date(user.lastLessonDate);

            if (!isSameDay(yesterday, lastLessonDate) && !isSameDay(now, lastLessonDate)) {
                // user has not completed a lesson yesterday and today --> reset streak
                user.streak = 0;

                // save the updated user document
                await user.save();
            }
        }

        // send response (user data)
        res.status(200).json(user);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// DELETE User Profile (""not sure if need)


// Add friend? (**not sure, needed if we have friends as User attribute)
const addFriend = async (req, res) => {
    const user = await User.findById(req.params.id);
    const friend = await User.findById(req.body.friendId);

    if (user && friend) {
        user.friends.push(friend._id);
        await user.save();
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
};

// Export userController functions
module.exports = {
    signupUser,
    loginUser,
    getUserProfile,
    getUserFriends,
    getUserLessonProgress,
    addFriend,
    completeLesson,
    resetStreakDaily
};