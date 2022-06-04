import {DataTypes,Model} from "sequelize"
import database from "../db/instantiate_sequalize";
import ApplicationList from "../application_list/application_list_model";
import Role from "../role/role_model";
import Team from "../team/team_model";
import TeamRequest from "../team_request/teamrequest_model";
import BanList from "../ban_list/ban_list_model";
import TeamUserKick from "../team_user_kick/team_user_kick_model";

interface IUserAtributes{
    id:number;
    email:string;
    login:string;
    password:string;
    avatar:string;
    firstName:string;
    secondName:string;
    isGoogleAccount:boolean;
    activationLink:string;
    roleId:number;
    teamId:number;
}

export default class User extends Model<IUserAtributes>{
    declare id:number;
    declare email:string;
    declare login:string;
    declare password:string;
    declare avatar:string;
    declare firstName:string;
    declare secondName:string;
    declare isGoogleAccount:boolean;
    declare activationLink:string;
    declare roleId:number;
    declare teamId:number;
}

User.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    email:{type:DataTypes.STRING,unique:true},
    login:{type:DataTypes.STRING,allowNull:false},
    password:{type:DataTypes.STRING},
    avatar:{type:DataTypes.STRING},
    firstName:{type:DataTypes.STRING},
    secondName:{type:DataTypes.STRING},
    isGoogleAccount:{type:DataTypes.BOOLEAN,defaultValue:false},
    activationLink:{type:DataTypes.STRING},
    roleId:{type:DataTypes.INTEGER,defaultValue:1,allowNull:false},
    teamId:{type:DataTypes.INTEGER}
},{
    sequelize:database,
    timestamps: false,
    modelName:'users'
})

Role.hasMany(User);
User.belongsTo(Role);

Team.hasMany(User);
User.belongsTo(Team);

User.hasOne(ApplicationList);
ApplicationList.belongsTo(User);

User.hasOne(TeamRequest);
TeamRequest.belongsTo(User);

User.hasOne(BanList);
BanList.belongsTo(User);

Team.hasMany(TeamUserKick);
TeamUserKick.belongsTo(Team);

User.hasOne(TeamUserKick);
TeamUserKick.belongsTo(User);

declare global {
    namespace Express {
        export interface User {
            id: number;
            email: string;
            login: string;
            name:{
                givenName: string,
                familyName: string
            };
            role:string;
            banDate:Date;
            unbanDate:Date;
            roleId:number;
            teamId:number;
        }
    }
}