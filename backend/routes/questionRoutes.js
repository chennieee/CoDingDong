const express = require('express');

const { 
    getQuestions,
    getQuestionById
} = require('../controllers/questionController');

const router = express.Router();

// GET all questions
router.get('/', getQuestions);

// GET a single question by ID
router.get('/:id', getQuestionById);

// Export router
module.exports = router;