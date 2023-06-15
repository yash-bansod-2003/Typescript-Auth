import { Response, Request, NextFunction } from "express"
import User from "@models/user";
import Refresh from "@models/refresh";
import Joi from "joi";
import CustomErrorHandler from "@services/customErrorHandler";
import bcrypt from 'bcrypt';
import JwtService from "@/services/jwtService";
import { REFRESH_SECRET } from '@/config';
import { NewRequest } from "@middlewares/authHeader";

interface bodyRegisterTypes {
    name: string,
    email: string,
    password: string,
    repeat_password: string
}

interface bodyLoginTypes {
    email: string,
    password: string,
}

const UserController = {
    async register(req: Request<{}, {}, bodyRegisterTypes>, res: Response, next: NextFunction) {

        const registerBodyValidator: Joi.Schema = Joi.object({
            name: Joi.string().min(2).max(40).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6).max(50),
            repeat_password: Joi.ref('password')
        });

        const { error } = registerBodyValidator.validate(req.body);

        if (error) {
            return next(error)
        }

        const { name, email, password } = req.body;

        try {
            const requestUser = await User.findOne({ email });

            if (requestUser) {
                return next(CustomErrorHandler.alreadyExists());
            }

            const hashedPassword: string = bcrypt.hashSync(password, 10);

            const user = await User.create({
                name, email, password: hashedPassword
            });

            if (!user) {
                return next(CustomErrorHandler.serverError());
            }

            res.status(201).json(user);

        } catch (error) {
            return next(error);
        }
    },

    async login(req: Request<{}, {}, bodyLoginTypes>, res: Response, next: NextFunction) {

        const loginBodyValidator: Joi.Schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const { error } = loginBodyValidator.validate(req.body);

        if (error) {
            return next(error)
        }

        const { email, password } = req.body;

        try {
            const requestUser = await User.findOne({ email });

            if (!requestUser) {
                return next(CustomErrorHandler.notFound());
            }

            const { password: hashedPassword } = requestUser;

            const match = bcrypt.compareSync(password, hashedPassword);

            if (!match) {
                return next(CustomErrorHandler.notFound());
            }
            const { _id, name } = requestUser;

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

            return res.status(200).json({ name, email });

        } catch (error) {
            return next(error);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction) {

        const token = req.cookies?.refresh;

        try {
            const isWhiteListed = await Refresh.findOne({ token });

            if (!isWhiteListed) {
                return next(CustomErrorHandler.serverError());
            }

            res.cookie('access', '');
            res.cookie('refresh', '');

            const deleteToken = await Refresh.findOneAndDelete({ token });

            if (!deleteToken) {
                return next(CustomErrorHandler.serverError());
            }

            return res.json({ status: 'logout' })
        } catch (error) {
            return next(error);
        }

    },

    async index(req: NewRequest, res: Response, next: NextFunction) {
        const _id = req.user._id;

        try {
            const user = await User.findOne({ _id }).select('-password');

            if (!user) {
                return next(CustomErrorHandler.notFound());
            }

            return res.json(user);
        } catch (error) {
            return next(error);
        }
    }

}


export default UserController;