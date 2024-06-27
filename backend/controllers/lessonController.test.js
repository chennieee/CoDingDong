//test lessonController
const request = require('supertest');
const { app, startServer, closeServer } = require('../server');
const Lesson = require('../models/Lesson');
const Question = require('../models/Question');
const User = require('../models/User');

beforeAll(async () => {
    await startServer();
});

afterAll(async () => {
    await closeServer();
});

beforeEach(async () => {
    await User.deleteMany({});
    await Lesson.deleteMany({});
});

describe('Lesson Controller', () => {
    let lessonId, userId, token;

    beforeEach(async () => {
        // Create a test user
        const userResponse = await request(app).post('/api/users/signup').send({
            username: 'testuser',
            password: 'Test1234!'
        });

        userId = userResponse.body._id;

        // Login the user to get token
        const loginResponse = await request(app).post('/api/users/login').send({
            username: 'testuser',
            password: 'Test1234!'
        });

        token = loginResponse.body.token;

        // Create a test lesson
        const lesson = new Lesson({ lessonNo: 1 });
        await lesson.save();
        lessonId = lesson._id;

        // Create test questions associated with the lesson
        const questions = [
            {
                questionNo: 1,
                question: 'What is 2+2?',
                options: ['3', '4'],
                answer: '4',
                explanation: '2+2 equals 4',
                lessonNo: 1,
                lessonId
            },
            {
                questionNo: 2,
                question: 'What is 3+3?',
                options: ['6', '7'],
                answer: '6',
                explanation: '3+3 equals 6',
                lessonNo: 1,
                lessonId
            }
        ];

        await Question.insertMany(questions);
    });

    test('should get a lesson by ID', async () => {
        const response = await request(app).get(`/api/lessons/${lessonId}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('lesson');
        expect(response.body.lesson).toHaveProperty('lessonNo', 1);
    });

    test('should submit lesson answers and update user stats', async () => {
        const response = await request(app).post(`/api/lessons/${lessonId}/submit`).send({
            userId,
            answers: { 1: 'A', 2: '6' }
        }).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('result');
    });

    afterEach(async () => {
        await Question.deleteMany({});
        await Lesson.deleteMany({});
        await User.deleteMany({});
    });
});