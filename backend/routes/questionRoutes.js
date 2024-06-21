const express = require('express');

const {
    getQuestionsByLessonId
} = require('../controllers/questionController');

const router = express.Router();

// GET questions array by lessonID (useLesson)
router.get('/lesson/:id', getQuestionsByLessonId); //id is lessonId

// Export router
module.exports = router;