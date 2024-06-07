const express = require('express');

const { 
    signupUser,
    loginUser,
    getUserProfile,
    completeLesson,
    resetStreakDaily,
    addFriend
} = require('../controllers/userController');

const router = express.Router();

//API requests
// Signup User
router.post('/signup', signupUser);

// Login User
router.post('/login', loginUser);

// GET User Profile **(not sure if need)
router.get('/profile/:id', getUserProfile);

// UPDATE XP, streak and lastLessonDate after completing lesson
router.patch('/completeLesson/:id', completeLesson);

// Reset streak if missed
router.patch('/resetStreak/:id', resetStreakDaily);

// DELETE User Profile **(not sure if need)


// Add friend?
router.post('/friend/:id', addFriend);

// Export router
module.exports = router;