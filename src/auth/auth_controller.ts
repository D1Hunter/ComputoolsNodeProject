import { Response,Request } from 'express';
import {validationResult} from 'express-validator';
import mailService from '../service/mail_service';
import * as uuid from 'uuid';
import GoogleUserDto  from '../dto/GoogleUserDto';
import UserDto from '../dto/UserDto';
import TokenService from '../service/token_service';
const {User} = require('../models/users');
const bcrypt = require('bcryptjs');

class authController{
    async registration(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message: "Registration error", errors})
            }
            const {email,password,firstName,secondName} = req.body;
            const user=await User.findOne({where:{email}});
            if(user){
                return res.status(400).json({message: "User with this email already exists"})
            }
            const hashPassword=await bcrypt.hash(password,6);
            const userData=await User.create({email,password:hashPassword,firstName,secondName,isGoogleAccount:false});
            userData as UserDto;
            const tokens = TokenService.generateTokens({id:userData.id,email:userData.email});
            return res.json({userData,tokens});
        }
        catch(e){
            console.log(e);
        }
    }

    async login(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Authorization error", errors})
            }
            const {email,password}=req.body;
            const user = await User.findOne({where:{email}});
            if(!user){
                return res.status(400).json({message:`User ${email} is not found`})
            }
            const validPassword=bcrypt.compareSync(password,user.password);
            if(!validPassword){
                return res.status(400).json({message:"Wrong password entered"})
            }
            user as UserDto;
            const tokens = TokenService.generateTokens({id:user.id,email:user.email});
            return res.json({tokens});
        }
        catch(e){
            console.log(e);
        }
    }

    async forgotPass(req:Request,res:Response){
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors});
            }
            const {email}=req.body;
            const user = await User.findOne({where:{email}});
            if(!user){
                return res.status(400).json({message:`User ${email} is not found`})
            }
            const ActivationLink=uuid.v4();
            user.activationLink=ActivationLink;
            await user.save();
            mailService.sendActivationMail(email,`${process.env.API_URL}/auth/reset-pass/${ActivationLink}`);
            return res.json({message:`A link to reset your password has been sent to your email ${email}`});
        }
        catch(e){
            console.log(e);
        }
    }

    async resetPass(req:Request,res:Response){
        try{
            const activationLink=req.params.link;
            const user = await User.findOne({where:{activationLink}});
            const {password} = req.body;
            const validPassword=bcrypt.compareSync(password,user.password);
            if(validPassword){
                return res.json({message:'This password is already in use'})
            }
            const hashPassword = bcrypt.hashSync(password,8);
            user.password=hashPassword;
            await user.save();
            return res.json({message:"New password set"});
        }
        catch(e){
            console.log(e);
        }
    }
    async getUsers(req:Request,res:Response) {
        try {
            const users = await User.findAll();
            return res.json(users);
        } catch (e) {
            console.log(e);
        }
    }

    async successGoogleAuth(req:Request,res:Response){
        try {
            const userDto=req.user as GoogleUserDto;
            let user = await User.findOne({where:{email:userDto.email}});
            if(!user){
                user = await User.create({email:user.email,firstName:user.given_name,secondName:user.family_name,isGoogleAccount:true})
            }
            else{
                const isGoogleAccount=user.isGoogleAccount;
                if(!isGoogleAccount){
                    return res.status(400).json({message:'This email is already in use'});
                }
            }
            const tokens = TokenService.generateTokens({id:user.id,email:user.email});
            return res.json(tokens);
        } catch (e) {
            console.log(e);
        }
    }
}
export default new authController();