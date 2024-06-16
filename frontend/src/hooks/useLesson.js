import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLesson = (lessonId, userId) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch questions for the lesson
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`${apiUrl}/lessons/${lessonId}`); // Updated endpoint
                setQuestions(response.data.questions); // Assume response.data contains the lesson details with questions
            
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();

    }, [lessonId, apiUrl]);


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
        questions,
        answers,
        setAnswers,
        submitted,
        results,
        handleSubmit,
    };
};