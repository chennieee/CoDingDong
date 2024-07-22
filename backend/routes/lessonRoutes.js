const express = require('express');

const {
    getLessonById,
    submitLessonForUser,
    getNextLesson
} = require('../controllers/lessonController');

const router = express.Router();

// GET a single lesson by ID (useLesson.js)
router.get('/:id', getLessonById);

// POST - submit answers for lesson & calculate score (useLesson.js)
router.post('/:id/submit', submitLessonForUser);

// GET next lesson for user
router.get('/nextLesson/:id', getNextLesson);

// Export router
module.exports = router;