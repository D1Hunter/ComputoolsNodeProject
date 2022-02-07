import {Model,Sequelize,DataTypes,Optional} from "sequelize"
const sequelize = new Sequelize("");
interface IUserCreation extends Optional<IUser, "id"> {}

interface IUser{
    id?:number
    email:string
    password:string
    firstName:string
    lastName:string
}

export default class User extends Model<IUser,IUserCreation>{}
    User.init({
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true,
        },
        email:{
            type:DataTypes.STRING,
            allowNull: false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull:false
        },
    },{
        sequelize,
        tableName:"Users",
    })
