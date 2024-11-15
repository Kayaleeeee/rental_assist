import axios from "axios";
import { createClient } from "../utils/supabase/client";

const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const apiInstance = axios.create({
  baseURL: `${apiUrl}/rest/v1`,
  headers: {
    "Content-Type": "application/json",
    apikey: anonKey,
  },
});

apiInstance.interceptors.request.use(async (config) => {
  const supabase = await createClient();
  const { data: session } = await supabase.auth.getSession();
  const token = session?.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 갱신 로직
      const supabase = await createClient();
      const { data: session } = await supabase.auth.refreshSession();
      const token = session?.session?.access_token;

      if (token) {
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
