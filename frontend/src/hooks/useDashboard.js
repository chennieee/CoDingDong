import { useEffect, useState } from 'react';
import axios from 'axios';

export const useDashboard = (userId) => {
    const [nextLesson, setNextLesson] = useState(null);
    const [lockedLessons, setLockedLessons] = useState([]);
    const [displayLessons, setDisplayLessons] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get(`${apiUrl}/users/lessons/${userId}`);
                console.log('Fetched lessons response:', response.data); // Debug log

                const { nextLesson, lockedLessons } = response.data;
                setNextLesson(nextLesson);
                setLockedLessons(lockedLessons);

                // Display 5 lessons, 1 start and 4 locked
                const lessonsToDisplay = [];

                //add nextLesson (if available)
                if (nextLesson) {
                    lessonsToDisplay.push({
                        ...nextLesson,
                        accessible: true
                    });
                }

                //add up to 4 lockedLessons
                const lockedLessonsToDisplay = lockedLessons.slice(0, 4)
                                                       .map(lesson => ({
                                                            ...lesson,
                                                            accessible: false
                                                        }));
                lessonsToDisplay.push(...lockedLessonsToDisplay);

                //if less than 5 lessons, fill with 1 more lesson
                while (lessonsToDisplay.length < 5) {
                    lessonsToDisplay.push({ 
                        title: 'More lessons to come...',
                        accessible: false
                    });
                }

                console.log('Display lessons:', lessonsToDisplay); // Log display lessons
                setDisplayLessons(lessonsToDisplay);

            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };

        fetchLessons();

    }, [userId, apiUrl]);

    return { displayLessons };
};