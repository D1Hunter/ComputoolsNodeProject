import express from "express";
import { check } from 'express-validator';
import { authMiddleware } from "../middleware/auth_middleware";
import { roleMiddleware } from "../middleware/role_middleware";
import { notBannedMiddleware } from "../middleware/not_banned_middleware";
import { RoleType } from "./role_type";
import roleController from "./role_controller";

export const RoleRouter = express();

//POST
RoleRouter.post('/create',[
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN]),
    check('name','Role name must be longer than 3 and less than 12 characters').isString().isLength({min:3,max:12})
],roleController.create);

//GET
RoleRouter.get('/all', [
    authMiddleware,
    notBannedMiddleware,
    roleMiddleware([RoleType.ADMIN])
],roleController.getAll)