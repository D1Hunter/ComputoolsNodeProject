import express from "express";
import {check} from 'express-validator';
import {roleMiddleware} from "../middleware/role_middleware";
import {authMiddleware} from "../middleware/auth_middleware";
import { RoleType } from "../role/role_type";
import teamrequestController from "./teamrequest_controller";

export const TeamRequestRouter = express();

//GET
TeamRequestRouter.get('/all',[
    authMiddleware,
    roleMiddleware([RoleType.MANAGER,RoleType.ADMIN])
],teamrequestController.getAll);

TeamRequestRouter.get('/',[
    authMiddleware,
    roleMiddleware([RoleType.PLAYER])
],teamrequestController.getUserTeamRequest);

//POST
TeamRequestRouter.post('/join-team',[
    authMiddleware,
    roleMiddleware([RoleType.PLAYER]),
    check('teamId','Wrong team id').isNumeric()
],teamrequestController.joinTeam);

TeamRequestRouter.post('/leave-team',[
    authMiddleware,
    roleMiddleware([RoleType.PLAYER])
],teamrequestController.leaveTeam);

TeamRequestRouter.post('/move-another-team',[
    authMiddleware,
    roleMiddleware([RoleType.PLAYER]),
    check('teamId','Wrong team id').isNumeric()],
    teamrequestController.moveAnotherTeam);

TeamRequestRouter.post('/accept',[
    authMiddleware,
    roleMiddleware([RoleType.MANAGER,RoleType.ADMIN]),
    check("teamRequestId",'Wrong team request id').isNumeric()
],teamrequestController.acceptRequest);

TeamRequestRouter.post('/decline',[
    authMiddleware,
    roleMiddleware([RoleType.MANAGER,RoleType.ADMIN]),
    check("teamRequestId",'Wrong team request id').isNumeric()
],teamrequestController.declineRequest);