import { Request, Response, NextFunction } from "express"
import Joi from "joi";
import User from "@models/user";
import CustomErrorHandler from "@services/customErrorHandler";
import { FORGET_SECRET, BACKEND_URL } from '@/config';
import JwtService from "@services/jwtService";
import bcrypt from 'bcrypt';
import { emailService } from '@/services/email';

interface ForgotType {
    email: string
}

interface ResetType {
    password: string;
    repeat_password: string;
}

interface ResetParamType {
    id: string;
    token: string;
}

const ForgotController = {

    async forget(req: Request<{}, {}, ForgotType>, res: Response, next: NextFunction) {

        const forgetValidator = Joi.object({
            email: Joi.string().email().required()
        });

        const { error } = forgetValidator.validate(req.body);

        if (error) {
            return next(error);
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return next(CustomErrorHandler.notFound());
            }

            const secret = FORGET_SECRET + user.password;
            const payload = {
                _id: user._id,
                email: user.email
            }
            const token = JwtService.sign(payload, secret, '15m');
            const link = `${BACKEND_URL}/api/auth/reset-password/${user._id}/${token}`;

            /* SEND EMAIL LOGIC*/

            const isEmailSent = await emailService(email, user.name, link);

            if (!isEmailSent) {
                return next(CustomErrorHandler.serverError('can not sent email'))
            }

            return res.json({ status: 'email sent' });
        } catch (error) {
            return next(error);
        }
    },

    reset: async (req: Request<ResetParamType, {}, ResetType>, res: Response, next: NextFunction) => {

        const resetValidator = Joi.object({
            password: Joi.string().min(6).max(40).required(),
            repeat_password: Joi.ref('password'),
        });

        const { error } = resetValidator.validate(req.body);

        if (error) {
            return next(error);
        }

        const { id, token } = req.params;

        const { password } = req.body;

        try {
            const user = await User.findOne({ _id: id });
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            const secret = FORGET_SECRET + user.password;

            const match = JwtService.verify(token, secret);

            if (!match) {
                return next(CustomErrorHandler.unauthorize());
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const updateUser = await User.findOneAndUpdate({ _id: user._id }, {
                password: hashPassword
            });

            if (!updateUser) {
                return next(CustomErrorHandler.serverError());
            }
            res.json(updateUser);
        } catch (error) {
            return next(error)
        }
    }
}

export default ForgotController;