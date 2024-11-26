import { AxiosRequestConfig } from "axios";
import { apiInstance } from "./apiInstance";

export const apiGet = async <T,>(
  url: string,
  params = {},
  options?: AxiosRequestConfig<any>
): Promise<T> => {
  const response = await apiInstance.get<T>(url, { ...options, params });
  return response.data;
};

export const apiPost = async <T,>(
  url: string,
  body: Record<string, any>,
  options?: AxiosRequestConfig<any>
): Promise<T> => {
  const response = await apiInstance.post<T>(url, body, options);
  return response.data;
};

export const apiPut = async <T,>(
  url: string,
  body: Record<string, any>,
  options?: AxiosRequestConfig<any>
): Promise<T> => {
  const response = await apiInstance.put<T>(url, body, options);
  return response.data;
};

export const apiPatch = async <T,>(
  url: string,
  body: Record<string, any>,
  options?: AxiosRequestConfig<any>
): Promise<T> => {
  const response = await apiInstance.patch<T>(url, body, options);
  return response.data;
};

export const apiDelete = async <T,>(
  url: string,
  options?: AxiosRequestConfig<any>
): Promise<T> => {
  const response = await apiInstance.delete<T>(url, options);
  return response.data;
};
