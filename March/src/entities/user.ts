import { ProfileEntity } from "./profile";
import { RoleEnum } from "./role";


export interface UserEntity {
    id: number;
    email: string;
    password: string;
    role: RoleEnum
    Profile: ProfileEntity
}