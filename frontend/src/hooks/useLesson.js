import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useLesson = (lessonId, userId) => {
    const [lesson, setLesson] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const { dispatch } = useAuthContext();
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
                questionResponse.data.forEach((question) => {
                    initialAnswers[question.questionNo] = '';
                    console.log(question.answer);
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
            // Submit lesson answers & Update user stats
            console.log({userId, answers, lessonId});
            const response = await axios.post(`${apiUrl}/lessons/${lessonId}/submit`, {
                userId,
                answers,
            });
            
            // Update user context with the new user stats
            dispatch({ type: 'SUBMIT_LESSON', payload: response.data.user });

            setResults(response.data.result);
            setSubmitted(true);
            
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