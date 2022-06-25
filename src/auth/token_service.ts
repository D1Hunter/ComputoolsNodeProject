import jwt from 'jsonwebtoken';

const accessSecret=process.env.JWT_ACCESS_SECRET||"secretAccess";

class TokenService{
    async generateToken(id:number,email:string,teamId:number,role:string):Promise<string>{
        const payload ={
            id,
            email,
            teamId,
            role
        }
        return await jwt.sign(payload,accessSecret,{expiresIn:'20m'});
    }
    
    validataAccessToken(token:string):string|jwt.JwtPayload{
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}

export default new TokenService();