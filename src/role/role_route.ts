import express from "express";
import { check } from 'express-validator';
import { authMiddleware } from "../middleware/auth_middleware";
import { roleMiddleware } from "../middleware/role_middleware";
import { RoleType } from "./role_type";
import roleController from "./role_controller";

export const RoleRouter = express();

//POST
RoleRouter.post('/create',[
    authMiddleware,
    roleMiddleware([RoleType.ADMIN]),
    check('name','Wrong name').isString().isLength({min:3,max:12})
],roleController.create);

//GET
RoleRouter.get('/all', [
    authMiddleware,
    roleMiddleware([RoleType.ADMIN])
],roleController.getAll)