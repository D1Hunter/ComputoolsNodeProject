import { Response,Request } from 'express';
import {validationResult} from 'express-validator';

import ApiError from '../exceptions/api-error';
import teamService from './team_service';

class TeamController{
    async create(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json(errors);
            }
            const {teamName} = req.body;
            const checkTeamName = await teamService.getTeamByName(teamName);
            if(checkTeamName){
                throw ApiError.badRequest('Team with the same name already exists')
            }
            const team = await teamService.create(teamName);
            return res.json(team);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Team creation error'});
        }
    }
    async userTeamMembers(req:Request,res:Response){
        try {
            const teamId = req.user.teamId;
            const team = await teamService.getTeamById(teamId);
            if(!team){
                throw ApiError.badRequest('Team not found');
            }
            return res.json(team);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Error getting team'});
        }
    }
    async anotherTeamMembers(req:Request,res:Response){
        try{
            const {teamId} = req.params;
            const team = await teamService.getTeamById(Number(teamId));
            if(!team){
                throw ApiError.badRequest('Team not found');
            }
            return res.json(team);
        }catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Error getting team by id'});
        }
    }
    async allTeamsMembers(req:Request,res:Response){
        try {
            const teams = await teamService.getAllTeams();
            return res.json(teams);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Error getting all teams'});
        }
    }
    async kick(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json(errors);
            }
            const {userId,reason} = req.body;
            const userKick = await teamService.kick(userId,reason);
            return userKick;
        } catch (error) {
            console.log(error);
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            return res.status(500).json({message:'Error kick user from team'});
        }
    }
}

export default new TeamController();