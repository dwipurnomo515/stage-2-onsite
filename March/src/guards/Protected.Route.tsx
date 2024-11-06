import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/use.store";
import Cookies from "js-cookie";


export function ProtectedRoute() {

    const token = Cookies.get("token")
    const user = useAppSelector(state => state.auth);

    // Jika perlu otentikasi dan tidak ada user, arahkan ke halaman login
    if (!user.id || !token) {
        return (
            <Navigate to="/login" replace />

        );
    }



    return <Outlet />;
}
