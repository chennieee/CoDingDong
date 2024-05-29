const User = require('../models/User');
const jwt = require('jsonwebtoken');

// GET User Profile (**not sure if need)


//function to generate tokens during user authentication
const createToken = (_id) => {
    return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '3d' });
}

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
}


// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        //login user + checks user against database
        //throws error if wrong
        const user = await User.login(username, password);

        //check user against database --> still need?

        //create a token
        const token = createToken(user._id);

        //send response
        res.status(200).json({ username, token });
    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// UPDATE XP and streak after completing lesson


// UPDATE XP after completing mission


// UPDATE username -- done by user


// UPDATE password -- done by user


// DELETE User Profile


// Add friend? (**not sure, needed if we have friends as User attribute)


// Export userController functions
module.exports = {
    signupUser,
    loginUser
}