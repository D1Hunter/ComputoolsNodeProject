import TeamUserKick from "./team_user_kick_model";

class TeamUserKickService{
    async create(userId:number,teamId:number,reason:string):Promise<TeamUserKick>{
        return await TeamUserKick.create({userId,teamId,reason});
    }
}

export default new TeamUserKickService();