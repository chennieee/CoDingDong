import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ userId }) => {
    const [lessons, setLessons] = useState([]);
    const [numLessonsCompleted, setNumLessonsCompleted] = useState(0);
    const history = useHistory();

    useEffect(() => {
        const fetchUserData = async () => {
            const userResponse = await axios.get(`/users/${userId}`);
            setNumLessonsCompleted(userResponse.data.numLessonsCompleted);
        };

        const fetchLessons = async () => {
            const lessonsResponse = await axios.get(`/lessons?userId=${userId}`);
            setLessons(lessonsResponse.data);
        };

        fetchUserData();
        fetchLessons();
    }, [userId]);

    const startLessonIndex = numLessonsCompleted;
    const displayLessons = lessons.slice(startLessonIndex, startLessonIndex + 5);
    // only 5 lessons displayed, 1 start and 4 locked 

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-buttons">
                    <button onClick={() => history.push('/profile')}>Profile</button>
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
                            onClick={() => history.push(`/lesson/${lesson._id}`)}
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