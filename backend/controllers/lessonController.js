const Lesson = require('../models/Lesson');
const User = require('../models/User');
const mongoose = require('mongoose');

// GET all lessons
const getLessons = async (req, res) => {
        const lessons = await Lesson.find(); //find lessons
        res.status(200).json(lessons); //send response
};
    

// GET a single lesson by ID
const getLessonById = async (req, res) => {
    //grab id from req parameter
    const { id } = req.params;

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such lesson'});
    }

    //find lesson
    const lesson = await Lesson.findById(id).populate('questions');

    //send response
    if (!lesson) {
        //return error if no lesson is found
        return res.status(404).json({error: 'No such lesson'});
    }
    res.status(200).json(lesson); //else return the found lesson
};

// POST - submit answers for lesson & calculate score
const submitLesson = async (req, res) => {
    const { lessonId } = req.params; // lesson ID
    const { answers, userId } = req.body; // user's answers (eg. {'A', 'B', 'C', 'D', 'A'})

    // Check if lesson ID is valid
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
        return res.status(404).json({ error: 'No such lesson' });
    }

    // Check if user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'No such user' });
    }

    try {
        // Calculate user's score using static method
        const result = await Lesson.submitAnswers(lessonId, answers);

        // Store the score in user's database
        const user = await UserActivation.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'No such user' });
        }
        user.lessonScores.push({ lessonId, score: result.score });
        await user.save();

        // Send response (Score & Explanation for wrong answers)
        res.status(200).json(result);
    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//**any more API requests?

// Export lessonController functions
module.exports = {
    getLessons,
    getLessonById,
    submitLesson
};