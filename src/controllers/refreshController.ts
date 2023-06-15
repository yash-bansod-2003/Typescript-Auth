import { Request, Response, NextFunction } from 'express';
import Refresh from '@models/refresh';
import CustomErrorHandler from '@services/customErrorHandler';
import JwtService from '@services/jwtService';
import { REFRESH_SECRET } from '@/config'
import { JwtPayload } from '@middlewares/authHeader';

const RefreshController = {
    refresh: async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.cookies?.refresh;

            const match = JwtService.verify(token, REFRESH_SECRET) as JwtPayload;

            if (!match) {
                return next(CustomErrorHandler.serverError());
            }

            const { _id } = match;

            const isWhiteListed = await Refresh.findOne({ token });

            if (!isWhiteListed) {
                return next(CustomErrorHandler.serverError());
            }

            const accessToken = JwtService.sign({ _id });
            const refreshToken = JwtService.sign({ _id }, REFRESH_SECRET, '1w');

            const savedRefresh = await Refresh.create({
                token: refreshToken
            });

            if (!savedRefresh) {
                return next(CustomErrorHandler.serverError());
            }

            res.cookie('access', accessToken, { httpOnly: true, secure: true });
            res.cookie('refresh', refreshToken, { httpOnly: true });

            return res.json({ status: 'logout' })
        } catch (error) {
            return next(error);
        }

    }
}


export default RefreshController;