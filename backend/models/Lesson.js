// Lessons collection
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    lessonNo: {
        type: Number,
        required: true
    },
    title: { // **do we need this attribute?
        type: String,
        required: true
    },
    questions: [{ //array of 5 Questions
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Questions'
    }]
});

// Create & Export lessonModel
const LessonModel = mongoose.model('lessons', lessonSchema);
module.exports = LessonModel;