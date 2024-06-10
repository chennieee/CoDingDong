import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lesson = ({ match }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    // Fetch questions for the lesson
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`/api/lessons/${match.params.id}`); // Updated endpoint
                setQuestions(response.data.questions); // Assume response.data contains the lesson details with questions
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [match.params.id]);

    // Handle answer submission
    const handleSubmit = async () => {
        try {
            const response = await axios.post(`/api/lessons/${match.params.id}/submit`, {
                userId: match.params.userId, // Ensure userId is passed correctly
                answers
            });
            setResults(response.data); // Assume response.data contains the score and wrong answers details
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    if (submitted) {
        return (
            <div>
                <h2>Your score: {results.score}</h2>
                {results.wrongAnswers && results.wrongAnswers.length > 0 && (
                    <>
                        <h3>Incorrect Answers:</h3>
                        {results.wrongAnswers.map((question, index) => (
                            <div key={index}>
                                <p>Question: {question.question}</p>
                                <p>Your answer: {question.userAnswer}</p>
                                <p>Correct answer: {question.correctAnswer}</p>
                                <p>Explanation: {question.explanation}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    }

    return (
        <div>
            {questions.map((question, index) => (
                <div key={index}>
                    <p>{question.question}</p> {/* Use question.questionBody if that's the key */}
                    {question.options.map((option, i) => (
                        <label key={i}>
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                onChange={(e) => setAnswers({ ...answers, [question.questionNo]: e.target.value })}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Lesson;