const User = require('../models/User');
const jwt = require('jsonwebtoken');

// GET User Profile (**not sure if need)


//function to generate tokens during user authentication
const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.SECRET, { expiresIn: '3d' });
}

// Signup User
const signupUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        //signup user
        const user = await User.signup(email, password);

        //update database

        //create a token
        const token = createToken(user._id);

        //send response
        res.status(200).json({email, token});
    
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


// Login User
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        //login user
        const user = await User.login(email, password);

        //check user against database

        //create a token
        const token = createToken(user._id);

        //send response
        res.status(200).json({email, token});
    
    } catch (error) {
        res.status(400).json({error: error.message});
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