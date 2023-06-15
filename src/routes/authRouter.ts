import { Router } from "express";
import UserController from '@controllers/userController';
import authHeader from "@middlewares/authHeader";
import RefreshController from "@controllers/refreshController";
import ForgotController from "@controllers/forgotController";

const router = Router();


router.post('/auth/register', UserController.register);
router.post('/auth/login', UserController.login);
router.post('/auth/logout', authHeader, UserController.logout);
router.post('/auth/me', authHeader, UserController.index);
router.post('/auth/refresh', authHeader, RefreshController.refresh);

router.post('/auth/forget', ForgotController.forget);
router.post('/auth/reset-password/:id/:token', ForgotController.reset);


export default router;