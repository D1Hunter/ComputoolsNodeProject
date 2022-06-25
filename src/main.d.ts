declare namespace Express {
    export interface User {
        id: number;
        email: string;
        login: string;
        role:string;
        roleId:number;
        teamId:number;
    }
}