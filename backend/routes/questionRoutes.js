const express = require('express');

const {
    getQuestionById
} = require('../controllers/questionController');

const router = express.Router();

// GET a single question by ID (**not used)
router.get('/:id', getQuestionById);

// Export router
module.exports = router;