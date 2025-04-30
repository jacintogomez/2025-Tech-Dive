const request=require('supertest');
const mongoose=require('mongoose');
const app=require('../server');
const User=require('../models/User');

const MONGO_URI='mongodb://127.0.0.1:27017/tech-dive-test';

beforeAll(async ()=>{
    await mongoose.connect(MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
    });
});

afterAll(async ()=>{
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('User Registration',()=>{
    const testuser={
        username:'testuser',
        email:'testuser@example.com',
        password:'testuser123',
    };
    it('should create a new user and return token + user info',async ()=>{
        const res=await request(app).post('/api/auth/register').send(testuser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(testuser.email);
        expect(res.body.user.username).toBe(testuser.username);
        const userindb=await User.findOne({email:testuser.email});
        expect(userindb).not.toBeNull();
        expect(userindb.username).toBe(testuser.username);
    });
    it('should not allow registering with an existing email',async ()=>{
        const res=await request(app).post('/api/auth/register').send(testuser);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message','User already exists');
    });
});