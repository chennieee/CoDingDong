import React from 'react';
import './Dashboard.css';

// im just putting buttons that lead to nothing lol we will continue after we film the video 

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <button className="sidebar-button">Profile</button>
                <button className="sidebar-button">Leaderboard</button>
            </div>
            <div className="main-content">
                <h1>Lessons</h1>
                <div className="lesson-list">
                    <button className="lesson-item completed">Lesson 1 - Completed</button>
                    <button className="lesson-item completed">Lesson 2 - Completed</button>
                    <button className="lesson-item start">Lesson 3 - Start</button>
                    <button className="lesson-item locked">Lesson 4 - Locked</button>
                    <button className="lesson-item locked">Lesson 5 - Locked</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;