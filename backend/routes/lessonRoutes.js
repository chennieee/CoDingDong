const express = require('express');

const { 
    getLessons,
    getLessonById
} = require('../controllers/lessonController');

const router = express.Router();

// GET all lessons
router.get('/', getLessons);

// GET a single lesson by ID
router.get('/:id', getLessonById);

// Export router
module.exports = router;