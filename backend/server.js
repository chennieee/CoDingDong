// attach environment variables that we want to hide
require('dotenv').config();

// import libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

// express app
const app = express();

// middleware --> executes at the start of every request, before callback function
app.use(express.json());

// Enable CORS for all origins 
app.use(cors({ origin: '*' }));

// import routes/model/utils
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const friendRoutes = require('./routes/friendRoutes');

// routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/friends', friendRoutes);

// set up cron job to reset streak daily at midnight
const resetStreakDaily = require('./utils/resetStreak');
const streakResetCron = cron.schedule('0 0 * * *', async () => {
    console.log('Running daily streak reset task...');
    await resetStreakDaily();
}, {
    scheduled: true,
    timezone: "Asia/Singapore"
});

// set up cron job to reset weekly XP at the start of every week
const resetWeeklyXP = require('./utils/resetWeeklyXP');
const weeklyXPResetCron = cron.schedule('0 0 * * 1', async () => {
    console.log('Running weekly XP reset task...');
    await resetWeeklyXP();
}, {
    scheduled: true,
    timezone: "Asia/Singapore"
});

// start server and connect to database
let server;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        server = app.listen(process.env.PORT, () => {
            console.log('connected to database and listening on port', process.env.PORT);
        });
    } catch (error) {
        console.log(error);
    }
    streakResetCron.start(); // Start the cron job
    weeklyXPResetCron.start();
};

const closeServer = async () => {
    if (server) {
        server.close();
    }
    await mongoose.connection.close();
    streakResetCron.stop(); // Ensure the cron job is stopped
};

if (require.main === module) {
    // If this script is run directly, start the server
    startServer();
}

module.exports = { app, startServer, closeServer };