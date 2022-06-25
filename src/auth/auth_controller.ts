import { Response,Request } from 'express';
import { validationResult } from 'express-validator';
import authService from './auth_service';
import ApiError from '../exceptions/api-error';

class AuthController{
    async registration(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const {email,password,login,firstName,secondName} = req.body;
            const token = await authService.registration(email,password,login,firstName,secondName);
            return res.json({token});
        }
        catch(error){
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Registration error'});
        }
    }

    async login(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const {email,password} = req.body;
            const token = await authService.login(email,password);
            return res.json({token});
        }
        catch(error){
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Authorization error'})
        }
    }

    async forgotPass(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors});
            }
            const {email} = req.body;
            const message = await authService.forgotPass(email);
            return res.json({message});
        }
        catch(error){
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Forgot password error'});
        }
    }

    async resetPass(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const activationLink=req.params.link;
            const {password} = req.body;
            const message = await authService.resetPass(activationLink,password);
            return res.json({message});
        }
        catch(error){
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Reset password error'});
        }
    }

    async successGoogleAuth(req:Request,res:Response){
        try {
            const user=req.user;
            const token = await authService.googleAuth(user.email,user.name.givenName+" "+user.name.familyName,user.name.givenName,user.name.familyName);
            return res.json({token});
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:'Google auth error'});
        }
    }

    async failureGoogleAuth(req:Request,res:Response){
        return ApiError.internal('Failed to authenticate');
    }
    
    async logoutGoogle(req:Request,res:Response){
        req.session.destroy(()=>{});
        return res.json({message: 'Logged out from Google Account'})
    }
}

export default new AuthController();