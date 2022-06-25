import * as uuid from 'uuid';
import { UserDto } from './user_dto';
import userService from '../user/user_service';
import roleService from '../role/role_service';
import tokenService from '../auth/token_service';
import User from '../user/user_model';
import banlistService from '../ban_list/ban_list_service';

export class DataGenerator{
    private userIndex=0;
    private profileIndex=0;

    generateUserData(){
        ++this.userIndex;
        return{
            email:`${uuid.v4()}@test.com`,
            password:`userTest${this.userIndex}`,
            login:`userTest${this.userIndex}`,
            firstName:'User',
            secondName:'User'
        }
    }

    generateRoleData(){
        return{
            name:`roleTest${uuid.v4().substring(0,4)}`
        }
    }

    generateProfileData(){
        ++this.profileIndex;
        return{
            login:`userNewTest${this.profileIndex}`,
            password:'newPassword'
        }
    }

    generateTeamData(){
        return{
            teamName: `teamTest${uuid.v4().substring(0,10)}`
        }
    }

    createUser = async (userDto:UserDto,role:string)=>{
        const {email,password,login,firstName,secondName} = userDto;
        const userRole = await roleService.getRoleByName(role);
        let user = await userService.create(email,password,login,firstName,secondName);
        user = await roleService.setRoleToUser(userRole,user);
        const userToken = await tokenService.generateToken(user.id,user.email,user.teamId,userRole.name);
        return {userToken,user};
    }

    createBan = async (user:User)=>{
        return await banlistService.create(user.id,'Spam',new Date(Date.now()));
    }
}