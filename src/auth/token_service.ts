import jwt from 'jsonwebtoken';
const accessSecret=process.env.JWT_ACCESS_SECRET||"secretAccess";

class TokenService{
    async generateToken(payload:object):Promise<string>{
        return await jwt.sign(payload,accessSecret,{expiresIn:"10m"});
    }
    validataAccessToken(token:string){
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}

export default new TokenService();