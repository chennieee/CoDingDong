const express = require('express');

const { 
    getWeeklyLeaderboard
} = require('../controllers/leaderboardController');

const router = express.Router();

// GET leaderboard -- top 20 users by weeklyXP and rank of current user
router.get('/:userId', getWeeklyLeaderboard);

// Export router
module.exports = router;