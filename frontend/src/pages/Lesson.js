import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Lesson = ({ match }) => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await axios.get(`/lessons/${match.params.id}/questions`);
            setQuestions(response.data);
        };

        fetchQuestions();
    }, [match.params.id]);

    const handleSubmit = async () => {
        const response = await axios.post('/questions/submit', {
            userId: match.params.userId,
            lessonId: match.params.id,
            answers
        });
        setResults(response.data);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div>
                <h2>Your score: {results.score}</h2>
                {results.results.map((question, index) => (
                    <div key={index}>
                        <p>{question.questionBody}</p>
                        {question.options.map((option, i) => (
                            <p key={i}>{option}</p>
                        ))}
                        <p>Your answer: {question.userAnswer}</p>
                        <p>Correct answer: {question.correctAnswer}</p>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {questions.map((question, index) => (
                <div key={index}>
                    <p>{question.questionBody}</p>
                    {question.options.map((option, i) => (
                        <label key={i}>
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
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
