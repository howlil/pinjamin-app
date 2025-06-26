


import { useCallback } from 'react';
import { showToast } from '@services/apiErrorHandler';

export const useApiToast = () => {
    
    const showSuccessFromResponse = useCallback((response, defaultMessage) => {
        const message = response?.data?.message || response?.message || defaultMessage;
        if (message) {
            showToast('success', message);
        }
    }, []);

    const showErrorFromResponse = useCallback((error, defaultMessage) => {
        const message = error?.response?.data?.message ||
            error?.message ||
            defaultMessage ||
            'Terjadi kesalahan yang tidak diketahui';
        showToast('error', message);
    }, []);

    const showWarningFromResponse = useCallback((response, defaultMessage) => {
        const message = response?.data?.message || response?.message || defaultMessage;
        if (message) {
            showToast('warning', message);
        }
    }, []);

    return {
        showSuccessFromResponse,
        showErrorFromResponse,
        showWarningFromResponse,
        showToast
    };
};

export default useApiToast; 