import {DataTypes,Model} from "sequelize"
import database from "../db/instantiate_sequalize";

interface IBanListAtributes{
    id:number;
    userId:number;
    reason:string;
    banDate:Date;
    unbanDate:Date;
}

export default class BanList extends Model<IBanListAtributes>{
    declare id:number;
    declare userId:number;
    declare reason:string;
    declare banDate:Date;
    declare unbanDate:Date;
}

BanList.init({
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    userId:{type:DataTypes.INTEGER,allowNull:false},
    reason:{type:DataTypes.STRING,allowNull:false},
    banDate:{type:DataTypes.DATE,allowNull:false},
    unbanDate:{type:DataTypes.DATE}
},{
    sequelize:database,
    timestamps: false,
    modelName:'ban-list',
    tableName:'ban-list'
})
