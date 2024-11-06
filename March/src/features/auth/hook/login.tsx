import { useForm } from "react-hook-form";
import { LoginFormInput, loginSchema } from "../schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/use.store";
import { apiV1 } from "../../../libs/api";
import { LoginRequestDTO, LoginResponseDTO } from "../dto/login";
import { setUser } from "../../../store/auth/auth.slice";
import Cookies from "js-cookie";



export function useLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormInput>({
        resolver: zodResolver(loginSchema)
    });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    async function onsubmit(data: LoginFormInput) {
        console.log("ini teh data", data);

        try {
            const res = await apiV1.post<null, { data: LoginResponseDTO }, LoginRequestDTO>('/auth/login', data)

            const { user, token } = res.data;
            console.log("Response dari server:", res.data); // Tambahkan log untuk melihat respons

            dispatch(setUser(user))
            Cookies.set("token", token, { expires: 1 });

            navigate('/')

            const userLogin = useAppSelector((state) => state.auth);

            if (userLogin.role === 'MEMBER') {
                return (
                    <Navigate to={'/'} replace />
                )
            }

            if (userLogin.role === 'ADMIN') {
                return (
                    <Navigate to={'/dashboard'} replace />
                )
            }
        } catch (error) {
            console.log(error);

        }
    };

    return {
        register,
        handleSubmit,
        errors,
        onsubmit
    }
}