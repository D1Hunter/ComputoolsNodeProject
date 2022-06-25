import supertest from "supertest";
import 'dotenv/config';
import dbInstance from "../db/instantiate_sequalize";
import { app } from '../app';
import { UserDto } from './user_dto';
import { RoleType } from '../role/role_type';
import { DataGenerator } from './generate_data';
import teamService from '../team/team_service';
import teamRequestService from '../team_request/teamrequest_service';
import { TeamRequestTypes, TeamRequestStatusTypes } from '../team_request/team_request_type';
import tokenService from '../auth/token_service';
import userService from '../user/user_service';

describe('team-request',()=>{
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

    describe('join team', ()=>{
        it('Should return a team request',async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            const { statusCode,body } = await supertest(app).post('/api/team-request/join-team').set("authorization", `Bearer ${userToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:user.id,
                teamId:team.id,
                requestType:TeamRequestTypes.JOIN_TEAM
            });
        });

        it('Should return a 400 status code',async () => {
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await supertest(app).post('/api/team-request/join-team').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 401 status code',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/join-team').send(data).expect(401);
        });

        it('Should return a 403 status code',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/join-team').set("authorization", `Bearer ${managerToken}`).send(data).expect(403);
        });

        it('Should return a 403 status code',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/join-team').set("authorization", `Bearer ${adminToken}`).send(data).expect(403);
        });
    });

    describe('move another team', ()=>{
        it('Should return a team request',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,teamFrom);
            const userToken = await tokenService.generateToken(user.id,user.email,user.teamId,RoleType.PLAYER);
            const data = {teamId:teamTo.id}
            const { statusCode,body } = await supertest(app).post('/api/team-request/move-another-team').set("authorization", `Bearer ${userToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:user.id,
                teamId:teamTo.id,
                requestType:TeamRequestTypes.MOVE_ANOTHER_TEAM
            });
        });

        it('Should return a 400 status code',async () => {
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await supertest(app).post('/api/team-request/move-another-team').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 401 status code',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/move-another-team').send(data).expect(401);
        });

        it('Should return a 403 status code for manager',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/move-another-team').set("authorization", `Bearer ${managerToken}`).send(data).expect(403);
        });

        it('Should return a 403 status code for admin',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/move-another-team').set("authorization", `Bearer ${adminToken}`).send(data).expect(403);
        });
    });

    describe('leave team', ()=>{
        it('Should return a team request',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,team);
            const userToken = await tokenService.generateToken(user.id,user.email,user.teamId,RoleType.PLAYER);
            const { statusCode,body } = await supertest(app).post('/api/team-request/leave-team').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:user.id,
                teamId:team.id,
                requestType:TeamRequestTypes.LEAVE_TEAM
            });
        });

        it('Should return a 400 status code',async () => {
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await supertest(app).post('/api/team-request/leave-team').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 401 status code',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/leave-team').send(data).expect(401);
        });

        it('Should return a 403 status code for manager',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/leave-team').set("authorization", `Bearer ${managerToken}`).send(data).expect(403);
        });

        it('Should return a 403 status code for admin',async () => {
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const data = {teamId:team.id}
            await supertest(app).post('/api/team-request/move-another-team').set("authorization", `Bearer ${adminToken}`).send(data).expect(403);
        });
    });

    describe('get all team requests', ()=>{
        it('Should return all team requests',async () => {
            const { statusCode,body } = await supertest(app).get('/api/team-request/all').set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return all team requests',async () => {
            const { statusCode,body } = await supertest(app).get('/api/team-request/all').set("authorization", `Bearer ${managerToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return a 401 status code',async () => {
            await supertest(app).get('/api/team-request/all').expect(401);
        });

        it('Should return a 403 status code for player',async () => {
            await supertest(app).get('/api/team-request/all').set("authorization", `Bearer ${playerToken}`).expect(403);
        });

    });

    describe('get user team request', ()=>{
        it('Should return user team request',async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            const { statusCode,body } = await supertest(app).get('/api/team-request').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                status:teamRequest.status,
                requestType:teamRequest.requestType
            });
        });

        it('Should return user team request',async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.LEAVE_TEAM,TeamRequestStatusTypes.PENDING);
            const { statusCode,body } = await supertest(app).get('/api/team-request').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                status:teamRequest.status,
                requestType:teamRequest.requestType
            });
        });

        it('Should return a 401 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamRequestService.create(user.id,team.id,TeamRequestTypes.LEAVE_TEAM,TeamRequestStatusTypes.PENDING);
            await supertest(app).get('/api/team-request').expect(401);
        });

        it('Should return a 403 status code for manager',async () => {
            await supertest(app).get('/api/team-request').set("authorization", `Bearer ${managerToken}`).expect(403);
        });

        it('Should return a 403 status code for admin',async () => {
            await supertest(app).get('/api/team-request').set("authorization", `Bearer ${adminToken}`).expect(403);
        });
    })

    describe('accept request', ()=>{
        it('Should return team request',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const manager = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await teamService.addUserToTeam(manager.user,team);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            const data = {teamRequestId:teamRequest.id};
            const { statusCode,body } = await supertest(app).post('/api/team-request/accept').set("authorization", `Bearer ${manager.userToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:user.id,
                teamId:team.id,
                status:TeamRequestStatusTypes.ACCEPTED
            });
        });

        it('Should return team request',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            const managerFrom = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const managerTo = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await teamService.addUserToTeam(user,teamFrom);
            await teamService.addUserToTeam(managerFrom.user,teamFrom);
            await teamService.addUserToTeam(managerTo.user,teamTo);
            const teamRequest = await teamRequestService.moveAnotherTeam(user.id,teamTo.id);
            const data = {teamRequestId:teamRequest.id};
            const {body:bodyFirst} = await supertest(app).post('/api/team-request/accept').set("authorization", `Bearer ${managerTo.userToken}`).send(data).expect(200);
            expect(bodyFirst).toMatchObject({
                status:TeamRequestStatusTypes.PENDING
            })
            const {body:bodySecond} = await supertest(app).post('/api/team-request/accept').set("authorization", `Bearer ${managerFrom.userToken}`).send(data).expect(200);
            expect(bodySecond).toMatchObject({
                status:TeamRequestStatusTypes.ACCEPTED
            });
            const requestUser = await userService.getUserById(user.id);
            expect(requestUser).toMatchObject({
                id:user.id,
                teamId:teamTo.id
            });
        });

        it('Should return team request',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,teamFrom);
            const teamRequest = await teamRequestService.moveAnotherTeam(user.id,teamTo.id);
            const data = {teamRequestId:teamRequest.id};
            const {body:bodyFirst} = await supertest(app).post('/api/team-request/accept').set("authorization", `Bearer ${adminToken}`).send(data).expect(200);
            expect(bodyFirst).toMatchObject({
                status:TeamRequestStatusTypes.ACCEPTED
            });
        });

        it('Should return 401 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,teamFrom);
            const teamRequest = await teamRequestService.moveAnotherTeam(user.id,teamTo.id);
            const data = {teamRequestId:teamRequest.id};
            await supertest(app).post('/api/team-request/accept').send(data).expect(401);
        });

        it('Should return 403 status code for player',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,teamFrom);
            const teamRequest = await teamRequestService.moveAnotherTeam(user.id,teamTo.id);
            const data = {teamRequestId:teamRequest.id};
            await supertest(app).post('/api/team-request/accept').set("authorization", `Bearer ${playerToken}`).send(data).expect(403);
        });
    });

    describe('decline request', ()=>{
        it('Should return a team request', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const manager = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await teamService.addUserToTeam(manager.user,team);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            const data = {teamRequestId:teamRequest.id};
            const { statusCode,body } = await supertest(app).post('/api/team-request/decline').set("authorization", `Bearer ${manager.userToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:user.id,
                teamId:team.id,
                status:TeamRequestStatusTypes.DECLINED
            });
        });

        it('Should return team request',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,teamFrom);
            const teamRequest = await teamRequestService.moveAnotherTeam(user.id,teamTo.id);
            const data = {teamRequestId:teamRequest.id};
            const { statusCode,body } = await supertest(app).post('/api/team-request/decline').set("authorization", `Bearer ${adminToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:user.id,
                status:TeamRequestStatusTypes.DECLINED
            });
        });

        it('Should return 401 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,teamFrom);
            const teamRequest = await teamRequestService.moveAnotherTeam(user.id,teamTo.id);
            const data = {teamRequestId:teamRequest.id};
            await supertest(app).post('/api/team-request/decline').send(data).expect(401);
        });

        it('Should return 403 status code for player',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const teamFrom = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamTo = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamService.addUserToTeam(user,teamFrom);
            const teamRequest = await teamRequestService.moveAnotherTeam(user.id,teamTo.id);
            const data = {teamRequestId:teamRequest.id};
            await supertest(app).post('/api/team-request/decline').set("authorization", `Bearer ${playerToken}`).send(data).expect(403);
        });
    });

    describe('delete request', ()=>{
        it('Should return a message',async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await supertest(app).delete('/api/team-request').set("authorization", `Bearer ${userToken}`).expect(200);
        });

        it('Should return a 400 status code',async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await teamRequestService.acceptRequest(adminData.id,teamRequest.id);
            await supertest(app).delete('/api/team-request').set("authorization", `Bearer ${userToken}`).expect(400);
        });
        
        it('Should return a 400 status code',async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await teamRequestService.declineRequest(adminData.id,teamRequest.id);
            await supertest(app).delete('/api/team-request').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 401 status code',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await supertest(app).delete('/api/team-request').expect(401);
        });

        it('Should return a 403 status code for manager',async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await supertest(app).delete('/api/team-request').set("authorization", `Bearer ${userToken}`).expect(403);
        });
    });
});