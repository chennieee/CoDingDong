// Lessons collection
const mongoose = require('mongoose');
const Question = require('./Question');

const lessonSchema = new mongoose.Schema({
    lessonNo: {
        type: Number,
        required: true
    },
    // removed questions array as it is now redundant
    // each question is has a lessonId attribute assigning it to a lesson
});


// static method to submit answers and calculate score
lessonSchema.statics.submitAnswers = async function(lessonId, answers) {
    // Check if lessonId is valid
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
        throw new Error('Invalid lesson ID');
    }

    // Fetch questions associated with the lessonId
    const questions = await Question.find({ lessonId }).sort({ questionNo: 1 });
    if (!questions || questions.length === 0) {
        throw new Error('No questions found for this lesson');
    }

    // Check if user has answered all questions
    let numAnswered = Object.keys(answers).length;
    let numQuestions = questions.length;
    if (numAnswered !== numQuestions) {
        throw new Error('Please answer all questions');
    }

    // Compare user answers with correct answers
    // Provide explanation for wrong answers
    // Calculate score
    let score = 0;
    let wrongAnswers = [];

    questions.forEach(question => {
        const userAnswer = answers[question.questionNo];

        if (userAnswer === question.answer) {
            // +1 score for correct ans 
            score++; 
        } else {
            // give explanation for wrong ans
            wrongAnswers.push({
                questionNo: question.questionNo,
                question: question.question,
                userAnswer,
                correctAnswer: question.answer,
                explanation: question.explanation
            });
        }
    });

    // return score
    return { score, wrongAnswers };
}

// Create & Export lessonModel
const LessonModel = mongoose.model('lessons', lessonSchema);
module.exports = LessonModel;