import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import dbInstance from "../db/instantiate_sequalize";
import { app } from '../app';
import { DataGenerator } from './generate_data';
import { UserDto } from './user_dto';
import userService from '../user/user_service';
import roleService from '../role/role_service';
import { RoleType } from '../role/role_type';
import banListService from '../ban_list/ban_list_service';

describe('user',()=>{
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

    describe('get-profile',()=>{
        it('Should return a user profile for player', async ()=>{
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const { statusCode,body }= await supertest(app).get('/api/user').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                email:user.email,
                login:user.login
            });
        });

        it('Should return a user profile for manager', async ()=>{
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const { statusCode, body }= await supertest(app).get('/api/user').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                email:user.email,
                login:user.login
            });
        });

        it('Should return a user profile for admin', async ()=>{
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            const { statusCode,body }= await supertest(app).get('/api/user').set("authorization", `Bearer ${userToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                email:user.email,
                login:user.login
            });
        });

        it('Should return a 401 status code', async ()=>{
            await supertest(app).get('/api/user').expect(401);
        })

        it('Should return a 400 status code', async()=>{
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            await supertest(app).get('/api/user').set("authorization", `Bearer ${userToken}`).expect(400);
        });
    });
    
    describe('change-profile', ()=>{
        it('Should return a user profile for player', async()=>{
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const data = await dataGenerator.generateProfileData();
            const { statusCode,body }= await supertest(app).patch('/api/user').set("authorization", `Bearer ${userToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({  
                login: data.login
            });
        });

        it('Should return a user profile for manager', async()=>{
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const data = await dataGenerator.generateProfileData();
            const { statusCode,body }= await supertest(app).patch('/api/user').set("authorization", `Bearer ${userToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({  
                login: data.login
            });
        });

        it('Should return a user profile for admin', async()=>{
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            const data = await dataGenerator.generateProfileData();
            const { statusCode,body } = await supertest(app).patch('/api/user').set("authorization", `Bearer ${userToken}`).send(data);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({  
                login: data.login
            });
        });

        it('Should return a 401 status code', async()=>{
            const data = await dataGenerator.generateProfileData();
            await supertest(app).patch('/api/user').send(data).expect(401);
        });

        it('Should return a 400 status code', async()=>{
            const { userToken, user } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            const data = await dataGenerator.generateProfileData();
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            await supertest(app).patch('/api/user').set("authorization", `Bearer ${userToken}`).send(data).expect(400);
        });
    });

    describe('get all users', ()=>{
        it('Should return all users', async()=>{
            const { statusCode,body } =await supertest(app).get('/api/user/all').set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
        });

        it('Should return a 401 status code', async()=>{
            await supertest(app).get('/api/user/all').expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            await supertest(app).get('/api/user/all').set("authorization", `Bearer ${playerToken}`).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            const { userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await supertest(app).get('/api/user/all').set("authorization", `Bearer ${userToken}`).expect(403);
        });

        it('Should return a 400 status code', async()=>{
            const { user, userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            await supertest(app).get('/api/user/all').set("authorization", `Bearer ${userToken}`).expect(400);
        });
    });

    describe('get user by id', ()=>{
        it('Should return a user', async()=>{
            const { statusCode,body } =await supertest(app).get(`/api/user/${playerData.id}`).set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({  
                id:playerData.id
            });
        });

        it('Should return a 400 status code', async()=>{
            await supertest(app).get(`/api/user/${playerData.id}@`).set("authorization", `Bearer ${adminToken}`).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            await supertest(app).get(`/api/user/${playerData.id}`).expect(401);
        });

        it('Should return a 493 status code for player', async()=>{
            await supertest(app).get(`/api/user/${playerData.id}`).set("authorization", `Bearer ${playerToken}`).expect(403);
        });
    });

    describe('delete user by id', ()=>{
        it('Should return a message', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            await supertest(app).delete(`/api/user/${user.id}`).set("authorization", `Bearer ${adminToken}`).expect(200);
        });

        it('Should return a 400 status code', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            await supertest(app).delete(`/api/user/${user.id}@`).set("authorization", `Bearer ${adminToken}`).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            await supertest(app).delete(`/api/user/${user.id}`).expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName);
            await supertest(app).delete(`/api/user/${user.id}`).set("authorization", `Bearer ${playerToken}`).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName);
            await supertest(app).delete(`/api/user/${user.id}`).set("authorization", `Bearer ${managerToken}`).expect(403);
        });
    });

    describe('get all managers', ()=>{
        it('Should return all managers', async()=>{
            const managerRole = await roleService.getRoleByName(RoleType.MANAGER);
            const { statusCode,body } = await supertest(app).get('/api/user/allManagers').set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body[0]).toMatchObject({
                roleId:managerRole.id
            });
        });

        it('Should return a 400 status code', async()=>{
            const { user, userToken } = await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.ADMIN);
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            await supertest(app).get('/api/user/allManagers').set("authorization", `Bearer ${userToken}`).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            await supertest(app).get('/api/user/allManagers').expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            await supertest(app).get('/api/user/allManagers').set("authorization", `Bearer ${playerToken}`).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            await supertest(app).get('/api/user/allManagers').set("authorization", `Bearer ${managerToken}`).expect(403);
        });
    });

    describe('get manager by id', ()=>{
        it('Should return a manager', async()=>{
            const { user } =await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            const { statusCode,body } =await supertest(app).get(`/api/user/managerById?id=${user.id}`).set("authorization", `Bearer ${adminToken}`);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({  
                id:user.id
            });
        });

        it('Should return a 400 status code', async()=>{
            const { user } =await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await supertest(app).get(`/api/user/managerById?id=${user.id}@`).set("authorization", `Bearer ${adminToken}`).expect(400);
        });

        it('Should return a 400 status code', async()=>{
            const { user } =await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.PLAYER);
            await supertest(app).get(`/api/user/managerById?id=${user.id}`).set("authorization", `Bearer ${adminToken}`).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            const { user } =await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await supertest(app).get(`/api/user/managerById?id=${user.id}`).expect(401);
        });

        it('Should return a 403 status code', async()=>{
            const { user } =await dataGenerator.createUser(dataGenerator.generateUserData(),RoleType.MANAGER);
            await supertest(app).get(`/api/user/managerById?id=${user.id}`).set("authorization", `Bearer ${playerToken}`).expect(403);
        });
    });

    describe('ban user by id', ()=>{
        it('Should return a user ban info', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            const ban = {userId:user.id,reason:"Spam"};
            const { statusCode,body } = await supertest(app).post('/api/user/banUser').set("authorization", `Bearer ${adminToken}`).send(ban);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:ban.userId,
                reason:ban.reason
            });
        });

        it('Shoult return a 400 status code', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            const ban = {userId:(user.id+10),reason:'Spam'};
            await supertest(app).post('/api/user/banUser').set("authorization", `Bearer ${adminToken}`).send(ban).expect(400);
        });

        it('Shoult return a 400 status code', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName);
            dataGenerator.createBan(user);
            const ban = {userId:user.id,reason:'Spam'};
            await supertest(app).post('/api/user/banUser').set("authorization", `Bearer ${adminToken}`).send(ban).expect(400);
        });

        it('Shoult return a 400 status code', async()=>{
            await supertest(app).post('/api/user/banUser').set("authorization", `Bearer ${adminToken}`).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            await supertest(app).post('/api/user/banUser').expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            await supertest(app).post('/api/user/banUser').set("authorization", `Bearer ${playerToken}`).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            await supertest(app).post('/api/user/banUser').set("authorization", `Bearer ${managerToken}`).expect(403);
        });
    });

    describe('unban user by id', ()=>{
        it('Should return a user unban info', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            const unban = {userId:user.id,reason:'Charges dropped'};
            const { statusCode,body } = await supertest(app).post('/api/user/unbanUser').set("authorization", `Bearer ${adminToken}`).send(unban);
            expect(statusCode).toBe(200);
            expect(body).toBeInstanceOf(Object);
            expect(body).toMatchObject({
                userId:unban.userId,
                reason:unban.reason
            });
        });

        it('Should return a 400 status code', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            const ban = await banListService.create(user.id,'test ban',new Date(Date.now()));
            await banListService.update(ban,'Charges dropped',new Date(Date.now()));
            const unban = {userId:user.id,reason:'Charges dropped'};
            await supertest(app).post('/api/user/unbanUser').set("authorization", `Bearer ${adminToken}`).send(unban).expect(400);
        });

        it('Should return a 400 status code', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            const unban = {userId:user.id,reason:'Charges dropped'};
            await supertest(app).post('/api/user/unbanUser').set("authorization", `Bearer ${adminToken}`).send(unban).expect(400);
        });

        it('Should return a 401 status code', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            const unban = {userId:user.id,reason:'Charges dropped'};
            await supertest(app).post('/api/user/unbanUser').send(unban).expect(401);
        });

        it('Should return a 403 status code for player', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            const unban = {userId:user.id,reason:'Charges dropped'};
            await supertest(app).post('/api/user/unbanUser').set("authorization", `Bearer ${playerToken}`).send(unban).expect(403);
        });

        it('Should return a 403 status code for manager', async()=>{
            const data = dataGenerator.generateUserData();
            const {email,password,login,firstName,secondName} = data;
            const hashPassword = await bcrypt.hash(password,6);
            const user = await userService.create(email,hashPassword,login,firstName,secondName)
            await banListService.create(user.id,'test ban',new Date(Date.now()));
            const unban = {userId:user.id,reason:'Charges dropped'};
            await supertest(app).post('/api/user/unbanUser').set("authorization", `Bearer ${managerToken}`).send(unban).expect(403);
        });
    });
});