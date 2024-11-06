import { Gender } from "./gender";


export interface ProfileEntity {
    id: number;
    name?: string;
    phone?: number;
    gender?: Gender;
    address?: string;
    photo?: string;
}