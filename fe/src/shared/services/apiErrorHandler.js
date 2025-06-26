import toast from 'react-hot-toast';

const IS_DEVELOPMENT = import.meta.env.DEV;
const errorCache = new Map();
const CACHE_DURATION = 3000;

export const showToast = (type, message) => {
    const now = Date.now();
    const toastKey = `${type}-${message}`;

    if (errorCache.has(toastKey)) {
        const lastShown = errorCache.get(toastKey);
        if (now - lastShown < CACHE_DURATION) {
            return;
        }
    }

    errorCache.set(toastKey, now);

    switch (type) {
        case 'success':
            toast.success(message, {
                duration: 3000,
                position: 'top-right',
            });
            break;
        case 'error':
            toast.error(message, {
                duration: 4000,
                position: 'top-right',
            });
            break;
        case 'warning':
            toast(message, {
                icon: '⚠️',
                duration: 4000,
                position: 'top-right',
            });
            break;
        default:
            toast(message, {
                duration: 3000,
                position: 'top-right',
            });
    }
};

export const cleanupExpiredCache = () => {
    const now = Date.now();
    for (const [key, timestamp] of errorCache.entries()) {
        if (now - timestamp > CACHE_DURATION) {
            errorCache.delete(key);
        }
    }
};

setInterval(cleanupExpiredCache, CACHE_DURATION);

export const handleResponseError = (error) => {
    const endpoint = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'REQUEST';

    if (IS_DEVELOPMENT) {
        console.error(`❌ ${method} Error: ${endpoint}`, error.response?.data || error.message);
    }

    if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.message;
        const showUserError = !error.config?.hideErrorToast;

        switch (status) {
            case 401:
                if (showUserError && endpoint !== '/auth/logout') {
                    showToast('error', serverMessage || 'Sesi Anda telah berakhir. Silakan login kembali');
                }
                localStorage.removeItem('auth-storage');
                setTimeout(() => {
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }, 1000);
                break;

            case 403:
                if (showUserError) {
                    showToast('error', serverMessage || 'Anda tidak memiliki izin untuk melakukan aksi ini');
                }
                break;

            case 404:
                if (showUserError && !endpoint.includes('/check-availability')) {
                    showToast('error', serverMessage || 'Data yang Anda cari tidak ditemukan');
                }
                break;

            case 422:
                if (showUserError) {
                    const errorMsg = Array.isArray(error.response.data?.errors)
                        ? error.response.data.errors.map(err => err.message || err).join(', ')
                        : serverMessage || 'Data yang dikirim tidak valid';
                    showToast('error', errorMsg);
                }
                break;

            case 429:
                showToast('warning', serverMessage || 'Terlalu banyak permintaan. Mohon tunggu sebentar');
                break;

            case 500:
                if (showUserError) {
                    showToast('error', serverMessage || 'Terjadi masalah pada server. Tim kami sedang memperbaikinya');
                }
                break;

            case 503:
                showToast('warning', serverMessage || 'Server sedang dalam pemeliharaan. Coba beberapa saat lagi');
                break;

            default:
                if (showUserError && status >= 400) {
                    const friendlyMessage = getFriendlyErrorMessage(status, serverMessage);
                    showToast('error', friendlyMessage);
                }
        }

        const errorObj = {
            ...error,
            response: {
                ...error.response,
                data: {
                    status: 'error',
                    message: serverMessage,
                    errors: error.response.data?.errors || []
                }
            }
        };
        return errorObj;
    } else if (error.request) {
        if (!error.config?.hideErrorToast) {
            showToast('error', 'Koneksi internet bermasalah. Silakan coba lagi');
        }
    } else {
        if (!error.config?.hideErrorToast) {
            showToast('error', 'Terjadi kesalahan yang tidak diketahui');
        }
    }

    return error;
};

const getFriendlyErrorMessage = (status, originalMessage) => {
    if (originalMessage) {
        return originalMessage;
    }

    const friendlyMessages = {
        400: 'Permintaan tidak valid. Periksa data yang Anda kirim',
        405: 'Metode tidak diizinkan untuk endpoint ini',
        408: 'Waktu permintaan habis. Coba lagi',
        409: 'Data yang Anda kirim bertentangan dengan data yang ada',
        413: 'File terlalu besar untuk diupload',
        415: 'Format file tidak didukung',
        500: 'Terjadi masalah pada server. Tim kami sedang memperbaikinya',
        502: 'Server tidak dapat diakses sementara',
        503: 'Server sedang dalam pemeliharaan',
        504: 'Server membutuhkan waktu terlalu lama untuk merespons'
    };

    return friendlyMessages[status] || 'Terjadi kesalahan yang tidak diketahui';
}; 