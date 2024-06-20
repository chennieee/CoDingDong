import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { useAuthContext } from '../hooks/useAuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuthContext();
    const userId = user ? user._id : null;
    console.log('Dashboard userId:', userId); // Log to check userId


    const { displayLessons } = useDashboard(userId);
    const navigate = useNavigate();

    console.log('Rendering displayLessons:', displayLessons); // Debug log

    function navigateToProfile(id) {
        navigate(`/profile/${id}`);
    }

    function navigateToLesson(id) {
        navigate(`/lesson/${id}`);
    }

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-buttons">
                    <button onClick={() => navigateToProfile(userId)}>Profile</button>
                    <button>Leaderboard</button>
                </div>
            </div>
            <div className="lessons">
                <h1>Lessons</h1>
                <div className="lesson-list">
                    {displayLessons.map((lesson, index) => (
                        <button
                            key={index}
                            className={`lesson-item ${index === 0 ? 'start' : 'locked'}`}
                            disabled={index > 0}
                            onClick={() => navigateToLesson(lesson._id)}
                        >
                            {lesson.title} - {index === 0 ? 'Start' : 'Locked'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;