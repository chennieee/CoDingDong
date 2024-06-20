import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import './Dashboard.css';

const Dashboard = ({ userId }) => {
    const { displayLessons } = useDashboard(userId);
    const navigate = useNavigate();

    console.log('Rendering displayLessons:', displayLessons); // Debug log

    function navigateToProfile() {
        navigate('/profile');
    }

    function navigateToLesson(id) {
        navigate(`/lesson/${id}`);
    }

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-buttons">
                    <button onClick={() => navigateToProfile()}>Profile</button>
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