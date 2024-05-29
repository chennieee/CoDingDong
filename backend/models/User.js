// Users collection
const mongoose = require('mongoose');

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
    lastLessonDate: {
        type: Date,
        default: null // NOT SURE IF THIS IS ALLOWED 
        // but we need it to be null bc when user signs up it doesnt mean he completes a lesson
    }
    //friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


// static signup method
userSchema.statics.signup = async function(username, password) {

    //validation
    if (!username || !password) { //check if username and password are filled
    if (!username || !password) { //check if email and password are filled
        throw Error('All fields must be filled');
    }

    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
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
    const user = await this.create({ username, password: hash });
    // IM ASSUMING STREAK, XP, DATE ARE AUTOFILLED WITH DEFAULT VALUES
    return user;
}

// static login method
userSchema.statics.login = async function(username, password) {

    //validation
    if (!username || !password) {
        throw Error('All fields must be filled');
    }

    //find user
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


// Create & Export userModel
const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;