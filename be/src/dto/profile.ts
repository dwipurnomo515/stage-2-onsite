import { Gender } from "@prisma/client";

export interface updateProfileDto {
    id: number;
    name: string;
    address: string;
    gender: Gender | null;
    phone: string;
    photo: string;
}