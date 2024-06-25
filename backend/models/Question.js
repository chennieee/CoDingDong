// Questions collection
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionNo: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [{ //array of options
        type: String,
        required: true
    }],
    answer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    lessonId: { //Reference to the lesson this question belongs to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    lessonNo: { //for reference
        type: Number,
        required: true
    }
});

// Create & Export questionModel
const QuestionModel = mongoose.model('questions', questionSchema);
module.exports = QuestionModel;