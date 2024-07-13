// Users collection
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Lesson = require('./Lesson');

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
    },
    weeklyXP: {
        type: Number,
        default: 0
    },
    lastLessonDate: { //ONLY for newLessons. Already completed lessons will not be taken into account
        type: Date,
        default: null // NOT SURE IF THIS IS ALLOWED 
        // but we need it to be null bc when user signs up it doesnt mean he completes a lesson
    },
    friends: [{ //array to store friends
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    sentFriendRequests: [{ //array of sent friend requests
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    receivedFriendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    completedLessons: [{ //array to keep track of completed lessons
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
            required: true
        },
        completionDate: {
            type: Date,
            required: true
        },
        score: { 
            type: Number,
            required: true
        }
    }],
    isTest: { //for testing
        type: Boolean,
        default: false
    }
});


// static signup method
userSchema.statics.signup = async function (username, password, isTest) {
    // check if username and password are filled
    if (!username || !password) {
        throw Error('All fields must be filled');
    }

    // check if password is strong enough
    if (!validator.isStrongPassword(password)) {
        throw Error(`
        Password must meet the following criteria:
        - At least 8 characters long
        - At least 1 lowercase and 1 uppercase letter
        - At least 1 number and 1 special character
        `.trim());
    }

    // check if username is alr taken
    const exists = await this.findOne({ username }); //this refers to UserModel

    if (exists) {
        throw Error('Username already in use');
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //create new user account AND SAVES IT TO DATABASE 
    const user = await this.create({ username, password: hash, isTest });
    // IM ASSUMING STREAK, XP, DATE ARE AUTOFILLED WITH DEFAULT VALUES
    return user;
}

// static login method
userSchema.statics.login = async function (username, password) {
    // check if username and password are filled
    if (!username || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ username });

    //check if user has a registered account (using username)
    if (!user) {
        throw Error('Username is not registered with an account');
    }

    //match hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    //login user
    return user;
}


// static method to get lesson progress for a specific user
// used to determine lesson display in dashboard page
userSchema.statics.getLessonProgress = async function(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }

    const user = await this.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Fetch all lessons and sort by lessonNo
    const lessons = await Lesson.find().sort({ lessonNo: 1 });

    // Get completedLessons IDs
    const completedLessonIds = user.completedLessons
                                    .map(lesson => lesson.lessonId.toString());

    // Get nextLesson and lockedLessons
    let nextLesson = null; //initialise nextLesson
    let lockedLessons = []; //initialise lockecLessons

    for (const lesson of lessons) {
        if (!completedLessonIds.includes(lesson._id.toString())) {
            if (!nextLesson) {
                nextLesson = lesson; //1st uncompleted lesson is nextLesson
            } else {
                lockedLessons.push(lesson); //remaining uncompleted lessons are locked
            }
        }
    }

    return { nextLesson, lockedLessons };
};


// Create & Export userModel
const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;