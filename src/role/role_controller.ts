import { Response,Request } from 'express';
import {validationResult} from 'express-validator';
import roleService from './role_service';
import ApiError from '../exceptions/api-error';

class RoleController{
    async create(req:Request, res:Response){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({errors})
            }
            const {name} = req.body;
            const checkRole = await roleService.getRoleByName(name);
            if(checkRole){
                throw ApiError.badRequest('Role is already exists');
            }
            const role = await roleService.create(name);
            return res.json(role);
        } catch (error) {
            if(error instanceof ApiError){
                return res.status(error.status).json({message:error.message});
            }
            console.log(error);
            return res.status(500).json({message:"Role creating error"});
        }
    }

    async getAll(req:Request,res:Response){
        try {
            const roles = await roleService.getAllRoles();
            return res.json(roles);
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Roles getting error"});
        }
    }
}
export default new RoleController();