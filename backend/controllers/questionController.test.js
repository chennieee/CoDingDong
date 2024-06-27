//test questionController
const request = require('supertest');
const { app, startServer, closeServer } = require('../server');
const Question = require('../models/Question');
const Lesson = require('../models/Lesson');

beforeAll(async () => {
    await startServer();
});

afterAll(async () => {
    await closeServer();
});

beforeEach(async () => {
    await Question.deleteMany({});
    await Lesson.deleteMany({});
});

describe('Question Controller', () => {
    let lessonId, questionId;

    beforeEach(async () => {
        // Create a test lesson with lessonNo
        const lesson = new Lesson({ lessonNo: 1 });
        await lesson.save();
        lessonId = lesson._id;

        // Create a test question with lessonNo
        const question = new Question({
            questionNo: 1,
            question: 'What is 2+2?',
            options: ['3', '4'],
            answer: '4',
            explanation: '2+2 equals 4',
            lessonId,
            lessonNo: 1
        });

        await question.save();
        questionId = question._id;
    });

    test('should get questions by lesson ID', async () => {
        const response = await request(app).get(`/api/questions/lesson/${lessonId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty('question', 'What is 2+2?');
    });

    afterEach(async () => {
        if (questionId) {
            await Question.deleteOne({ _id: questionId });
        }
        if (lessonId) {
            await Lesson.deleteOne({ _id: lessonId });
        }
    });
});