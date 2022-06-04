import BanList from "./ban_list_model";

class BanListService{
    async create(userId:number,reason:string,banDate:Date):Promise<BanList>{
        return await BanList.create({userId,reason,banDate,unbanDate:null});
    }
    async update(ban:BanList,reason:string,banDate?:Date,unbanDate?:Date):Promise<BanList>{
        if(banDate){
            return await ban.update({reason,banDate,unbanDate});
        }
        return await ban.update({reason,unbanDate});
    }
    async getByUser(userId:number):Promise<BanList>{
        return await BanList.findOne({where:{userId}});
    }
}

export default new BanListService();