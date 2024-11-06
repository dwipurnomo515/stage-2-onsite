import { useForm } from "react-hook-form";
import { RegisterFormInput, registerSchema } from "../schema/register";
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/use.store";
import { apiV1 } from "../../../libs/api";
import { RegisterResponseDTO } from "../dto/register";
import { setUser } from "../../../store/auth/auth.slice";
import Cookies from "js-cookie";


export function useRegister() {
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm<RegisterFormInput>({
        resolver: zodResolver(registerSchema),
    });
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    async function onSubmit(data: RegisterFormInput) {

        try {
            const res = await apiV1.post<RegisterResponseDTO>('/auth/register', data)
            console.log(res.data);

            const { user, token } = res.data;
            console.log("User data from response:", user); // Tambahkan log ini

            dispatch(setUser(user));
            Cookies.set("token", token, { expires: 1 });
            navigate("/login")
        } catch (error) {
            console.log(error);

        }
    };

    return {
        register,
        handleSubmit,
        errors,
        onSubmit
    }


}