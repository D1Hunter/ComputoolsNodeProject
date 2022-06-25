import express from "express";
import { ApplicationListRouter } from "./application_list/application_list_route";
import { AuthRouter } from "./auth/auth_route";
import { RoleRouter } from "./role/role_route";
import { TeamRouter } from "./team/team_route";
import { TeamRequestRouter } from "./team_request/teamrequest_route";
import { UserRouter } from "./user/user_route";

export const Router = express();

Router.use('/auth',AuthRouter);
Router.use('/user',UserRouter)
Router.use('/role',RoleRouter);
Router.use('/team',TeamRouter);
Router.use('/team-request',TeamRequestRouter);
Router.use('/application-list',ApplicationListRouter);