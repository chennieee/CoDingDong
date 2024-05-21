const Question = require('../models/Question');

// GET all Questions
const getQuestions = async (req, res) => {
    const questions = await Question.find(); //find questions
    res.status(200).json(questions); //send response
};

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

//**Flag question? --> may need to introduce flag boolean attribute in question

//**any more API requests?

// Export questionController functions
module.exports = {
    getQuestions,
    getQuestionById
};