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
    console.log('Cleaning up test database...');
    await User.deleteMany({ isTest: true });
    await Lesson.deleteMany({ isTest: true });
    await Question.deleteMany({ isTest: true });

    const users = await User.find({ isTest: true });
    console.log('Users in DB after cleanup:', users);
});

afterEach(async () => {
    console.log('Cleaning up test database after each test...');
    await Question.deleteMany({ isTest: true });
    await Lesson.deleteMany({ isTest: true });
    await User.deleteMany({ isTest: true });

    const users = await User.find({ isTest: true });
    console.log('Users in DB after cleanup:', users);
});

describe('Lesson Controller', () => {
    let lessonId, userId, token;

    beforeEach(async () => {
        const uniqueUsername = 'testuser_' + new Date().getTime();

        // Create a test user
        const userResponse = await request(app).post('/api/users/signup').send({
            username: uniqueUsername,
            password: 'Test1234!',
            isTest: true
        });

        console.log('Signup Response:', userResponse.body);

        userId = userResponse.body._id;

        // Login the user to get token
        const loginResponse = await request(app).post('/api/users/login').send({
            username: uniqueUsername,
            password: 'Test1234!',
            isTest: true
        });

        console.log('Login Response:', loginResponse.body);

        token = loginResponse.body.token;

        // Create a test lesson
        const lesson = new Lesson({ lessonNo: 1, isTest: true });
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
                lessonId,
                isTest: true
            },
            {
                questionNo: 2,
                question: 'What is 3+3?',
                options: ['6', '7'],
                answer: '6',
                explanation: '3+3 equals 6',
                lessonNo: 1,
                lessonId,
                isTest: true
            }
        ];

        await Question.insertMany(questions);
    });

    test('should get a lesson by ID', async () => {
        const response = await request(app).get(`/api/lessons/${lessonId}`).set('Authorization', `Bearer ${token}`);

        console.log('Get Lesson Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('lesson');
        expect(response.body.lesson).toHaveProperty('lessonNo', 1);
    });

    test('should submit lesson answers and update user stats', async () => {
        const response = await request(app).post(`/api/lessons/${lessonId}/submit`).send({
            userId,
            answers: { 1: 'A', 2: '6' }
        }).set('Authorization', `Bearer ${token}`);

        console.log('Submit Lesson Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('result');
    });

    afterEach(async () => {
        await Question.deleteMany({ isTest: true });
        await Lesson.deleteMany({ isTest: true });
        await User.deleteMany({ isTest: true });
    });
});