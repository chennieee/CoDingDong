const Lesson = require('../models/Lesson');
const User = require('../models/User');
const mongoose = require('mongoose');

//helper function to check if 2 timings are on the same date
// --> completeLesson, resetStreakDaily
const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};


//API requests
// GET a single lesson by ID with questions
const getLessonById = async (req, res) => {
    //grab id from req parameter
    const { id } = req.params;

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Invalid lesson ID'});
    }

    //find lesson
    const lesson = await Lesson.findById(id);
    if (!lesson) {
        return res.status(404).json({error: 'No such lesson'});
    }

    //send response -- lesson with its questions
    res.status(200).json({ lesson });
};


// POST - submit lesson answers & update user stats
// Calculate score & give explanation for wrong answers
// UPDATE XP, streak, lastLessonDate & completedLessons {lessonId, completionDate, score} for specific user
const submitLessonForUser = async (req, res) => {
    const { id } = req.params; // lesson ID
    const { answers, userId } = req.body; // user's answers (eg. {'A', 'B', 'C', 'D', 'A'})
    const xpEarned = 5; // xp awarded for completing lesson

    // Check if lesson ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such lesson' });
    }

    // Check if user ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'No such user' });
    }

    try {
        // Calculate user's score using static method
        const result = await Lesson.submitAnswers(id, answers); // result is { score, wrongAnswers }

        // Store the score in user's database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'No such user' });
        }

        // Check if lesson is already completed
        const completedLessonIndex = user.completedLessons.findIndex(lesson =>
            lesson.lessonId.toString() === id
        );

        if (completedLessonIndex !== -1) { //already completed
            // Update already completed lessons with new score and completion date
            user.completedLessons[completedLessonIndex].score = result.score;
            user.completedLessons[completedLessonIndex].completionDate = new Date();
        
        } else { //1st time completed
            // Add new completed lesson entry
            user.completedLessons.push({
                lessonId: id,
                completionDate: new Date(),
                score: result.score
            });

            // Add xp
            user.xp += xpEarned;
            user.weeklyXP += xpEarned;

            // Update streak
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);

            if (user.lastLessonDate) {
                const lastLessonDate = new Date(user.lastLessonDate);
    
                if (isSameDay(now, lastLessonDate)) {
                    // lastLessonDate is today --> no change to streak
                } else if (isSameDay(yesterday, lastLessonDate)) {
                    // lastLessonDate is yesterday --> increment streak
                    user.streak += 1;
                } else {
                    // lastLessonDate is more than 1 day ago --> begin streak
                    user.streak = 1;
                }
    
            } else {
                // user has not completed any lessons --> begin streak
                user.streak = 1;
            }

            // update lastLessonDate to now
            user.lastLessonDate = now;
        }

        await user.save();

        // Send response (Score & Explanation for wrong answers)
        res.status(200).json({ user, result });
    
    } catch (error) {
        console.log('Error submitting lesson and updating user stats:', error);
        res.status(400).json({ error: error.message });
    }
};

//**any more API requests?

// Export lessonController functions
module.exports = {
    getLessonById,
    submitLessonForUser
};