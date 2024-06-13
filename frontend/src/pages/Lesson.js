import React from 'react';
import { useLesson } from '../hooks/useLesson';

const Lesson = ({ match }) => {
    const { questions, answers, setAnswers, submitted, results, handleSubmit } = useLesson(
        match.params.id,
        match.params.userId
    );


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