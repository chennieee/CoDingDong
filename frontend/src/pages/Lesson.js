import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson';
import { useAuthContext } from '../hooks/useAuthContext';
import './Lesson.css';

const Lesson = () => {
    const { id: lessonId } = useParams(); //get lessonId from URL parameters
    console.log('Display Lesson ID:', lessonId); //debug lessonId

    const { user } = useAuthContext(); //access user from AuthContext
    const userId = user ? user._id : null; //extract userId
    
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (lessonId === 'undefined' || !lessonId) {
            setLoading(false);
        }
    }, [lessonId]);

    useEffect(() => {
        if (lesson) {
            setLoading(false);
        }
    }, [lesson]);

    // Show congratulations message if there are no more lessons
    if (!lessonId || lessonId === 'undefined') {
        return (
            <div className="lesson-container">
                <p className="question-text">
                    Congratulations!<br />
                    You have completed all the lessons.<br />
                    More lessons will be coming up soon.
                </p>
            </div>
        );
    }

    // Show loading state if still loading
    if (loading) {
        return <div>Loading...</div>;
    }

    // Show no lesson found message if no lesson is founc
    if (!lesson) {
        return <div>No lesson found.</div>;
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
                        <p className="question-text">
                            Congratulations! <br />
                            You have completed all the lessons. <br />
                            More lessons will be coming up soon.
                        </p>
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