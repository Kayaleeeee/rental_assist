import axios from "axios";

import { camelCase, isArray, isObject, snakeCase } from "lodash";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
} from "../constants";
import { clientSupabase } from "../utils/supabase/client";

const apiUrl = NEXT_PUBLIC_SUPABASE_URL;
const anonKey = NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const toCamelCase = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (isObject(obj)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[camelCase(key)] = toCamelCase(value); // Recursively apply for objects
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
};

// Convert keys of an object to snakeCase
export const toSnakeCase = (obj: any): any => {
  if (isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (isObject(obj)) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[snakeCase(key)] = toSnakeCase(value); // Recursively apply for objects
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
};

export const apiInstance = axios.create({
  baseURL: `${apiUrl}/rest/v1`,
  headers: {
    "Content-Type": "application/json",
    apikey: anonKey,
  },

  paramsSerializer: (params) => {
    const keyPrefix = ["or", "offset", "limit", "select", "count", "order"];
    const valuePrefix = [
      "lt.",
      "lte.",
      "gt.",
      "gte.",
      "eq.",
      "ilike.",
      "id.",
      "in.",
    ];

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (keyPrefix.some((item) => item === key)) {
        searchParams.append(key, value);
      } else if (
        typeof value === "string" &&
        valuePrefix.some((item) => value.startsWith(item))
      ) {
        searchParams.append(key, value);
      } else if (value !== undefined) {
        searchParams.append(key, `eq.${value}`);
      }
    }

    return searchParams.toString();
  },
});

apiInstance.interceptors.request.use(async (config) => {
  const { data: session } = await clientSupabase.auth.getSession();
  const token = session?.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data) {
    config.data = toSnakeCase(config.data); // Convert request body to snake_case
  }

  if (config.params) {
    config.params = toSnakeCase(config.params); // Convert query params to snake_case
  }

  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = toCamelCase(response.data); // Convert response body to camelCase
    }

    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 갱신 로직
      const { data: session } = await clientSupabase.auth.refreshSession();
      const token = session?.session?.access_token;

      if (token) {
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
