import express from "express";
import { check } from 'express-validator';
import { authMiddleware } from "../middleware/auth_middleware";
import { notBannedMiddleware } from "../middleware/not_banned_middleware";
import { roleMiddleware } from "../middleware/role_middleware";
import { RoleType } from "../role/role_type";
import userController from "./user_controller";

export const UserRouter=express();

//GET
UserRouter.get('/',[
    authMiddleware,
    notBannedMiddleware
],userController.getProfile);

UserRouter.get('/allManagers',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN])
],userController.getAllManagers);

UserRouter.get('/managerById',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN])
],userController.getManagerById);

UserRouter.get('/all',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN])
],userController.getAllUsers);

UserRouter.get('/:userId',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.MANAGER,RoleType.ADMIN])
],userController.getUserById);

//PATCH
UserRouter.patch('/',[
    authMiddleware,
    notBannedMiddleware,
    check('login','login must be longer than 4 and less than 16 characters').optional().isString().isLength({min:4,max:16}),
    check('password','password must be longer than 4 and less than 12 characters').optional().isString().isLength({min:4,max:12}),
],userController.changeProfile);

//POST
UserRouter.post('/banUser',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN]),
    check('userId','Wrong user id').isNumeric(),
    check('reason','Wrong reason').isString().isLength({min:4,max:50})
],userController.banUser);

UserRouter.post('/unbanUser',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN]),
    check('userId','Wrong user id').isNumeric(),
    check('reason','Wrong reason').isString().isLength({min:4,max:50})
],userController.unbanUser);

//DELETE
UserRouter.delete('/:userId',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN])
],userController.delete);