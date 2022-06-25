import { Response,Request } from 'express';
import {validationResult} from 'express-validator';

import ApiError from '../exceptions/api-error';
import userService from '../user/user_service';
import teamrequestService from './teamrequest_service';

class TeamRequestController{
    async getAll(req:Request,res:Response){
        try {
            const teamRequests = await teamrequestService.getAllTeamRequests();
            return res.json(teamRequests);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error getting all team requests'});
        }
    }

    async getUserTeamRequest(req:Request,res:Response){
        try {
            const userId = req.user.id;
            const teamRequest = await teamrequestService.getTeamRequestByUser(userId);
            return res.json(teamRequest);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error getting user team request'});
        }
    }

    async joinTeam(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const userId = req.user.id;
            const {teamId} = req.body;
            const teamRequest = await teamrequestService.joinTeam(userId,teamId);
            return res.json(teamRequest);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error creating join team request'});
        }
    }

    async leaveTeam(req:Request,res:Response){
        try {
            const userId = req.user.id;
            const teamRequest = await teamrequestService.leaveTeam(userId);
            return res.json(teamRequest);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error creating leave team request'});
        }
    }

    async moveAnotherTeam(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const userId = req.user.id;
            const { teamId } = req.body;
            const queue = await teamrequestService.moveAnotherTeam(userId,teamId);
            return res.json(queue);
        }catch (error){
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error creating move team request'});
        }
    }
    
    async deleteRequest(req:Request,res:Response){
        try{
            const userId = req.user.id;
            const message = await teamrequestService.deleteRequest(userId);
            return res.json({message});
        }catch (error){
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error deleting request'});
        }
    }

    async acceptRequest(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const userId = req.user.id;
            const {teamRequestId} = req.body;
            const teamRequest = await teamrequestService.acceptRequest(userId,teamRequestId);
            return res.json(teamRequest);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error acepting team request'});
        }
    }

    async declineRequest(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const userId = req.user.id;
            const {teamRequestId} = req.body;
            const teamRequest = await teamrequestService.declineRequest(userId,teamRequestId);
            return res.json(teamRequest);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message: 'Error declining team request'});
        }
    }
}
export default new TeamRequestController();