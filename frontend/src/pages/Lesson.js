import React from 'react';
import { useParams } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson';
import { useAuthContext } from '../hooks/useAuthContext';

const Lesson = () => {
    const { id: lessonId } = useParams(); //get lessonId from URL parameters
    console.log('Lesson ID:', lessonId); //debug lessonId

    const { user } = useAuthContext(); //access user from AuthContext
    const userId = user ? user._id : null; //extract userId

    const { lesson, questions, answers, handleAnswerChange, submitted, results, handleSubmit }
        = useLesson(lessonId, userId);

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
        <div className="lesson-container">
            <h1>Lesson {lesson.lessonNo}</h1>
            {questions.map((question, index) => (
                <div key={index} className="question">
                    <div className="question-text">Question {question.questionNo}: {question.question}</div>
                    <ul className="options">
                        {question.options.map((option, optIndex) => (
                            <li key={optIndex} className="option">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={option}
                                    id={`question-${index}-option-${optIndex}`}
                                    checked={answers[question.questionNo] === option}
                                    onChange={(e) => handleAnswerChange(question.questionNo, e.target.value)}
                                />
                                <label htmlFor={`question-${index}-option-${optIndex}`}>
                                    {option}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Lesson;