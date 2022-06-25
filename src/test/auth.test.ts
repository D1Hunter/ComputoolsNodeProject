import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import dbInstance from "../db/instantiate_sequalize";
import { app } from '../app';
import { DataGenerator } from './generate_data';
import userService from '../user/user_service';

describe('Auth',()=>{
    const dataGenerator = new DataGenerator();
    
    beforeAll(async () => {
        await dbInstance.sync();
    });

    describe('registration', ()=>{   
        it('Should return a user token',async ()=>{
            const data = dataGenerator.generateUserData();
            const { statusCode, body } = await supertest(app).post('/api/auth/register').send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return a 400 status code',async ()=>{
            const data = dataGenerator.generateUserData();
            await supertest(app).post('/api/auth/register').send({...data,password:''}).expect(400);
        });

        it('Should return a 400 status code',async ()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            await userService.create(email,hashPassword,login,firstName,secondName);
            await supertest(app).post('/api/auth/register').send(data).expect(400);
        });
    });

    describe('login', ()=>{
        it('Should return a user token',async ()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            await userService.create(email,hashPassword,login,firstName,secondName);
            const { statusCode, body } =  await supertest(app).post('/api/auth/login').send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return a 400 status code',async ()=>{
            const data = dataGenerator.generateUserData();
            await supertest(app).post('/api/auth/login').send(data).expect(400);
        });

        it('Should return a 400 status code',async ()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            await userService.create(email,hashPassword,login,firstName,secondName);
            await supertest(app).post('/api/auth/login').send({...data,password:''}).expect(400);
        });
    });

    describe('forgot-pass',()=>{
        it('Should return a reset link',async ()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            await userService.create(email,hashPassword,login,firstName,secondName);
            const { statusCode, body } = await supertest(app).post('/api/auth/forgot-pass').send({email});
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return a 400 status code',async ()=>{
            const data = dataGenerator.generateUserData();
            const {email} = data;
            await supertest(app).post('/api/auth/forgot-pass').send({email}).expect(400);
        });

        it('Should return a 400 status code',async ()=>{
            const data = dataGenerator.generateUserData(); 
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            await userService.create(email,hashPassword,login,firstName,secondName);
            await supertest(app).post('/api/auth/forgot-pass').send({email:''}).expect(400);
        });
    });

    describe('resset-pass',()=>{
        it('Should return a message',async () => {
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName);
            const activationLink = await userService.createActivationLink(user);
            await supertest(app).post(`/api/auth/reset-pass/${activationLink}`).send({password:"newPassword"}).expect(200);
        });

        it('Should return a 400 status code',async () => {
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName);
            const activationLink = await userService.createActivationLink(user);
            const newPassword = 'newPassword';
            await supertest(app).post(`/api/auth/reset-pass/${activationLink}@`).send({password:newPassword}).expect(400);
        });

        it('Should return a 400 status code',async () => {
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName);
            const activationLink = await userService.createActivationLink(user);
            const newPassword = 'newPassword';
            await supertest(app).post(`/api/auth/reset-pass/${activationLink}`).send({password:newPassword.repeat(2)}).expect(400);
        });
    });
});