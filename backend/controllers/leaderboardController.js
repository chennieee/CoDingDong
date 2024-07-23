const User = require('../models/User');

// GET leaderboard -- top 20 users by weeklyXP and rank of current user
const getWeeklyLeaderboard = async (req, res) => {
    const { userId } = req.params;

    try {
        // Aggregation pipeline for MongoDB
        // --> sort users by weeklyXP, followed by last lesson date
        // --> then project with rank
        const pipeline = [
        {
            $sort: {
                weeklyXp: -1,
                lastLessonDate: -1,
            },
        },
        {
            $group: {
                _id: null,
                users: { $push: "$$ROOT" },
            },
        },
        {
            $unwind: {
                path: "$users",
                includeArrayIndex: "rank",
            },
        },
        {
            $project: {
                _id: "$users._id",
                username: "$users.username",
                weeklyXp: "$users.weeklyXp",
                lastLessonDate: "$users.lastLessonDate",
                rank: { $add: ["$rank", 1] },
            },
        },
    ];

    const results = await User.aggregate(pipeline);

    // Get rank of current user
    const currentUser = results.find(user => user._id.toString() === userId);
    const userRank = currentUser ? currentUser.rank : null;

    // Get top 5 users for the leaderboard
    const topUsers = results.slice(0, 5);

    res.status(200).json({ topUsers, userRank });

    } catch (error) {
        res.status(400).json({ error: 'Error getting weekly leaderboard' });
    }
};

module.exports = {
    getWeeklyLeaderboard
};