const Lesson = require('../models/Lesson');

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
    const lesson = await Lesson.findById(id);

    //send response
    if (!lesson) {
        //return error if no lesson is found
        return res.status(404).json({error: 'No such lesson'});
    }
    res.status(200).json(lesson); //else return the found lesson
};

//**any more API requests?

// Export lessonController functions
module.exports = {
    getLessons,
    getLessonById
}