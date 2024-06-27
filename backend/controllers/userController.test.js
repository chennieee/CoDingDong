// userController.test.js
const request = require('supertest');
const app = require('../server'); //express app must be exported from server.js
const mongoose = require('mongoose');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONG_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
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
  });

  test('should login the user', async () => {
    const response = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'Test1234!'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('should get user profile', async () => {
    const loginResponse = await request(app).post('/api/users/login').send({
      username: 'testuser',
      password: 'Test1234!'
    });

    const token = loginResponse.body.token;

    const response = await request(app).get(`/api/users/profile/${userId}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  afterAll(async () => {
    await User.deleteOne({ _id: userId });
  });
});