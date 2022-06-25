import {DataTypes,Model} from "sequelize"
import database from "../db/instantiate_sequalize";

interface IApplicationListAtributes{
    id:number;
    userId:number;
    status:string;
}

export default class ApplicationList extends Model<IApplicationListAtributes>{
    declare id:number;
    declare userId:number;
    declare status:string;
}

ApplicationList.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    userId:{type:DataTypes.INTEGER,allowNull:false},
    status:{type:DataTypes.STRING,allowNull:false}
},{
    sequelize:database,
    timestamps: false,
    modelName:'application-list',
    tableName:'application-list'
})