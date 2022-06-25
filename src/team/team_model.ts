import {DataTypes,Model} from "sequelize"
import TeamUserKick from "../team_user_kick/team_user_kick_model";
import database from "../db/instantiate_sequalize";

interface ITeamAtributes{
    id:number;
    teamName:string;
}

export default class Team extends Model<ITeamAtributes>{
    declare id:number;
    declare teamName:string;
}

Team.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    teamName:{type:DataTypes.STRING,unique:true},
},{
    sequelize:database,
    timestamps: false,
    modelName:'teams'
})

Team.hasMany(TeamUserKick);
TeamUserKick.belongsTo(Team);