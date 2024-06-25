// Reset user streak if missed
// called for all users at the start of everyday
const User = require('../models/User');

const resetStreakDaily = async (req, res) => {
    try {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        // Find all users whose lastLessonDate is not today or yesterday
        const usersToReset = await User.find({
            //lastLessonDate is less than the start of yesterday
            lastLessonDate: { $lt : new Date(yesterday.setHours(0, 0, 0, 0))}
        });

        // Reset streak for users found above
        usersToReset.forEach(async (user) => {
            user.streak = 0;
            await user.save();
        });

        console.log(`Streaks reset for ${usersToReset.length} users.`);

    } catch (error) {
        console.error('Error resetting streaks:', error);
    }
};

module.exports = resetStreakDaily;