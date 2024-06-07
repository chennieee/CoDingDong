const User = require('../models/User');
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


// GET User Profile (**not sure if need)
const getUserProfile = async (req, res) => {
    //grab id from req parameter
    const { id } = req.params;

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'User not found'});
    }

    //find user
    const user = await User.findById(req.params.id).populate('friends'); //what is the populate for

    //send response
    if (!user) {
        //return error if no user is found
        return res.status(404).json({ error: 'User not found'});
    }
    res.status(200).json(user); //else return the found user profile
};


// UPDATE XP, streak and lastLessonDate after completing lesson
// --> called after a lesson is completed
const completeLesson = async (req, res) => {
    // get userId from req parameter
    const { userId } = req.params;

    // xp awarded for completing a lesson
    const xpEarned = 5;

    try {
        // find user by id
        const user = await User.findById(userId);

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
    // get userId from req parameters
    const { userId } = req.params;

    try {
        // find user by id
        const user = await User.findById(userId);

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
    addFriend
};