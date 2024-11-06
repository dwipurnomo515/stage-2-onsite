import { ProfileEntity } from "../../../entities/profile";
import { UserEntity } from "../../../entities/user";


interface UserLogin extends Pick<UserEntity, "email" | "password"> { }
interface ProfileLogin extends Pick<ProfileEntity, "name"> { }

export interface LoginRequestDTO extends UserLogin, ProfileLogin { }

export interface LoginResponseDTO {
    message: string;
    user: UserEntity;
    token: string;
}


