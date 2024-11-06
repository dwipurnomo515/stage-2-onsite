import { Request, Response } from "express";
import profileService from "../services/profile.service";
import prisma from "../prisma/client";
import uploader from "../libs/cloudinary";


class ProfileController {

    async updateProfile(req: Request, res: Response) {
        try {

            const userId = (req as any).user.id
            const body = req.body

            if (req.file) {
                const photoUrl = await uploader(req.file as Express.Multer.File)
                body.photo = photoUrl.url
            }
            const result = await profileService.editProfile(body, Number(userId))

            res.json({ message: "Edit success", result })
        } catch (error) {
            const err = error as Error
            res.status(500).json({ message: err.message })

        }
    }

    async findByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = +(req as any).user.id

            const profile = await prisma.profile.findUnique({
                where: { userId },
                include: {
                    user: true
                }
            });

            if (!profile) {
                res.status(404).json({ message: "Profile not found" });
                return;
            }

            res.json(profile);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
        }
    }
}

export default new ProfileController();