import { Navigate } from "react-router-dom";
import { RegisterForm } from "../../features/auth/components/register";
import { useAppSelector } from "../../hooks/use.store";



export function RegisterRoute() {
    return <RegisterForm />
}