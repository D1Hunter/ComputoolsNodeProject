import {DataTypes,Sequelize} from "sequelize"
import sequelize from "../database/instantiate_sequalize";
const User=sequelize.define('users',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    email:{type:DataTypes.STRING,unique:true},
    password:{type:DataTypes.STRING},
    firstName:{type:DataTypes.STRING},
    secondName:{type:DataTypes.STRING},
    isGoogleAccount:{type:DataTypes.BOOLEAN,defaultValue:false},
    activationLink:{type:DataTypes.STRING},
    createdAt: {type:DataTypes.DATE},
    updatedAt: {type:DataTypes.DATE}
})
module.exports={
    User
}