import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "sonner";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request error occurred");

    Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.method !== 'get') {
      toast.success(response.data.message);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data as Record<string, any>;
      const message = responseData?.message || 'Something went wrong';

      switch (status) {
        case 400:
          toast.error(message);
          break;
        case 401:
          toast.error(message);
          break;
        case 403:
          toast.error(message);
          break;
        case 404:
          toast.error(message);
          break;
        case 500:
          toast.error('messgae');
          break;
        default:
          toast.error(`Error: ${error.response.data || 'Something went wrong'}`);
      }
    } else if (error.request) {
      toast.error('No response from server. Please check your connection.');
    } else {
      toast.error(`Request configuration error: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
