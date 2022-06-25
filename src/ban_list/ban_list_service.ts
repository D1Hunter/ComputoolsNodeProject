import BanList from "./ban_list_model";

class BanListService{
    async create(userId:number,reason:string,banDate:Date):Promise<BanList>{
        return await BanList.create({userId,reason,banDate,unbanDate:null});
    }

    async update(ban:BanList,reason:string,unbanDate?:Date):Promise<BanList>{
        return await ban.update({reason,unbanDate});
    }
    
    async getByUser(userId:number):Promise<BanList[]>{
        return await BanList.findAll({where:{userId}});
    }
}

export default new BanListService();