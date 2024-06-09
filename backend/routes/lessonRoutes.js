const express = require('express');

const { 
    getLessons,
    getLessonById,
    submitLesson
} = require('../controllers/lessonController');

const router = express.Router();

// GET all lessons
router.get('/', getLessons);

// GET a single lesson by ID
router.get('/:id', getLessonById);

// POST - submit answers for lesson & calculate score
router.post('/:id/submit', submitLesson);

// Export router
module.exports = router;