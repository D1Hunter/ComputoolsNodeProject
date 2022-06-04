import {DataTypes,Model} from "sequelize"
import database from "../db/instantiate_sequalize";

interface IRoleAtributes{
    id:number;
    name:string;
}

export default class Role extends Model<IRoleAtributes>{
    declare id:number;
    declare name:string;
}

Role.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    name:{type:DataTypes.STRING,unique:true},
},{
    sequelize:database,
    timestamps: false,
    modelName:'roles'
})