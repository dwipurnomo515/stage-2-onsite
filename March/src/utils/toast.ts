import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};
export const showToast = {
    success: (message: string) => toast.success(message, toastOptions),
    error: (message: string) => toast.error(message, toastOptions),
    info: (message: string) => toast.info(message, toastOptions),
    warn: (message: string) => toast.warn(message, toastOptions),
};
