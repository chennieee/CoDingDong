const Question = require('../models/Question');

// GET a single question by ID
const getQuestionById = async (req, res) => {
    //grab id from req parameter
    const { id } = req.params;

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such question'});
    }

    //find question
    const question = await Question.findById(id);

    //send response
    if (!question) {
        //return error if no question is found
        return res.status(404).json({error: 'No such question'});
    }
    res.status(200).json(question); //else return the found question
}

// GET questions array by lessonID
const getQuestionsByLessonId = async (req, res) => {
    const { lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
        return res.status(404).json({ error: 'Invalid lesson ID' });
    }

    try {
        // Find all questions with the given lessonId
        const questions = await Question.find({ lessonId }).sort({ questionNo: 1 });

        if (!questions || questions.length === 0) {
            return res.status(404).json({ error: 'No questions found for this lesson' });
        }

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

//**Flag question? --> may need to introduce flag boolean attribute in question (not sure if need)

//**any more API requests?

// Export questionController functions
module.exports = {
    getQuestionById,
    getQuestionsByLessonId
};