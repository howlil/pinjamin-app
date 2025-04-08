import apiClient from "../lib/axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";


class ApiService {
  static get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(url, { params, ...config });
  }

  static post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, data, config);
  }

  static put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(url, data, config);
  }

  static patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.patch<T>(url, data, config);
  }

  static delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(url, config);
  }

  static request<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.request<T>(config);
  }
}


export default ApiService;
