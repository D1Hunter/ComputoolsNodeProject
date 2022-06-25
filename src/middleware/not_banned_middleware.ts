import { Request,Response,NextFunction } from "express";
import banlistService from "../ban_list/ban_list_service";

export const notBannedMiddleware = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        if(req.method==='OPTIONS'){
            return next();
        }
        const user = req.user as Express.User;
        if(!user){
            return res.status(401).json({message: 'User not authorized'});
        }
        const userBans = await banlistService.getByUser(user.id);
        const userBan = userBans[userBans.length-1];
        if(userBan){
            if(!userBan.unbanDate){
                return res.status(400).json({ message: `You are banned for a reason:${userBan.reason}`});
            }
        }
        return next();
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ message: "User not authorized" })
    }
}