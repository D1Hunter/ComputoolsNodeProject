import Team from "../team/team_model";
import TeamRequest from "../team_request/teamrequest_model";
import TeamRequestApprovement from "./team_request_approvement_model";

class TeamRequestApprovementService{
    async create(teamRequestId:number,fromTeamId:number,fromTeamApprove:boolean,toTeamId:number,toTeamApprove:boolean):Promise<TeamRequestApprovement>{
        return TeamRequestApprovement.create({teamRequestId,fromTeamId,fromTeamApprove,toTeamId,toTeamApprove});
    }

    async getByTeamRequestId(teamRequestId:number):Promise<TeamRequestApprovement>{
        return await TeamRequestApprovement.findOne({where:{teamRequestId}});
    }

    async accept(teamRequestApprovement:TeamRequestApprovement,teamRequest:TeamRequest,team:Team):Promise<TeamRequestApprovement>{
        if(teamRequestApprovement.fromTeamId == team.id){
            teamRequestApprovement.fromTeamApprove = true;
            await teamRequestApprovement.save();
            teamRequest.teamId = teamRequestApprovement.toTeamId;
            await teamRequest.save();
            return teamRequestApprovement;
        }
        teamRequestApprovement.toTeamApprove = true;
        await teamRequestApprovement.save();
        teamRequest.teamId = teamRequestApprovement.fromTeamId;
        await teamRequest.save();
        return teamRequestApprovement;
    }
}

export default new TeamRequestApprovementService();