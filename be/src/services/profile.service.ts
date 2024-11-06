
import { updateProfileDto } from "../dto/profile";
import prisma from "../prisma/client";


class ProfileService {
    async findProfile(userId: number) {
        const profile = await prisma.profile.findUnique({
            where: {
                userId
            },
            select: {
                address: true,
                gender: true,
                name: true,
                phone: true,
                photo: true
            }
        })

        if (!profile) {
            throw new Error("Profile not found")
        }
    }

    async editProfile(data: updateProfileDto, userId: number) {
        const profile = await prisma.profile.update({
            where: {
                userId: userId
            },
            data: {
                name: data.name,
                address: data.address,
                gender: data.gender,
                phone: data.phone,
                photo: data.photo || "https://example.com/default-profile.jpg"
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }

        });

        if (!profile) {
            throw new Error("Profile not found")
        }


        return profile;


    }
}


export default new ProfileService();