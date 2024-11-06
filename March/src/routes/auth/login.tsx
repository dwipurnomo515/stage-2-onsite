import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/use.store";
import { LoginForm } from "../../features/auth/components/login";

export function LoginRoute() {

    return <LoginForm />;
}
