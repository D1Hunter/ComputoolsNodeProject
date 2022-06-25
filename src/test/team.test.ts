import supertest from 'supertest';
import 'dotenv/config';
import dbInstance from "../db/instantiate_sequalize";
import { app } from '../app';
import { DataGenerator } from './generate_data';
import { RoleType } from '../role/role_type';
import { UserDto } from './user_dto';
import teamService from '../team/team_service';
import tokenService from '../auth/token_service';

describe('team',()=>{
    const dataGenerator = new DataGenerator();
    let playerToken:string
    let playerData:UserDto
    let managerToken:string
    let managerData:UserDto
    let adminToken:string
    let adminData:UserDto

    beforeAll(async () => {
        await dbInstance.sync();
        let data = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
        adminToken = data.userToken;
        adminData = data.user;
        data = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
        playerToken = data.userToken;
        playerData = data.user;
        data = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
        managerToken = data.userToken;
        managerData = data.user;
    });

    describe('create', ()=>{
        it('Should return a created team', async () => {
            const data = dataGenerator.generateTeamData();
            const { statusCode,body } = await supertest(app).post('/api/team').set("authorization", `Bearer ${adminToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                teamName:data.teamName
            });
        });

        it('Should return a created team', async () => {
            const data = dataGenerator.generateTeamData();
            const { statusCode,body } = await supertest(app).post('/api/team').set("authorization", `Bearer ${adminToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                teamName:data.teamName
            });
        });

        it('Should return a 400 status code',async () => {
            const data = dataGenerator.generateTeamData();
            await supertest(app).post('/api/team').set("authorization", `Bearer ${adminToken}`).send({}).expect(400);
        });

        it('Should return a 400 status code',async () => {
            const data = dataGenerator.generateTeamData();
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            await dataGenerator.createBan(user);
            await supertest(app).post('/api/team').set("authorization", `Bearer ${userToken}`).send(data).expect(400);
        });

        it('Should return a 401 status code',async () => {
            const data = dataGenerator.generateTeamData();
            await supertest(app).post('/api/team').send(data).expect(401);
        });

        it('Should return a 403 status code for player',async () => {
            const data = dataGenerator.generateTeamData();
            await supertest(app).post('/api/team').set("authorization", `Bearer ${playerToken}`).send(data).expect(403);
        });

        it('Should return a 403 status code for manager',async () => {
            const data = dataGenerator.generateTeamData();
            await supertest(app).post('/api/team').set("authorization", `Bearer ${managerToken}`).send(data).expect(403);
        });
    });

    describe('kick user', ()=>{
        it('Should return user kick information for admin',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const data = {userId:user.id,reason:'Bad behavior'};
            const { statusCode,body } = await supertest(app).post('/api/team/kick').set("authorization", `Bearer ${adminToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:data.userId,
                reason:data.reason
            });
        });

        it('Should return user kick information for manager',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const data = {userId:user.id,reason:'Bad behavior'};
            const { statusCode,body } = await supertest(app).post('/api/team/kick').set("authorization", `Bearer ${managerToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:data.userId,
                reason:data.reason
            });
        });

        it('Should return a 400 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const data = {userId:user.id,reason:'Bad behavior'};
            await supertest(app).post('/api/team/kick').set("authorization", `Bearer ${managerToken}`).send(data).expect(400);
        });

        it('Should return a 400 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const data = {userId:user.id};
            await supertest(app).post('/api/team/kick').set("authorization", `Bearer ${managerToken}`).send(data).expect(400);
        });

        it('Should return a 400 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            dataGenerator.createBan(user);
            const data = {userId:user.id,reason:'Bad behavior'};
            await supertest(app).post('/api/team/kick').set("authorization", `Bearer ${managerToken}`).send(data).expect(400);
        });

        it('Should return a 401 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const data = {userId:user.id,reason:'Bad behavior'};
            await supertest(app).post('/api/team/kick').send(data).expect(401);
        });

        it('Should return a 403 status code for player',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const data = {userId:user.id,reason:'Bad behavior'};
            await supertest(app).post('/api/team/kick').set("authorization", `Bearer ${playerToken}`).send(data).expect(403);
        });
    });

    describe('get user team members', ()=>{
        it('Should return user team members',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const userToken = await tokenService.generateToken(user.id,user.email,user.teamId,RoleType.PLAYER);
            const { statusCode,body } = await supertest(app).get('/api/team').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                teamName:team.teamName
            });
        });

        it('Should return user team members',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const userToken = await tokenService.generateToken(user.id,user.email,user.teamId,RoleType.MANAGER);
            const { statusCode,body } = await supertest(app).get('/api/team').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                teamName:team.teamName
            });
        });

        it('Should return 400 status code',async () => {
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await supertest(app).get('/api/team').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return 400 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const userToken = await tokenService.generateToken(user.id,user.email,user.teamId,RoleType.PLAYER);
            await dataGenerator.createBan(user);
            await supertest(app).get('/api/team').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return 401 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            await supertest(app).get('/api/team').expect(401);
        });
    });

    describe('get all teams', ()=>{
        it('Should return all teams',async () => {
            const { statusCode,body } = await supertest(app).get('/api/team/all').set("authorization", `Bearer ${playerToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return all teams',async () => {
            const { statusCode,body } = await supertest(app).get('/api/team/all').set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return 401 status code',async () => {
            await supertest(app).get('/api/team/all').expect(401);
        });
    });
    
    describe('get team by id', ()=>{
        it('Should return team members',async ()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const { statusCode,body } = await supertest(app).get(`/api/team/${team.id}`).set("authorization", `Bearer ${playerToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                teamName:team.teamName
            });
        });

        it('Should return team members',async ()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const { statusCode,body } = await supertest(app).get(`/api/team/${team.id}`).set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                teamName:team.teamName
            });
        });

        it('Should return 400 status code',async ()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            await supertest(app).get(`/api/team/${team.id}@`).set("authorization", `Bearer ${adminToken}`).expect(400);
        });

        it('Should return 400 status code',async ()=>{
            const { userToken,user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            await dataGenerator.createBan(user);
            await supertest(app).get(`/api/team/${team.id}`).set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return 401 status code',async ()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            await supertest(app).get(`/api/team/${team.id}`).expect(401);
        });
    });
});