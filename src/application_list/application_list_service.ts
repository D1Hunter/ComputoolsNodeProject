import userService from "../user/user_service";
import ApiError from "../exceptions/api-error";
import ApplicationList from "./application_list_model";
import User from "../user/user_model";
import roleService from "../role/role_service";
import { RoleType } from "../role/role_type";
import { ApplicationListStatusTypes } from "./application_list_type";

class ApplicationListService{
    async create(userId:number,status:string):Promise<void>{
        await ApplicationList.create({userId,status});
    }
    async update(applicationList:ApplicationList,status:string):Promise<void>{
        await applicationList.update({status});
    }

    async getById(id:number):Promise<ApplicationList>{
        return await ApplicationList.findOne({where:{id}});
    }

    async getByUserId(userId:number):Promise<ApplicationList>{
        return await ApplicationList.findOne({where:{userId}});
    }

    async getAll():Promise<ApplicationList[]>{
        return await ApplicationList.findAll({include:[{model:User}],attributes:{exclude:['password','activationLink']}});
    }

    async managerRegister(userId:number):Promise<ApplicationList>{
        const user = await userService.getUserById(userId)
        if(!user){
            throw ApiError.badRequest('User is not found');
        }
        if(!user.teamId){
            throw ApiError.badRequest('User must be in a team');
        }
        const application = await this.getByUserId(userId);
        if(application&&application.status!=ApplicationListStatusTypes.ACCEPTED){
            throw ApiError.badRequest('The user has already applied');
        }
        if(application){
            await application.destroy();
        }
        await this.create(userId,ApplicationListStatusTypes.PENDING);
        return application;
    }

    async aproveManager(applicationId:number):Promise<ApplicationList>{
        const application = await this.getById(applicationId);
        if(!application){
            throw ApiError.badRequest('User aprove is not found');
        }
        const user = await userService.getUserById(application.userId);
        const role = await roleService.getRoleByName(RoleType.MANAGER);
        user.roleId=role.id;
        await this.update(application,ApplicationListStatusTypes.ACCEPTED);
        await user.save();
        return application;
    }

    async declineManager(applicationId:number):Promise<ApplicationList>{
        const application = await this.getById(applicationId);
        if(!application){
            throw ApiError.badRequest('User aprove is not found');
        }
        const user = await userService.getUserById(application.userId);
        await this.update(application,ApplicationListStatusTypes.DECLINED);
        return application;
    }
}
export default new ApplicationListService();