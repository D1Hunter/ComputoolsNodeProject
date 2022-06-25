import { Op } from 'sequelize';
import 'dotenv/config';
import User from '../user/user_model';
import Role from '../role/role_model';
import Team from '../team/team_model';
import ApplicationList from '../application_list/application_list_model';
import TeamRequest from '../team_request/teamrequest_model';

export const resetDb = async ()=>{
    console.log('Reseting database...');
    await User.destroy({cascade:true, where:{id:{[Op.gt]:3}}});
    await Role.destroy({cascade:true, where:{id:{[Op.gt]:3}}});
    await Team.destroy({cascade:true, where:{id:{[Op.gt]:3}}});
    await ApplicationList.truncate({cascade:true, restartIdentity:true});
    await TeamRequest.truncate({cascade:true, restartIdentity:true});
}

resetDb();