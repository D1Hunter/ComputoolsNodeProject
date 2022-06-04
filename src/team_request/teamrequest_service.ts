import userService from "../user/user_service";
import User from "../user/user_model";
import Team from "../team/team_model";
import TeamRequest from "./teamrequest_model";
import ApiError from "../exceptions/api-error";
import teamService from "../team/team_service";
import {TeamRequestTypes,TeamRequestStatusTypes} from './team_request_type';

class TeamRequestService{
    async getTeamRequestById(id:number):Promise<TeamRequest>{
        return await TeamRequest.findOne({where:{id}});
    }

    async getTeamRequestByUser(userId:number):Promise<TeamRequest>{
        return await TeamRequest.findOne({where:{userId}});
    }

    async getAllTeamRequests():Promise<TeamRequest[]>{
        return await TeamRequest.findAll();
    }

    async create(userId:number,teamId:number,requestType:string,status:string):Promise<TeamRequest>{
        return await TeamRequest.create({requestType,userId,teamId,status});
    }

    async delete(teamRequest:TeamRequest):Promise<void>{
        await teamRequest.destroy();
    }

    async update(teamRequest:TeamRequest,requestType:string,status:string,teamId?:number):Promise<void>{
        await teamRequest.update({teamId,requestType,status});
    }

    async joinTeam(userId:number,teamId:number):Promise<TeamRequest>{
        const user = await userService.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User with this Id not exist');
        }
        const team = await teamService.getTeamById(teamId);
        if(!team){
            throw ApiError.badRequest('Team with this Id not exist');
        }
        const checkUserInTeam = await teamService.checkUserOnTeam(user,team);
        if(checkUserInTeam){
            throw ApiError.badRequest('User is already exist in team');
        }
        const checkUserInQueue = await this.getTeamRequestByUser(user.id);
        if(checkUserInQueue&&checkUserInQueue.status!=TeamRequestStatusTypes.ACCEPTED){
            throw ApiError.badRequest('User is already exist in queue');
        }
        if(checkUserInQueue){
            await this.delete(checkUserInQueue);
        }
        const teamRequest = await this.create(userId,teamId,TeamRequestTypes.JOIN_TEAM,TeamRequestStatusTypes.PENDING)
        return teamRequest;
    }

    async leaveTeam(userId:number):Promise<TeamRequest>{
        const user = await userService.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User with this Id not exist');
        }
        if(!user.teamId){
            throw ApiError.badRequest('User not exist in team');
        }
        const team = await teamService.getTeamById(user.teamId);
        if(!team){
            throw ApiError.badRequest('Team with this Id not exist');
        }
        const checkUserInTeam = await teamService.checkUserOnTeam(user,team);
        if(!checkUserInTeam){
            throw ApiError.badRequest('User with this Id not exist in this team');
        }
        const userInQueue = await this.getTeamRequestByUser(user.id);
        if(userInQueue&&userInQueue.status!=TeamRequestStatusTypes.ACCEPTED){
            throw ApiError.badRequest('User is already exist in queue');
        }
        if(userInQueue){
            await this.delete(userInQueue);
        }
        const teamRequest = await this.create(user.id,user.teamId,TeamRequestTypes.LEAVE_TEAM,TeamRequestStatusTypes.PENDING);
        return teamRequest;
    }

    async moveAnotherTeam(userId:number,teamId:number):Promise<TeamRequest>{
        const user = await userService.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User with this Id not exist');
        }
        if(!user.teamId){
            throw ApiError.badRequest('User not exist in team');
        }
        const team = await teamService.getTeamById(user.teamId);
        if(!team){
            throw ApiError.badRequest('Team with this Id not exist');
        }
        const checkUserInTeam = await teamService.checkUserOnTeam(user,team);
        if(!checkUserInTeam){
            throw ApiError.badRequest('User with this Id not exist in this team');
        }
        let userInQueue = await this.getTeamRequestByUser(userId);
        if(userInQueue&&userInQueue.status!=TeamRequestStatusTypes.ACCEPTED){
            throw ApiError.badRequest('User is already in the queue');
        }
        if(userInQueue){
            await this.delete(userInQueue);
        }
        const teamRequest = await this.create(userId,teamId,TeamRequestTypes.MOVE_ANOTHER_TEAM,TeamRequestStatusTypes.PENDING);
        return teamRequest;
    }

    async acceptRequest(userId:number,teamRequestId:number):Promise<TeamRequest>{
        const teamRequest = await this.getTeamRequestById(teamRequestId);
        if(!teamRequest){
            throw ApiError.badRequest('Request with this Id not exist');
        }
        const user = await userService.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User not found');
        }
        const team = await teamService.getTeamById(teamRequest.teamId);
        if(!team){
            throw ApiError.badRequest('Team not found');
        }
        const userIsAdmin = await userService.userIsAdmin(user.id);
        if(!userIsAdmin){
            const checkUserInTeam = await teamService.checkUserOnTeam(user,team);
            if(!checkUserInTeam){
                throw ApiError.badRequest('The user is not an admin and cannot accept applications for another team');
            }
        }
        if(teamRequest.status==TeamRequestStatusTypes.ACCEPTED){
            throw ApiError.badRequest('Request already completed');
        }
        const requestUser = await userService.getUserById(teamRequest.userId);
        this.executeRequest(teamRequest,requestUser);
        await teamRequest.save();
        return teamRequest;
    }

    async executeRequest(teamRequest:TeamRequest,user:User):Promise<void>{
        if(teamRequest.status!=TeamRequestStatusTypes.PENDING){
            return;
        }
        switch(teamRequest.requestType){
            case TeamRequestTypes.JOIN_TEAM:
                user.teamId=teamRequest.teamId;
                user.save();
                teamRequest.status=TeamRequestStatusTypes.ACCEPTED;
                return;
            case TeamRequestTypes.LEAVE_TEAM:
                user.teamId=null;
                user.save();
                teamRequest.status=TeamRequestStatusTypes.ACCEPTED;
                return;
            case TeamRequestTypes.MOVE_ANOTHER_TEAM:
                user.teamId=teamRequest.teamId;
                user.save();
                teamRequest.status=TeamRequestStatusTypes.ACCEPTED;
                return;
            default:
                return;
        }
    }
    
    async declineRequest(userId:number,teamRequestId:number):Promise<TeamRequest>{
        const teamRequest = await this.getTeamRequestById(teamRequestId);
        if(!teamRequest){
            throw ApiError.badRequest('Request with this Id not exist');
        }
        const user = await userService.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User not found');
        }
        const team = await teamService.getTeamById(teamRequest.teamId);
        if(!team){
            throw ApiError.badRequest('Team not found');
        }
        const userIsAdmin = await userService.userIsAdmin(user.id);
        if(!userIsAdmin){
            const checkUserInTeam = await teamService.checkUserOnTeam(user,team);
            if(!checkUserInTeam){
                throw ApiError.badRequest('The user is not an admin and cannot decline applications for another team');
            }
        }
        if(teamRequest.status==TeamRequestStatusTypes.ACCEPTED){
            throw ApiError.badRequest('Request already completed');
        }
        teamRequest.status = TeamRequestStatusTypes.DECLINED;
        await teamRequest.save();
        return teamRequest;
    }
}
export default new TeamRequestService();