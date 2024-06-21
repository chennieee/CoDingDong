const QuestionModel = require('../models/Question');
const mongoose = require('mongoose');

// GET questions array by lessonID
const getQuestionsByLessonId = async (req, res) => {
    const lessonId = req.params.id;
    console.log(lessonId);
    console.log(typeof(lessonId));

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
        return res.status(404).json({ error: 'Invalid lesson ID' });
    }

    try {
        // Find all questions with the given lessonId
        const questions = await QuestionModel.find({ "lessonId": new mongoose.Types.ObjectId(lessonId) }).sort({ "questionNo": 1 });
        //const questions = await QuestionModel.find({});
        console.log("questions");
        console.log(questions);

        if (!questions || questions.length === 0) {
            return res.status(404).json({ error: 'No questions found for this lesson' });
        }

        res.status(200).json(questions);

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Server error' });
    }
};

//**Flag question? --> may need to introduce flag boolean attribute in question (not sure if need)

//**any more API requests?

// Export questionController functions
module.exports = {
    getQuestionsByLessonId
};