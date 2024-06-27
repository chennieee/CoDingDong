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
const resetStreakDaily = require('./utils/resetStreak');

// routes
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/lessons', lessonRoutes);

// set up cron job to reset streak daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily streak reset task...');
    await resetStreakDaily();
}, {
    scheduled: true,
    timezone: "Asia/Singapore"
});

// connect to database and listen for requests
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to database and listening on port', process.env.PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = app; //export for unit tests