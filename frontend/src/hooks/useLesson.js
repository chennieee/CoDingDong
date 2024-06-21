import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLesson = (lessonId, userId) => {
    const [lesson, setLesson] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch lesson with questions
    useEffect(() => {
        const fetchLessonQuestions = async () => {
            try {
                const lessonResponse = await axios.get(`${apiUrl}/lessons/${lessonId}`);
                setLesson(lessonResponse.data);

                const questionResponse = await axios.get(`${apiUrl}/questions/lesson/${lessonId}`);
                setQuestions(questionResponse.data);

                // Initialise each answer to an empty string
                const initialAnswers = {};
                questionResponse.forEach((question) => {
                    initialAnswers[question.questionNo] = '';
                });
                setAnswers(initialAnswers);
            
            } catch (error) {
                console.error('Error fetching lesson with questions:', error);
            }
        };

        fetchLessonQuestions();

    }, [lessonId, apiUrl]);


    // Handle user response to questions
    const handleAnswerChange = (questionNo, userAnswer) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionNo]: userAnswer
        }));
    };


    // Handle lesson completion (submit answers + update user stats)
    const handleSubmit = async () => {
        try {
            // Submit lesson answers
            const response = await axios.post(`${apiUrl}/lessons/${lessonId}/submit`, {
                userId,
                answers,
            });
            setResults(response.data);
            setSubmitted(true);

            // Update user stats
            await axios.patch(`${apiUrl}/users/completeLesson/${userId}`, {
                lessonId
            });
            
        } catch (error) {
            console.error('Error submitting answers or completing lesson:', error);
        }
    };

    return {
        lesson,
        questions,
        answers,
        handleAnswerChange,
        submitted,
        results,
        handleSubmit,
    };
};