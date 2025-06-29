import axios from 'axios';
import { showToast, handleResponseError } from './apiErrorHandler';
import { retryRequest } from './apiRetry';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const IS_DEVELOPMENT = import.meta.env.DEV;

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getAuthToken = () => {
    try {
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) return null;
        const parsedStorage = JSON.parse(authStorage);
        return parsedStorage?.state?.token || null;
    } catch (error) {
        if (IS_DEVELOPMENT) {
            console.error('Error getting token:', error);
        }
        return null;
    }
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (IS_DEVELOPMENT) {
            console.log(`🌐 ${config.method?.toUpperCase()}: ${config.baseURL}${config.url}`);
        }

        return config;
    },
    (error) => {
        if (IS_DEVELOPMENT) {
            console.error('Request interceptor error:', error);
        }
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        if (IS_DEVELOPMENT && response.config.url !== '/auth/profile') {
            console.log(`✅ ${response.config.method?.toUpperCase()} Success: ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        const processedError = handleResponseError(error);
        return Promise.reject(processedError);
    }
);

export const get = async (endpoint, options = {}) => {
    const { retry = false, ...axiosOptions } = options;

    const requestFn = async () => {
        const response = await axiosInstance.get(endpoint, {
            params: axiosOptions.params,
            ...axiosOptions,
        });
        return response.data;
    };

    try {
        if (retry) {
            return await retryRequest(requestFn);
        }
        return await requestFn();
    } catch (error) {
        throw error;
    }
};

export const post = async (endpoint, data = null, options = {}) => {
    const { retry = false, successMessage, ...axiosOptions } = options;

    const requestFn = async () => {
        const config = {
            headers: axiosOptions.headers || {},
            ...axiosOptions,
        };

        if (data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await axiosInstance.post(endpoint, data, config);
        return response.data;
    };

    try {
        let result;
        if (retry) {
            result = await retryRequest(requestFn);
        } else {
            result = await requestFn();
        }

        if (!options.silent && successMessage) {
            showToast('success', successMessage);
        } else if (!options.silent && !options.hideSuccessToast && result?.message) {
            showToast('success', result.message);
        }

        return result;
    } catch (error) {
        throw error;
    }
};

export const patch = async (endpoint, data = null, options = {}) => {
    const { retry = false, successMessage, ...axiosOptions } = options;

    const requestFn = async () => {
        const config = {
            headers: axiosOptions.headers || {},
            ...axiosOptions,
        };

        if (data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await axiosInstance.patch(endpoint, data, config);
        return response.data;
    };

    try {
        let result;
        if (retry) {
            result = await retryRequest(requestFn);
        } else {
            result = await requestFn();
        }

        if (!options.silent && successMessage) {
            showToast('success', successMessage);
        } else if (!options.silent && !options.hideSuccessToast && result?.message) {
            showToast('success', result.message);
        }

        return result;
    } catch (error) {
        throw error;
    }
};

export const put = async (endpoint, data = null, options = {}) => {
    const { retry = false, successMessage, ...axiosOptions } = options;

    const requestFn = async () => {
        const config = {
            headers: axiosOptions.headers || {},
            ...axiosOptions,
        };

        if (data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        const response = await axiosInstance.put(endpoint, data, config);
        return response.data;
    };

    try {
        let result;
        if (retry) {
            result = await retryRequest(requestFn);
        } else {
            result = await requestFn();
        }

        if (!options.silent && successMessage) {
            showToast('success', successMessage);
        } else if (!options.silent && !options.hideSuccessToast && result?.message) {
            showToast('success', result.message);
        }

        return result;
    } catch (error) {
        throw error;
    }
};

export const del = async (endpoint, options = {}) => {
    const { retry = false, successMessage, ...axiosOptions } = options;

    const requestFn = async () => {
        const response = await axiosInstance.delete(endpoint, axiosOptions);
        return response.data;
    };

    try {
        let result;
        if (retry) {
            result = await retryRequest(requestFn);
        } else {
            result = await requestFn();
        }

        if (!options.silent && successMessage) {
            showToast('success', successMessage);
        } else if (!options.silent && !options.hideSuccessToast && result?.message) {
            showToast('success', result.message);
        }

        return result;
    } catch (error) {
        throw error;
    }
};

export const validateFile = (file, options = {}) => {
    const {
        maxSize = 10 * 1024 * 1024,
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        maxFiles = 10
    } = options;

    const errors = [];

    if (file instanceof FileList || Array.isArray(file)) {
        if (file.length > maxFiles) {
            errors.push(`Maksimal ${maxFiles} file yang dapat diupload`);
        }

        Array.from(file).forEach((f) => {
            if (f.size > maxSize) {
                errors.push(`File ${f.name} terlalu besar (maksimal ${Math.round(maxSize / 1024 / 1024)}MB)`);
            }
            if (!allowedTypes.includes(f.type)) {
                errors.push(`Format file ${f.name} tidak didukung`);
            }
        });
    } else if (file instanceof File) {
        if (file.size > maxSize) {
            errors.push(`File terlalu besar (maksimal ${Math.round(maxSize / 1024 / 1024)}MB)`);
        }
        if (!allowedTypes.includes(file.type)) {
            errors.push(`Format file tidak didukung`);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const createFormData = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (value instanceof FileList || Array.isArray(value)) {
            Array.from(value).forEach((item, index) => {
                if (item instanceof File) {
                    formData.append(`${key}[${index}]`, item);
                } else {
                    formData.append(`${key}[${index}]`, item);
                }
            });
        } else if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    return formData;
};

export const uploadFile = async (endpoint, files, additionalData = {}, options = {}) => {
    try {
        const formData = new FormData();

        if (files instanceof File) {
            formData.append('file', files);
        } else if (files instanceof FileList || Array.isArray(files)) {
            Array.from(files).forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });
        } else if (typeof files === 'object') {
            Object.entries(files).forEach(([key, file]) => {
                formData.append(key, file);
            });
        }

        Object.entries(additionalData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...options.headers,
            },
            ...options,
        };

        const response = await axiosInstance.post(endpoint, formData, config);

        if (!options.silent && response.data?.message) {
            showToast('success', response.data.message);
        } else if (!options.silent) {
            const fileCount = files instanceof File ? 1 :
                (files instanceof FileList || Array.isArray(files)) ? files.length :
                    Object.keys(files).length;
            showToast('success', `${fileCount} file berhasil diupload`);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadFileWithProgress = async (endpoint, files, additionalData = {}, options = {}) => {
    try {
        const formData = createFormData({
            ...additionalData,
            files: files
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...options.headers,
            },
            onUploadProgress: (progressEvent) => {
                if (options.onProgress && progressEvent.total) {
                    const percentComplete = (progressEvent.loaded / progressEvent.total) * 100;
                    options.onProgress(Math.round(percentComplete));
                }
            },
            ...options,
        };

        const response = await axiosInstance.post(endpoint, formData, config);

        if (!options.silent && response.data?.message) {
            showToast('success', response.data.message);
        } else if (!options.silent) {
            showToast('success', 'File berhasil diupload');
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postMultipart = async (endpoint, formData, options = {}) => {
    return post(endpoint, formData, {
        ...options,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...options.headers,
        }
    });
};

export const apiClient = {
    get,
    post,
    postMultipart,
    uploadFile,
    uploadFileWithProgress,
    put,
    patch,
    delete: del,
    validateFile,
    createFormData,
    axios: axiosInstance,
};

export const withApiErrorHandling = (apiFunction) => {
    return async (...args) => {
        try {
            return await apiFunction(...args);
        } catch (error) {
            throw error;
        }
    };
};

export default apiClient; 