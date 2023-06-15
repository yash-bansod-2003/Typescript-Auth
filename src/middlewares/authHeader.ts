import { Request, Response, NextFunction } from 'express';
import JwtService from '@services/jwtService';
import User from '@models/user';
import CustomErrorHandler from '@/services/customErrorHandler';
import { Types } from 'mongoose';

export interface JwtPayload {
    _id: Types.ObjectId
}

export interface NewRequest extends Request {
    user: {
        _id: Types.ObjectId;
    }
}


const authHeader = async (req: NewRequest, res: Response, next: NextFunction) => {
    try {
        const access = req.cookies?.access;

        const match = JwtService.verify(access) as JwtPayload;

        if (!match) {
            return next(CustomErrorHandler.serverError('token invalid'))
        }

        const { _id } = match;

        const isUser = await User.findOne({ _id });

        if (!isUser) {
            return next(CustomErrorHandler.notFound());
        }

        let user = {
            _id: _id
        }

        req.user = user;

        next();

    } catch (error) {
        return next(error);
    }

};


export default authHeader;