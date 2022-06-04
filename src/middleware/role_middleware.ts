import { Request,Response,NextFunction } from "express";

export const roleMiddleware = (roles:any[])=>{
    return async (req:Request, res:Response, next:NextFunction) => {
        try {
            const user=req.user as Express.User;
            if(roles.includes(user.role)){
                return next();
            }
            return res.status(403).json({ message: "You do not have access" })
        }
        catch (error) {
            console.log(error);
            return res.status(403).json({ message: "User not authorized" })
        }
    }
}