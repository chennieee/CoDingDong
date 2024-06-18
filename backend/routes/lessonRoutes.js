const express = require('express');

const { 
    getLessons,
    getLessonById,
    submitLesson
} = require('../controllers/lessonController');

const router = express.Router();

// GET a single lesson by ID (useLesson.js)
router.get('/:id', getLessonById);

// POST - submit answers for lesson & calculate score (useLesson.js)
router.post('/:id/submit', submitLesson);

// Export router
module.exports = router;