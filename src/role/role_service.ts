import Role from "./role_model";
import User from "../user/user_model";

class RoleService{
    async create(name:string):Promise<Role>{
        return await Role.create({name});
    }

    async getRoleById(id:number):Promise<Role>{
        return await Role.findOne({where:{id}});
    }

    async getRoleByName(name:string):Promise<Role>{
        return await Role.findOne({where:{name}});
    }

    async getAllRoles():Promise<Role[]>{
        return await Role.findAll();
    }
   
    async checkRole(roleName:string,userId:number):Promise<boolean>{
        const user = await User.findOne({where:{id:userId}});
        const userRole = await Role.findOne({where:{id:user.roleId}});
        if(roleName===userRole.name){
            return true;
        }
        return false;
    }

    async setRoleToUser(role:Role,user:User):Promise<User>{
        user.roleId = role.id;
        await user.save();
        return user;
    }
}

export default new RoleService();