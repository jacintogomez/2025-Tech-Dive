const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const userRoutes = require('../routes/auth'); // or wherever your route is
const User = require('../models/User');

let mongod;
let app;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    app = express();
    app.use(express.json());
    app.use('/', userRoutes);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await User.deleteMany();

    await User.create([
        { username: 'user1', email: 'user1@example.com', password: 'password123' },
        { username: 'user2', email: 'user2@example.com', password: 'password456' },
    ]);
});

test('should fetch all users', async () => {
    const response = await request(app).get('/users');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('username', 'user1');
});
