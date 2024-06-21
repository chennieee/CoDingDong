const express = require('express');

const {
    getQuestionById,
    getQuestionsByLessonId
} = require('../controllers/questionController');

const router = express.Router();

// GET a single question by ID (**not used)
router.get('/:id', getQuestionById);

// GET questions array by lessonID
router.get('/lesson/:lessonId', getQuestionsByLessonId);

// Export router
module.exports = router;