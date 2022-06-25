import supertest from 'supertest';
import 'dotenv/config';
import dbInstance from "../db/instantiate_sequalize";
import { app } from '../app';
import { DataGenerator } from './generate_data';
import { RoleType } from '../role/role_type';
import { UserDto } from './user_dto';
import teamRequestService from '../team_request/teamrequest_service';
import teamService from '../team/team_service';
import { TeamRequestTypes, TeamRequestStatusTypes } from '../team_request/team_request_type';
import { ApplicationListStatusTypes } from '../application_list/application_list_type';
import applicationlistService from '../application_list/application_list_service';

describe('application-list', ()=>{
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

    describe('manager-register', ()=>{
        it('Should return a application', async()=>{
            const { userToken,user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await teamRequestService.acceptRequest(adminData.id,teamRequest.id);
            const { statusCode,body } = await supertest(app).post('/api/application-list/manager-register').set("authorization", `Bearer ${userToken}`).expect(200);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:user.id,
                status:ApplicationListStatusTypes.PENDING
            })
        });

        it('Should return a 400 status code', async()=>{
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await supertest(app).post('/api/application-list/manager-register').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 400 status code', async()=>{
            const { userToken,user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await applicationlistService.create(user.id,ApplicationListStatusTypes.ACCEPTED);
            await supertest(app).post('/api/application-list/manager-register').set("authorization", `Bearer ${userToken}`).expect(400);
        });


        it('Should return a 401 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await teamRequestService.acceptRequest(adminData.id,teamRequest.id);
            await supertest(app).post('/api/application-list/manager-register').expect(401);
        });

        it('Should return a 403 status code for manager', async()=>{
            const { userToken,user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await teamRequestService.acceptRequest(adminData.id,teamRequest.id);
            await supertest(app).post('/api/application-list/manager-register').set("authorization", `Bearer ${userToken}`).expect(403);
        });

        it('Should return a 403 status code for admin', async()=>{
            const { userToken,user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            const team = await teamService.create(dataGenerator.generateTeamData().teamName);
            const teamRequest = await teamRequestService.create(user.id,team.id,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING);
            await teamRequestService.acceptRequest(adminData.id,teamRequest.id);
            await supertest(app).post('/api/application-list/manager-register').set("authorization", `Bearer ${userToken}`).expect(403);
        });
    });

    describe('aprove-manager', ()=>{
        it('Should return a application', async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            const { statusCode,body } = await supertest(app).post('/api/application-list/aprove-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:application.id});
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                id:application.id,
                userId:user.id,
                status:ApplicationListStatusTypes.ACCEPTED
            });
        });

        it('Should return a 400 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/aprove-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:`${application.id}@`}).expect(400);
        });

        it('Should return a 400 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.ACCEPTED);
            await supertest(app).post('/api/application-list/aprove-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:`${application.id}`}).expect(400);
        });
        
        it('Should return a 400 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.DECLINED);
            await supertest(app).post('/api/application-list/aprove-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:`${application.id}`}).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/aprove-manager').send({applicationId:application.id}).expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/aprove-manager').set("authorization", `Bearer ${playerToken}`).send({applicationId:application.id}).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/aprove-manager').set("authorization", `Bearer ${managerToken}`).send({applicationId:application.id}).expect(403);
        });
    });

    describe('decline-manager', ()=>{
        it('Should return a application',async () => {
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            const { statusCode,body } = await supertest(app).post('/api/application-list/decline-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:application.id});
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                id:application.id,
                userId:user.id,
                status:ApplicationListStatusTypes.DECLINED
            });
        });

        it('Should return a 400 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/decline-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:`${application.id}@`}).expect(400);
        });

        it('Should return a 400 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.ACCEPTED);
            await supertest(app).post('/api/application-list/decline-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:`${application.id}`}).expect(400);
        });
        
        it('Should return a 400 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.DECLINED);
            await supertest(app).post('/api/application-list/decline-manager').set("authorization", `Bearer ${adminToken}`).send({applicationId:`${application.id}`}).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/decline-manager').send({applicationId:application.id}).expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/decline-manager').set("authorization", `Bearer ${playerToken}`).send({applicationId:application.id}).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            const { user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).post('/api/application-list/aprove-manager').set("authorization", `Bearer ${managerToken}`).send({applicationId:application.id}).expect(403);
        });
    });

    describe('get all applications', ()=>{
        it('Should return all applications', async () => {
            const { statusCode,body } = await supertest(app).get('/api/application-list/all').set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return a 400 status code', async()=>{
            const { user, userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            await dataGenerator.createBan(user);
            await supertest(app).get('/api/application-list/all').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            await supertest(app).get('/api/application-list/all').expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            await supertest(app).get('/api/application-list/all').set("authorization", `Bearer ${playerToken}`).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            await supertest(app).get('/api/application-list/all').set("authorization", `Bearer ${managerToken}`).expect(403);
        });
    });

    describe('get user application', ()=>{
        it('Should return user application', async () => {
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const application = await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            const { statusCode,body } = await supertest(app).get('/api/application-list').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                id:application.id,
                userId:user.id,
                status:application.status
            });
        });

        it('Should return a 400 status code', async()=>{
            const { user, userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            await dataGenerator.createBan(user);
            await supertest(app).get('/api/application-list').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            await supertest(app).get('/api/application-list').expect(401);
        });

        it('Should return a 403 status code for manager', async()=>{
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).get('/api/application-list').set("authorization", `Bearer ${userToken}`).expect(403);
        });

        it('Should return a 403 status code for admin', async()=>{
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            await applicationlistService.create(user.id,ApplicationListStatusTypes.PENDING);
            await supertest(app).get('/api/application-list').set("authorization", `Bearer ${userToken}`).expect(403);
        });
    });
});