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
        type: Date
    }
    //friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});


// static signup method
userSchema.statics.signup = async function(email, password) {

    //validation
    if (!email || !password) { //check if email and password are filled
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) { //check if email is valid
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }

    //check if user already has an account (using email)
    const exists = await this.findOne({ email }); //this refers to UserModel

    if (exists) {
        throw Error('Email already in use');
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //create new user account
    const user = await this.create({ email, password: hash });
    return user;
}

// static login method
userSchema.statics.login = async function(email, password) {

    //validation
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    //find user
    const user = await this.findOne({ email });

    //check if user has a registered account (using email)
    if (!user) {
        throw Error('Email is not registered with an account');
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