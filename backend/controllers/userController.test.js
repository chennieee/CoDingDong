//test userController
const request = require('supertest');
const { app, startServer, closeServer } = require('../server');
const User = require('../models/User');

beforeAll(async () => {
    await startServer();
});

afterAll(async () => {
    await closeServer();
});

beforeEach(async () => {
    await User.deleteMany({}); // Clean up the database before each test
});

afterEach(async () => {
    await User.deleteMany({}); // Clean up the database after each test
});

describe('User Controller', () => {
    let userId;

    test('should signup a new user', async () => {
        const response = await request(app).post('/api/users/signup').send({
            username: 'testuser',
            password: 'Test1234!'
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('username', 'testuser');
        userId = response.body._id;

        // Verify the user is in the database
        const userInDb = await User.findById(userId);
        expect(userInDb).not.toBeNull();
        expect(userInDb.username).toBe('testuser');
    });

    test('should login the user', async () => {
        // Ensure the user is created first
        await request(app).post('/api/users/signup').send({
            username: 'testuser',
            password: 'Test1234!'
        });

        const response = await request(app).post('/api/users/login').send({
            username: 'testuser',
            password: 'Test1234!'
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('should get user profile', async () => {
        // Ensure the user is created first
        const signupResponse = await request(app).post('/api/users/signup').send({
            username: 'testuser',
            password: 'Test1234!'
        });
        userId = signupResponse.body._id;

        const loginResponse = await request(app).post('/api/users/login').send({
            username: 'testuser',
            password: 'Test1234!'
        });

        const token = loginResponse.body.token;

        const response = await request(app).get(`/api/users/profile/${userId}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', 'testuser');
    });


    afterEach(async () => {
        if (userId) {
            await User.deleteOne({ _id: userId });
        }
    });
});