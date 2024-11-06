import axios from "axios";
import Cookies from 'js-cookie'

const baseUrl = import.meta.env.VITE_API_URL;
export const apiV1 = axios.create({
    baseURL: `${baseUrl}/api/v1`,
    headers: {
        Authorization: `Bearer ${Cookies.get("token")}`
    }
});

