import express from "express";
import { check } from 'express-validator';
import { authMiddleware } from "../middleware/auth_middleware";
import { notBannedMiddleware } from "../middleware/not_banned_middleware";
import { roleMiddleware } from "../middleware/role_middleware";
import { RoleType } from "../role/role_type";
import applicationListController from "./application_list_controller";

export const ApplicationListRouter = express();


//GET
ApplicationListRouter.get('/all',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN])
],applicationListController.getAllApplications);

ApplicationListRouter.get('/',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.PLAYER])
],applicationListController.getUserApplication);


//POST
ApplicationListRouter.post('/manager-register',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.PLAYER])
],applicationListController.managerRegister);

ApplicationListRouter.post('/aprove-manager',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN]),
    check('applicationId','Wrong application id').isNumeric()
],applicationListController.aproveManager);

ApplicationListRouter.post('/decline-manager',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN]),
    check('applicationId','Wrong application id').isNumeric()
],applicationListController.declineManager);