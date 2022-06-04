class ApiError extends Error{

    status:number;
    message: string;

    constructor(status:number,message:string){
        super(message);
        this.status=status;
        this.message=message;
    }

    static badRequest(message:string):ApiError{
        return new ApiError(400, message);
    }
    
    static internal(message: string) {
        return new ApiError(500, message);
    }

}

export default ApiError;