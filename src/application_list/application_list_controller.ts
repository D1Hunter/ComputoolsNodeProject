import { Response,Request } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api-error';
import applicationlistService from './application_list_service';

class ApplicationListController{
    async managerRegister(req:Request,res:Response){
        try {
            const userId = req.user.id;
            const application = await applicationlistService.managerRegister(userId);
            return res.json(application);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"Error send application for manager registration"});
        }
    }

    async getAllApplications(req:Request,res:Response){
        try {
            const applicationList = await applicationlistService.getAll();
            return res.json(applicationList);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Get application list error'});
        }
    }

    async getUserApplication(req:Request,res:Response){
        try {
            const userId = req.user.id;
            const application = await applicationlistService.getByUserId(userId);
            return res.json(application)
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Get user application error'});
        }
    }
    
    async aproveManager(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const {applicationId} = req.body;
            const application = await applicationlistService.aproveManager(applicationId);
            return res.json(application);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.json({message:'Error aprove manager registration application'});
        }
    }

    async declineManager(req:Request,res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const {applicationId} = req.body;
            const application = await applicationlistService.declineManager(applicationId);
            return res.json(application);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.json({message:'Error decline manager registration application'});
        }
    }
}
export default new ApplicationListController();