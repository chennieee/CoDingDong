import React from 'react';
import { useLesson } from '../hooks/useLesson';

const Lesson = ({ match }) => {
    const { lesson, questions, answers, handleAnswerChange, submitted, results, handleSubmit } = useLesson(
        match.params.id, //lessonId
        match.params.userId //userId
    );


    if (!lesson) {
        return <div>Loading...</div>;
    }


    if (submitted) {
        return (
            <div>
                <h2>Your score: {results.score}</h2>
                {results.wrongAnswers && results.wrongAnswers.length > 0 && (
                    <>
                        <h3>Incorrect Answers:</h3>
                        {results.wrongAnswers.map((question, index) => (
                            <div key={index}>
                                <p>Question {question.questionNo}: {question.questionBody}</p>
                                <p>Your answer: {answers[question.questionNo]}</p>
                                <p>Correct answer: {question.answer}</p>
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
            <h1>Lesson {lesson.lessonNo}</h1>
            {questions.map((question, index) => (
                <div key={index}>
                    <p>Question {question.questionNo}:</p>
                    <p>{question.questionBody}</p>
                    {question.options.map((option, i) => (
                        <label key={i}>
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={answers[question.questionNo] === option}
                                onChange={(e) => handleAnswerChange(question.questionNo, e.target.value)}
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