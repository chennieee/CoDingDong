// Questions collection
// **should we put this in lessonSchema instead? (n remove the Questions.js file)
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
    answer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    }
});

// Create & Export questionModel
const QuestionModel = mongoose.model('questions', questionSchema);
module.exports = QuestionModel;