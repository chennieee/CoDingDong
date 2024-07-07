// reset weekly XP to 0
// called at the start of every week (Monday midnight)
// used for updating weekly leaderboard
const User = require('../models/User');

const resetWeeklyXP = async () => {
    try {
        await User.updateMany({}, { $set: { weeklyXP: 0 } });
        console.log('Weekly XP reset for all users');

    } catch (error) {
        console.error('Error resetting weekly XP: ', error);
    }
};

module.exports = resetWeeklyXP;