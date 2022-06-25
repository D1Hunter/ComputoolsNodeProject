import path from "path";
import * as uuid from 'uuid';
import  fs from "fs";
import User from "../user/user_model";

const IMAGE_FOLDER_PATH = process.env.IMAGE_FOLDER_PATH;

class FileService{
    async uploadAvatar(user:User,file:any):Promise<User>{
        if(user.avatar){
            this.removeFile(IMAGE_FOLDER_PATH+"/"+user.avatar);
        }
        const avatar = this.uploadFile(file);
        user.avatar=avatar;
        return await user.save();
    }
    
    uploadFile(file:any):string{
        const extension = file.name.split('.').pop();
        fs.mkdirSync(IMAGE_FOLDER_PATH,{recursive:true});
        const fileName = uuid.v4()+'.'+extension;
        const filePath = path.resolve(IMAGE_FOLDER_PATH,fileName);
        file.mv(filePath);
        return fileName;
    }

    removeFile(filePath:string):string{
        if(!fs.existsSync(filePath)){
            return null;
        }
        fs.unlinkSync(filePath);
        return filePath;
    }
}

export default new FileService();