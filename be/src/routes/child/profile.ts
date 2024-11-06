import { Router } from "express";
import { authentication } from "../../middlewares/authentication";
import upload from "../../middlewares/upload";
import profileController from "../../controller/profile.controller";



const profileRouter = Router();

profileRouter.put('/update', authentication, upload.single('photo'), profileController.updateProfile)
profileRouter.get('/getByUserId', authentication, profileController.findByUserId)

export default profileRouter;