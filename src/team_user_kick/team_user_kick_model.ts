import {DataTypes,Model} from "sequelize"
import database from "../db/instantiate_sequalize";

interface ITeamUserKickAtributes{
    id:number;
    userId:number;
    teamId:number;
    reason:string;
}

export default class TeamUserKick extends Model<ITeamUserKickAtributes>{
    declare id:number;
    declare userId:number;
    declare teamId:number;
    declare reason:string;
}

TeamUserKick.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    userId:{type:DataTypes.INTEGER},
    teamId:{type:DataTypes.INTEGER},
    reason:{type:DataTypes.STRING,allowNull:false}
},{
    sequelize:database,
    timestamps: false,
    modelName:'team-user-kicks'
})