import {DataTypes,Model} from "sequelize"
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