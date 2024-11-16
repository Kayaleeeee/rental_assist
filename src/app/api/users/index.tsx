import { UserPostPayload, UserType } from "@/app/types/userType";
import { apiGet, apiPost } from "..";

const apiUrl = "/users";

export const registerUser = (payload: UserPostPayload) => {
  return apiPost(apiUrl, payload);
};

export const getUserList = () => {
  return apiGet<UserType[]>(apiUrl);
};

export const getUserDetail = (id: number) => {
  return apiGet(apiUrl, { id });
};
