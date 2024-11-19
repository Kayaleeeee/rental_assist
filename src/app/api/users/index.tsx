import {
  UserListParams,
  UserPostPayload,
  UserType,
} from "@/app/types/userType";
import { apiGet, apiPost } from "..";
import { isEmpty } from "lodash";

const apiUrl = "/users";

export const registerUser = (payload: UserPostPayload) => {
  return apiPost(apiUrl, payload);
};

export const getUserList = (params?: UserListParams) => {
  return apiGet<UserType[]>(apiUrl, params);
};

export const getUserDetail = async (id: UserType["id"]) => {
  const result = await apiGet<UserType[]>(apiUrl, { id });

  if (isEmpty(result)) throw new Error("No data found");
  return result[0];
};
