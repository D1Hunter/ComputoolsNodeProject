import User from './user_model';
import ApiError from '../exceptions/api-error';
import roleService from '../role/role_service';
import Role from '../role/role_model';
import { RoleType } from '../role/role_type';
import banListService from '../ban_list/ban_list_service';
import fileService from '../profile/file_service';
import BanList from '../ban_list/ban_list_model';

class UserService{
    async getUserById(id:number):Promise<User>{
        return await User.findOne({where:{id},include:[Role],attributes:{exclude:['password','activationLink']}});
    }
    
    async getUserByEmail(email:string):Promise<User>{
        return await User.findOne({where:{email},include:[Role]});
    }

    async getUserByActivationLink(activationLink:string):Promise<User>{
        return await User.findOne({where:{activationLink}})
    }

    async create(email:string,password:string,login:string,firstName:string,secondName:string,isGoogleAccount?:boolean):Promise<User>{
        return await User.create({email,login,password,firstName,secondName,isGoogleAccount});
    }

    async update(user:User,login?:string,password?:string):Promise<void>{
        await user.update({login,password});
    }

    async delete(user:User):Promise<void>{
        await user.destroy();
    }

    async deleteUser(id:number):Promise<string>{
        const user = await this.getUserById(id);
        if(!user){
            throw ApiError.badRequest('User with this id is not exists');
        }
        await this.delete(user);
        return `User with id:${id} was deleted`;
    }

    async getProfile(id:number):Promise<User>{
        const userProfile = await this.getUserById(id);
        if(!userProfile){
            throw ApiError.badRequest('User with this id is not exists');
        }
        return userProfile;
    }

    async changeProfile(id:number,avatar:any,login?:string,password?:string):Promise<User>{
        const userProfile= await this.getUserById(id);
        if(!userProfile){
            throw ApiError.badRequest('User with this id is not exists');
        }
        if(login||password){
            await this.update(userProfile,login,password);
        }
        if(avatar){
            await fileService.uploadAvatar(userProfile,avatar);
        }
        return userProfile;
    }

    async getAllUsers():Promise<User[]>{
        return await User.findAll({include:[Role], attributes: { exclude: ['password'] }});
    }

    async getManagers():Promise<User[]>{
        const role = await roleService.getRoleByName(RoleType.MANAGER);
        const managers = await User.findAll({where:{roleId:role.id},include:[Role],attributes: { exclude: ['password'] }});
        return managers;
    }

    async getManagerById(id:number):Promise<User>{
        const role = await roleService.getRoleByName(RoleType.MANAGER);
        const manager = await User.findOne({where:{id},include:[Role],attributes: { exclude: ['password'] }});
        if(!manager){
            throw ApiError.badRequest('User with this id is not exist');
        }
        if(manager.roleId!=role.id){
            throw ApiError.badRequest('User is not a manager')
        }
        return manager;
    }

    async userIsAdmin(id:number):Promise<boolean>{
        const role = await roleService.getRoleByName(RoleType.ADMIN);
        const admin = await this.getUserById(id);
        if(!admin){
            throw ApiError.badRequest('User with this id is not exist');
        }
        if(admin.roleId==role.id){
            return true;
        }
        return false;
    }

    async banUser(userId:number,reason:string):Promise<BanList>{
        const user = await this.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User with this id is not exist');
        }
        let ban = await banListService.getByUser(user.id);
        if(ban){
            if(ban.unbanDate){
                await ban.destroy();
            }
            else if(ban.banDate){
                throw ApiError.badRequest('User already banned');
            }
        }
        ban = await banListService.create(userId,reason,new Date(Date.now()));
        return ban;
    }
    async unbanUser(userId:number,reason:string):Promise<BanList>{
        const user = await this.getUserById(userId);
        if(!user){
            throw ApiError.badRequest('User with this id is not exist');
        }
        let userBan = await banListService.getByUser(userId);
        if(!userBan){
            throw ApiError.badRequest('This user is not banned');
        }
        if(userBan.unbanDate){
            throw ApiError.badRequest('User already unbanned');
        }
        userBan = await banListService.update(userBan,reason,null,new Date(Date.now()));
        return userBan; 
    }
}

export default new UserService();