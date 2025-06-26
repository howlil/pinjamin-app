import { useState } from 'react';
import toast from 'react-hot-toast';

export const useApiToast = () => {
    const [loading, setLoading] = useState(false);

    const showToast = (type, message, duration = 3000) => {
        switch (type) {
            case 'success':
                toast.success(message, { duration });
                break;
            case 'error':
                toast.error(message, { duration });
                break;
            case 'warning':
                toast.error(message, { duration }); // react-hot-toast doesn't have warning, use error
                break;
            case 'info':
                toast.success(message, { duration }); // react-hot-toast doesn't have info, use success
                break;
            default:
                toast(message, { duration });
        }
    };

    const showSuccessToast = (message, duration = 3000) => {
        toast.success(message, { duration });
    };

    const showErrorToast = (message, duration = 3000) => {
        toast.error(message, { duration });
    };

    const showLoadingToast = (message) => {
        return toast.loading(message);
    };

    const dismissToast = (toastId) => {
        toast.dismiss(toastId);
    };

    const dismissAllToasts = () => {
        toast.dismiss();
    };

    return {
        showToast,
        showSuccessToast,
        showErrorToast,
        showLoadingToast,
        dismissToast,
        dismissAllToasts,
        loading,
        setLoading
    };
};

export default useApiToast; 