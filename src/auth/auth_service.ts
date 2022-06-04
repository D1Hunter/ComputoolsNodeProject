import bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import User from '../user/user_model';
import ApiError from "../exceptions/api-error";
import userService from '../user/user_service';
import tokenService from './token_service';
import roleService from '../role/role_service';
import mailService from '../mail/mail_service';

class AuthService{
    async registration(email:string,password:string,login:string,firstName:string,secondName:string):Promise<string>{
        const checkUser = await userService.getUserByEmail(email);
        if(checkUser){
            throw ApiError.badRequest('User with this email already exists');
        }
        const hashPassword= await this.hashPassword(password);
        const user = await userService.create(email,hashPassword,login,firstName,secondName);
        const role = await roleService.getRoleById(user.roleId);
        const token = await tokenService.generateToken({id:user.id,email:user.email,teamId:user.teamId,role:role.name});
        return token;
    }

    async login(email:string,password:string):Promise<string>{
        const user = await userService.getUserByEmail(email);
        if(!user){
            throw ApiError.badRequest('User with this email not exists');
        }
        const validPassword = await this.validatePassword(password,user.password);
        if(!validPassword){
            throw ApiError.badRequest('Wrong password entered');
        }
        const role = await roleService.getRoleById(user.roleId);
        const token = await tokenService.generateToken({id:user.id,email:user.email,teamId:user.teamId,role:role.name});
        return token;
    }

    async forgotPass(email:string):Promise<string>{
        const user = await userService.getUserByEmail(email);
        if(!user){
            throw ApiError.badRequest('User with this email not exists');
        }
        const activationLink=uuid.v4();
        user.activationLink=activationLink;
        await user.save();
        await mailService.sendActivationMail(user.email,`${process.env.API_URL}/api/auth/reset-pass/${activationLink}`);
        return `A link to reset your password has been sent to your email ${email}`;
    }

    async resetPass(activationLink:string,password:string):Promise<string>{
        const user = await userService.getUserByActivationLink(activationLink);
        if(!user){
            throw ApiError.badRequest('Wrong link'); 
        }
        user.activationLink=null;
        await user.save();
        const validPassword = await this.validatePassword(password,user.password);
        if(validPassword){
            throw ApiError.badRequest('This password is already in use');
        }
        const hashPassword = await this.hashPassword(password);
        user.password = hashPassword;
        await user.save();
        return 'New password set';
    }

    async googleAuth(email:string,login:string,firstName:string,secondName:string):Promise<string>{
        let user = await userService.getUserByEmail(email);
        if(!user){
            user = await userService.create(email,null,login,firstName,secondName,true);
        }
        else if(!user.isGoogleAccount){
            throw ApiError.badRequest('User with this email already exists');
        }
        const role = await roleService.getRoleById(user.roleId)
        const token = await tokenService.generateToken({id:user.id,email:user.email,teamId:user.teamId,role:role.name});
        return token;
    }
    
    async hashPassword(password:string):Promise<string>{
        return await bcrypt.hash(password,6);
    }

    async validatePassword(password:string,userPassword:string):Promise<boolean>{
        return await bcrypt.compare(password,userPassword);
    }
}

export default new AuthService();