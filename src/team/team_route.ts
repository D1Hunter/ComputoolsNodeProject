import express from "express";
import { check } from 'express-validator';
import { roleMiddleware } from "../middleware/role_middleware";
import { authMiddleware } from "../middleware/auth_middleware";
import { notBannedMiddleware } from "../middleware/not_banned_middleware";
import { RoleType } from "../role/role_type";
import teamController from '../team/team_controller';

export const TeamRouter = express();

//GET
TeamRouter.get('/',[
    authMiddleware,
    notBannedMiddleware
],teamController.userTeamMembers);

TeamRouter.get('/all',[
    authMiddleware
    ,notBannedMiddleware
],teamController.allTeamsMembers);

TeamRouter.get('/:teamId',[
    authMiddleware,
    notBannedMiddleware
],teamController.anotherTeamMembers);

//POST
TeamRouter.post('/',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN]),
    check('teamName','Wrong team name').isString().isLength({min:2,max:30})
],teamController.create);

TeamRouter.post('/kick',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.MANAGER,RoleType.ADMIN]),
    check('userId','Wrong user id').isNumeric(),check('reason','Wrong reason').isString().isLength({min:4,max:60})
],teamController.kick);