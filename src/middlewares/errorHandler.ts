
import { Request, Response, NextFunction } from "express"
import CustomErrorHandler from "@services/customErrorHandler"
import { NODE_ENV } from '@/config';
import { ValidationError } from "joi";

interface DataResponse {
    message: string,
    orignalMessage?: string
}


const errorHandler = (error: TypeError | CustomErrorHandler, req: Request, res: Response, next: NextFunction) => {

    let status = 500;

    let data: DataResponse = {
        message: 'internal server error',
        ...(NODE_ENV === 'development' && { orignalMessage: error.message }),
    }

    if (error instanceof CustomErrorHandler) {
        status = error.status;
        data = {
            message: error.message
        };
    }

    if (error instanceof ValidationError) {
        status = 401;
        data = {
            message: error.message
        }
    }

    res.status(status).json(data);
}

export default errorHandler;