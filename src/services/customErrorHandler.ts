
class CustomErrorHandler extends Error {
    message!: string;
    status!: number;
    additionalInfo!: any;

    constructor(message: string, status: number, additionalInfo: any) {
        super(message);
        this.message = message;
        this.status = status;
        this.additionalInfo = additionalInfo;
    }

    public static serverError(message: string = 'internal server error', status: number = 500, additionalInfo?: any) {
        return new CustomErrorHandler(message, status, additionalInfo);
    }


    public static notFound(message: string = 'not found', status: number = 404, additionalInfo?: any) {
        return new CustomErrorHandler(message, status, additionalInfo);
    }

    public static alreadyExists(message: string = "already exists", status: number = 401, additionalInfo?: any) {
        return new CustomErrorHandler(message, status, additionalInfo);
    }

    public static wrongCredentials(message: string = "wrong credentials", status: number = 401, additionalInfo?: any) {
        return new CustomErrorHandler(message, status, additionalInfo);
    }

    public static unauthorize(message: string = "unauthorize", status: number = 401, additionalInfo?: any) {
        return new CustomErrorHandler(message, status, additionalInfo);
    }

    public static connectionError(message: string = "cannot connect to database", status: number = 404, additionalInfo?: any) {
        return new CustomErrorHandler(message, status, additionalInfo);
    }

}

export default CustomErrorHandler;