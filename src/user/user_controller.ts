import { Response,Request } from 'express';
import {validationResult} from 'express-validator';
import ApiError from '../exceptions/api-error';
import userService from './user_service';

class userController{
    async getProfile(req:Request,res:Response){
        try {
            const userId = req.user.id;
            const userProfile = await userService.getProfile(userId);
            return res.json(userProfile)
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"Profile getting error"});
        }
    }
    
    async changeProfile(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const userId = req.user.id;
            const {login,password} = req.body;
            const avatar = req.files?.avatar;
            const user = await userService.changeProfile(userId,avatar,login,password);
            return res.json(user);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"Profile changing error"});
        }
    }

    async getAllManagers(req:Request,res:Response){
        try {
            const managers = await userService.getManagers();
            return res.json(managers);
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Managers getting error"});
        }
    }

    async getManagerById(req:Request,res:Response){
        try {
            const{id} = req.query;
            const manager = await userService.getManagerById(Number(id));
            return res.json(manager);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"Manager getting error"});
        }
    }

    async getAllUsers(req:Request,res:Response){
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Users getting error"});
        }
    }

    async getUserById(req:Request,res:Response){
        try {
            const{userId} = req.params;
            const user = await userService.getUserById(Number(userId));
            if(!user){
                throw ApiError.badRequest('User not found');
            }
            return res.json(user);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"User getting error"});
        }
    }

    async banUser(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const{userId,reason} = req.body;
            const ban = await userService.banUser(userId,reason);
            return res.json(ban);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"User ban error"});
        }
    }

    async unbanUser(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const{userId,reason} = req.body;
            const unban = await userService.unbanUser(userId,reason);
            return res.json(unban);   
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"User unban error"});
        }
    }

    async delete(req:Request,res:Response){
        try {
            const{userId} = req.params;
            const message = await userService.deleteUser(Number(userId));
            return res.json(message);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"User deleting error"});
        }
    }
}

export default new userController();