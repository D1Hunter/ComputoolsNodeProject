import supertest from 'supertest';
import 'dotenv/config';
import dbInstance from "../db/instantiate_sequalize";
import { app } from '../app';
import { DataGenerator } from './generate_data';
import { RoleType } from '../role/role_type';

describe('role', ()=>{
    const dataGenerator = new DataGenerator();
    let playerToken:string
    let managerToken:string
    let adminToken:string

    beforeAll(async () => {
        await dbInstance.sync();
        let data = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
        playerToken = data.userToken;
        data = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
        managerToken = data.userToken;
        data = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
        adminToken = data.userToken;
    });

    describe('create role', ()=>{
        it('Should return a new role', async ()=>{
            const roleData = dataGenerator.generateRoleData();
            const { statusCode,body } = await supertest(app).post('/api/role/create').set("authorization", `Bearer ${adminToken}`).send(roleData);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                name:roleData.name
            });
        });

        it('Should return a 400 status code', async ()=>{
            await supertest(app).post('/api/role/create').set("authorization", `Bearer ${adminToken}`).expect(400);
        });

        it('Should return a 401 status code', async ()=>{
            const roleData = dataGenerator.generateRoleData();
            await supertest(app).post('/api/role/create').send(roleData).expect(401);
        });

        it('Should return a 403 status code for player', async ()=>{
            const roleData = dataGenerator.generateRoleData();
            await supertest(app).post('/api/role/create').set("authorization", `Bearer ${playerToken}`).send(roleData).expect(403);
        });

        it('Should return a 403 status code for manager', async ()=>{
            const roleData = dataGenerator.generateRoleData();
            await supertest(app).post('/api/role/create').set("authorization", `Bearer ${managerToken}`).send(roleData).expect(403);
        });
    });

    describe('get all roles', ()=>{
        it('Should return all roles', async ()=>{
            const { statusCode,body } = await supertest(app).get('/api/role/all').set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return a 401 status code', async ()=>{
            await supertest(app).get('/api/role/all').expect(401);
        });

        it('Should return a 403 status code for player', async ()=>{
            await supertest(app).get('/api/role/all').set("authorization", `Bearer ${playerToken}`).expect(403);
        });

        it('Should return a 403 status code for manager', async ()=>{
            await supertest(app).get('/api/role/all').set("authorization", `Bearer ${managerToken}`).expect(403);
        });
    });
});