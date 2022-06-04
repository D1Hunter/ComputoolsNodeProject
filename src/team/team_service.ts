import TeamRequest from "../team_request/teamrequest_model";
import ApiError from "../exceptions/api-error";
import Team from "./team_model";
import User from "../user/user_model";
import userService from "../user/user_service";
import teamUserKickService from "../team_user_kick/team_user_kick_service"
import TeamUserKick from "../team_user_kick/team_user_kick_model";
TeamRequest
class TeamService{
    async create(teamName:string):Promise<Team>{
        return await Team.create({teamName});
    }

    async getTeamByName(teamName:string):Promise<Team>{
        return await Team.findOne({where:{teamName}});
    }

    async getTeamById(teamId:number):Promise<Team>{
        return await Team.findOne({where:{id:teamId},include:[{model:User}]});
    }

    async getAllTeams():Promise<Team[]>{
        return await Team.findAll({include:[{model:User}]});
    }

    async kick(userId:number,reason:string):Promise<TeamUserKick>{
        const user = await userService.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User with this id is not exist');
        }
        const team = await this.getTeamById(user.teamId);
        if(!team){
            throw ApiError.badRequest('The user is not a member of the team');
        }
        const teamUserKick = await teamUserKickService.create(user.id,team.id,reason);
        user.teamId=null;
        await user.save();
        return teamUserKick;
    }
    
    checkUserOnTeam(user:User,team:Team):boolean{
        if(user.teamId&&user.teamId===team.id){
            return true;
        }
        return false;
    }
}

export default new TeamService();