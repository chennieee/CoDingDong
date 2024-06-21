const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const User = require('../models/User');
const mongoose = require('mongoose');
    

// GET a single lesson by ID with questions
const getLessonById = async (req, res) => {
    //grab id from req parameter
    const { id } = req.params;

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid lesson ID'});
    }

    //find lesson
    const lesson = await Lesson.findById(id);
    if (!lesson) {
        return res.status(404).json({error: 'No such lesson'});
    }

    //send response -- lesson with its questions
    res.status(200).json({ lesson });
};


// POST - submit answers for lesson & calculate score (specific user)
//** should this be implemented in the user backend instead of lesson?? since it is specific to a user */
const submitLesson = async (req, res) => {
    const { id } = req.params; // lesson ID
    const { answers, userId } = req.body; // user's answers (eg. {'A', 'B', 'C', 'D', 'A'})

    // Check if lesson ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such lesson' });
    }

    // Check if user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'No such user' });
    }

    try {
        // Calculate user's score using static method
        const result = await Lesson.submitAnswers(id, answers);

        // Store the score in user's database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'No such user' });
        }

        // Check if lesson is already completed
        const completedLessonIndex = user.completedLessons.findIndex(lesson =>
            lesson.lessonId.toString() === id
        );

        if (completedLessonIndex !== -1) {
            // Update already completed lessons with new score and completion date
            user.completedLessons[completedLessonIndex].score = result.score;
            user.completedLessons[completedLessonIndex].completionDate = new Date();
        
        } else {
            // Add new completed lesson entry
            user.completedLessons.push({
                id,
                completionDate: new Date(),
                score: result.score
            });
        }

        await user.save();

        // Send response (Score & Explanation for wrong answers)
        res.status(200).json(result);
    
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
};

//**any more API requests?

// Export lessonController functions
module.exports = {
    getLessonById,
    submitLesson
};