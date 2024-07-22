import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson';
import { useAuthContext } from '../hooks/useAuthContext';
import './Lesson.css';

const Lesson = () => {
    const { id: lessonId } = useParams(); //get lessonId from URL parameters
    console.log('Display Lesson ID:', lessonId); //debug lessonId

    const { user } = useAuthContext(); //access user from AuthContext
    const userId = user ? user._id : null; //extract userId

    const { 
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
    } = useLesson(lessonId, userId);

    const navigate = useNavigate(); //for navigation

    // Show loading state if lesson not yet available
    if (!lesson) {
        return <div>Loading...</div>;
    }

    console.log('Lesson data:', lesson); //debugging
    console.log('Lesson number:', lesson.lessonNo); //debugging
    console.log('Questions data:', questions); //debugging

    if (!lesson) {
        return <div>Loading...</div>;
    }

    if (submitted) {
        const total = questions.length;
        const score = results.score;
        const allCorrect = score === total;

        function navigateToNextLesson() {
            if (nextLessonId) {
                navigate(`/lesson/${nextLessonId}`)
            }
        };

        return (
            <div className="lesson-container">
                <h2>Your score: {results.score}</h2>
                {allCorrect && <h2>Congratulations!</h2>}
                {results.wrongAnswers && results.wrongAnswers.length > 0 && (
                    <div className="incorrect-answers">
                        <h3>Incorrect Answers:</h3>
                        {results.wrongAnswers.map((question, index) => (
                            <div key={index}>
                                <p>Question {question.questionNo}: {question.question}</p>
                                <p>Your answer: {question.userAnswer}</p>
                                <p>Correct answer: {question.correctAnswer}</p>
                                <p className="explanation">Explanation: {question.explanation}</p>
                            </div>
                        ))}
                    </div>
                )}
                {noMoreLessons ? (
                    <div className="no-more-lessons">
                        <h3>Congratulations! You have completed all the lessons. More lessons will be coming up soon.</h3>
                    </div>
                ) : (
                    <button className="next-lesson-button" onClick={() => navigateToNextLesson()}>Next Lesson</button>
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
            {error && <div className="error">{error}</div>}
            <button className="submit-button" onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Lesson;