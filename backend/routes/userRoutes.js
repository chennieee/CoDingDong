const express = require('express');

const { 
    signupUser,
    loginUser
} = require('../controllers/userController');

const router = express.Router();

// GET User Profile **(not sure if need)


// Signup User
router.post('/signup', signupUser);

// Login User
router.post('/login', loginUser);

// UPDATE User Profile (username, password)


// DELETE User Profile


// Add friend? (**needed if we have friends as User attribute)


// Export router
module.exports = router;