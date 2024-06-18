const express = require('express');

const { 
    signupUser,
    loginUser,
    getUserProfile,
    getUserFriends,
    getUserLessonProgress,
    completeLesson,
    resetStreakDaily,
    addFriend,
} = require('../controllers/userController');

const router = express.Router();

//API requests
// Signup User (useSignup.js)
router.post('/signup', signupUser);

// Login User (useLogin.js)
router.post('/login', loginUser);

// GET User Profile (useProfile.js)
router.get('/profile/:id', getUserProfile);

// GET User Friends (useFriends.js)
router.get('/friends/:id', getUserFriends);

// GET User lesson progress (useDashboard.js)
router.get('/lessons/:id', getUserLessonProgress);

// UPDATE XP, streak and lastLessonDate after completing lesson (useLesson.js)
router.patch('/completeLesson/:id', completeLesson);

// Reset streak if missed
router.patch('/resetStreak/:id', resetStreakDaily);

// DELETE User Profile **(not sure if need)


// Add friend?
router.post('/friend/:id', addFriend);

// Export router
module.exports = router;