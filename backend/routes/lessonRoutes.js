const express = require('express');

const {
    getLessonById,
    submitLessonForUser
} = require('../controllers/lessonController');

const router = express.Router();

// GET a single lesson by ID (useLesson.js)
router.get('/:id', getLessonById);

// POST - submit answers for lesson & calculate score (useLesson.js)
router.post('/:id/submit', submitLessonForUser);

// Export router
module.exports = router;