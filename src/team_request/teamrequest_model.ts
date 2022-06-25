import {DataTypes,Model} from "sequelize"
import TeamRequestApprovement from "../team_request_approvement/team_request_approvement_model";
import database from "../db/instantiate_sequalize";

interface ITeamRequestAtributes{
    id:number;
    requestType:string;
    userId:number;
    teamId:number;
    status:string;
}

export default class TeamRequest extends Model<ITeamRequestAtributes>{
    declare id:number;
    declare requestType:string;
    declare userId:number;
    declare teamId:number;
    declare status:string;
}

TeamRequest.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    requestType:{type:DataTypes.STRING,allowNull:false},
    userId:{type:DataTypes.INTEGER,allowNull:false},
    teamId:{type:DataTypes.INTEGER,allowNull:false},
    status:{type:DataTypes.STRING,allowNull:false},
},{
    sequelize:database,
    timestamps: false,
    modelName:'team-requests'
})

TeamRequest.hasOne(TeamRequestApprovement);
TeamRequestApprovement.belongsTo(TeamRequest);