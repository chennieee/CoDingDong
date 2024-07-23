const User = require('../models/User');

// GET leaderboard -- top 20 users by weeklyXP and rank of current user
const getWeeklyLeaderboard = async (req, res) => {
    const { userId } = req.params;

    try {
        // Get top 20 users by weeklyXP
        const topUsers = await User.find()
            .sort({ weeklyXP: -1 })
            .limit(5)
            .select('username weeklyXP')
            .lean();

        // Get rank of current user
        const user = await User.findById(userId).select('username weeklyXP').lean();
        const userRank = await User.countDocuments({ weeklyXP: { $gt: user.weeklyXP } }) + 1;

        res.status(200).json({ topUsers, userRank });

    } catch (error) {
        res.status(400).json({ error: 'Error getting weekly leaderboard' });
    }
};

module.exports = {
    getWeeklyLeaderboard
};