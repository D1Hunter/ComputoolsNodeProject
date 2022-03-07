const jwt=require('jsonwebtoken');
const accessSecret=process.env.JWT_ACCESS_SECRET||"secretAccess";
const refrestSecret=process.env.JWT_REFRESH_SECRET||"secretRefresh";
class TokenService{
    generateTokens(payload:object){
        const accessToken = jwt.sign(payload,accessSecret,{expiresIn:"30s"});
        const refreshToken = jwt.sign(payload,refrestSecret,{expiresIn:"1d"});
        return{
            accessToken,
            refreshToken
        }
    }
    validataAccessToken(token:any){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
}

export default new TokenService;