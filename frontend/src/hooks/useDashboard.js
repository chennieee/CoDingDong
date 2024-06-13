import { useEffect, useState } from 'react';
import axios from 'axios';

export const useDashboard = (userId) => {
    const [lessons, setLessons] = useState([]);
    const [numLessonsCompleted, setNumLessonsCompleted] = useState(0);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            const userResponse = await axios.get(`${apiUrl}/users/${userId}`);
            setNumLessonsCompleted(userResponse.data.numLessonsCompleted);
        };

        const fetchLessons = async () => {
            const lessonsResponse = await axios.get(`${apiUrl}/lessons?userId=${userId}`);
            setLessons(lessonsResponse.data);
        };

        fetchUserData();
        fetchLessons();

    }, [userId, apiUrl]);

    const startLessonIndex = numLessonsCompleted;
    const displayLessons = lessons.slice(startLessonIndex, startLessonIndex + 5);
    // only 5 lessons displayed, 1 start and 4 locked

    return { displayLessons };
};