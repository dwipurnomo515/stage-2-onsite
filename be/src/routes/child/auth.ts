import { Router } from "express";
import authController from "../../controller/auth.controller";
import { authentication } from "../../middlewares/authentication";



const authRouter = Router();

authRouter.get('/check', authentication, authController.check);
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

export default authRouter;