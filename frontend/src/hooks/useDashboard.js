import { useEffect, useState } from 'react';
import axios from 'axios';

export const useDashboard = (userId) => {
    //const [completedLessons, setCompletedLessons] = useState([]);
    const [nextLesson, setNextLesson] = useState(null);
    const [lockedLessons, setLockedLessons] = useState([]);
    const [displayLessons, setDisplayLessons] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const lessonsResponse = await axios.get(`${apiUrl}/users/lessons/${userId}`);
                //setCompletedLessons(lessonsResponse.data.completedLessons);
                setNextLesson(lessonsResponse.data.nextLesson);
                setLockedLessons(lessonsResponse.data.lockedLessons);

                // Display 5 lessons, 1 start and 4 locked
                const lessonsToDisplay = [];

                //add nextLesson (if available)
                if (nextLesson) {
                    lessonsToDisplay.push({
                        ...lessonsResponse.data.nextLesson,
                        accessible: true
                    });
                }

                //add lockedLessons
                const lockedLessonCount = 5 - lessonsToDisplay.length;
                const lockedLessonsToDisplay = lockedLessons.slice(0, lockedLessonCount)
                                                       .map(lesson => ({
                                                            ...lesson,
                                                            accessible: false
                                                        }));
                lessonsToDisplay.push(...lockedLessonsToDisplay);

                while (lessonsToDisplay.length < 5) {
                    lessonsToDisplay.push({ 
                        title: 'More lessons to come...',
                        locked: true,
                        accessible: false
                    });
                }

                setDisplayLessons(lessonsToDisplay);

            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        };

        fetchLessons();

    }, [userId, apiUrl, nextLesson, lockedLessons]);

    return { displayLessons };
};