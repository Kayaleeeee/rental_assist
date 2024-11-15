import { apiInstance } from "./apiInstance";

export const apiGet = async <T,>(url: string, params = {}): Promise<T> => {
  const response = await apiInstance.get<T>(url, { params });
  return response.data;
};

export const apiPost = async <T,>(
  url: string,
  body: Record<string, any>
): Promise<T> => {
  const response = await apiInstance.post<T>(url, body);
  return response.data;
};

export const apiPut = async <T,>(
  url: string,
  body: Record<string, any>
): Promise<T> => {
  const response = await apiInstance.put<T>(url, body);
  return response.data;
};
