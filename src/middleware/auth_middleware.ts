import TokenService from "../auth/token_service";

export const authMiddleware = function(req:any,res:any,next:any){
    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return res.status(401).json({message:'Auth error'})
        }
        const accessToken=authorizationHeader.split(' ')[1];
        if(!accessToken){
            return res.status(401).json({message: 'Auth error'})
        }
        const userData = TokenService.validataAccessToken(accessToken);
        if(!userData){
            return res.status(401).json({message: 'Auth error'})
        }
        req.user = userData;
        next();
    }
    catch(e){
        return res.status(401).json({message: 'Auth error'})
    }
}