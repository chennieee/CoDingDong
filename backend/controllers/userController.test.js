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
    console.log('Cleaning up test database...');
    await User.deleteMany({ isTest: true }); // Clean up test users before each test
    const users = await User.find({ isTest: true });
    console.log('Users in DB after cleanup:', users);
});

afterEach(async () => {
    console.log('Cleaning up test database after each test...');
    await User.deleteMany({ isTest: true }); // Clean up test users after each test
    const users = await User.find({ isTest: true });
    console.log('Users in DB after cleanup:', users);
});

describe('User Controller', () => {
    let userId;
    let token;

    test('should signup a new user', async () => {
        const uniqueUsername = 'testuser_' + new Date().getTime();
        const response = await request(app).post('/api/users/signup').send({
            username: uniqueUsername,
            password: 'Test1234!',
            isTest: true
        });

        console.log('Signup Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('username', response.body.username);
        userId = response.body._id;

        // Verify the user is in the database
        const userInDb = await User.findById(userId);
        expect(userInDb).not.toBeNull();
        expect(userInDb.username).toBe(response.body.username);
        expect(userInDb.isTest).toBe(true);
    });

    test('should login the user', async () => {
        const uniqueUsername = 'testuser_' + new Date().getTime();
        // Ensure the user is created first
        await request(app).post('/api/users/signup').send({
            username: uniqueUsername,
            password: 'Test1234!',
            isTest: true
        });

        const response = await request(app).post('/api/users/login').send({
            username: uniqueUsername,
            password: 'Test1234!'
        });

        console.log('Login Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });

    test('should get user profile', async () => {
        const uniqueUsername = 'testuser_' + new Date().getTime();
        // Ensure the user is created first
        const signupResponse = await request(app).post('/api/users/signup').send({
            username: uniqueUsername,
            password: 'Test1234!',
            isTest: true
        });
        userId = signupResponse.body._id;

        const loginResponse = await request(app).post('/api/users/login').send({
            username: uniqueUsername,
            password: 'Test1234!'
        });

        const token = loginResponse.body.token;

        const response = await request(app).get(`/api/users/profile/${userId}`)
                                           .set('Authorization', `Bearer ${token}`);

        console.log('Get Profile Response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', uniqueUsername);
    });

    afterEach(async () => {
        await User.deleteMany({ isTest: true });
    });
});