import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from './useAuthContext';

export const useLesson = (lessonId, userId) => {
    const [lesson, setLesson] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [nextLessonId, setNextLessonId] = useState(null);
    const [noMoreLessons, setNoMoreLessons] = useState(false);

    const { dispatch } = useAuthContext();
    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch lesson with questions
    useEffect(() => {
        const fetchLessonQuestions = async () => {
            try {
                const lessonResponse = await axios.get(`${apiUrl}/lessons/${lessonId}`);
                setLesson(lessonResponse.data.lesson);

                const questionResponse = await axios.get(`${apiUrl}/questions/lesson/${lessonId}`);
                setQuestions(questionResponse.data);

                // Initialise each answer to an empty string
                const initialAnswers = {};
                questionResponse.data.forEach((question) => {
                    initialAnswers[question.questionNo] = '';
                });
                setAnswers(initialAnswers);
                
                // Reset state for next lesson
                setSubmitted(false);
                setResults(null);
                setError(null);
            
            } catch (error) {
                console.error('Error fetching lesson with questions:', error);
                setError('Error fetching lesson with questions.');
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
        setError(null); // Clear error message when the user changes an answer
    };


    // Handle lesson completion (submit answers + update user stats)
    const handleSubmit = async () => {
        // Check if all questions are attempted
        const allQuestionsAttempted = questions.every(question => answers[question.questionNo] !== '');
        
        if (!allQuestionsAttempted) {
            setError('Please attempt all questions.');
            return;
        }

        try {
            // Submit lesson answers & Update user stats
            console.log({userId, answers, lessonId});
            const response = await axios.post(`${apiUrl}/lessons/${lessonId}/submit`, {
                userId,
                answers,
            });
            
            // Update user context with the new user stats
            dispatch({ type: 'UPDATE_USER', payload: response.data.user });

            setResults(response.data.result);
            setSubmitted(true);
            setError(null);

            // Fetch next lesson ID after successful submission
            const nextLessonResponse = await axios.get(`${apiUrl}/lessons/nextLesson/${lessonId}`);
            const nextLessonId = nextLessonResponse.data.nextLessonId;
            setNextLessonId(nextLessonId);
            setNoMoreLessons(!nextLessonId); // Set noMoreLessons to true if nextLessonId is null

            console.log('Next Lesson ID:', nextLessonId); //debugging
            console.log('No More Lessons:', noMoreLessons); //debugging
            
        } catch (error) {
            console.error('Error submitting answers or completing lesson:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error); // Set specific error from the backend
            } else {
                setError('Error submitting lesson. Please try again.');
            }
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
        error,
        nextLessonId,
        noMoreLessons
    };
};