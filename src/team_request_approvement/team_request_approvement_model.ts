import {DataTypes,Model} from "sequelize"
import database from "../db/instantiate_sequalize";

interface ITeamRequestApprovement{
    id:number;
    teamRequestId:number;
    fromTeamId:number;
    fromTeamApprove:boolean;
    toTeamId:number;
    toTeamApprove: boolean;
}

export default class TeamRequestApprovement extends Model<ITeamRequestApprovement>{
    declare id:number;
    declare teamRequestId:number;
    declare fromTeamId:number;
    declare fromTeamApprove:boolean;
    declare toTeamId:number;
    declare toTeamApprove:boolean;
}

TeamRequestApprovement.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    teamRequestId:{type:DataTypes.INTEGER,allowNull:false},
    fromTeamId:{type:DataTypes.INTEGER,allowNull:false},
    fromTeamApprove:{type:DataTypes.BOOLEAN,allowNull:false},
    toTeamId:{type:DataTypes.INTEGER,allowNull:false},
    toTeamApprove:{type:DataTypes.BOOLEAN,allowNull:false}
},{
    sequelize:database,
    timestamps: false,
    modelName:'team-request-approvements',
    tableName:'team-request-approvements'
})