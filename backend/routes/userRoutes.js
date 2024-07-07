const express = require('express');

const { 
    signupUser,
    loginUser,
    getUserProfile,
    getUserLessonProgress
} = require('../controllers/userController');

const router = express.Router();

//API requests
// Signup User (useSignup.js)
router.post('/signup', signupUser);

// Login User (useLogin.js)
router.post('/login', loginUser);

// GET User Profile (useProfile.js)
router.get('/profile/:id', getUserProfile);

// GET User lesson progress (useDashboard.js)
router.get('/lessons/:id', getUserLessonProgress);

// DELETE User Profile **(not sure if need)


// Export router
module.exports = router;