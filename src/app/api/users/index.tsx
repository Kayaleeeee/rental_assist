import {
  UserListParams,
  UserPostPayload,
  UserType,
} from "@/app/types/userType";
import { apiGet, apiPatch, apiPost } from "..";
import { isEmpty } from "lodash";
import { fetchListHandler } from "../shared/utils/fecthListHandler";
import { parseReservationListParams } from "./utils";

const apiUrl = "/users";

export const registerUser = (payload: UserPostPayload) => {
  return apiPost(apiUrl, payload);
};

export const getUserList = (params?: UserListParams) => {
  return fetchListHandler<UserType>(
    "users",
    params,
    parseReservationListParams
  );
};

export const getUserDetail = async (id: UserType["id"]) => {
  const result = await apiGet<UserType[]>(apiUrl, { id });

  if (isEmpty(result)) throw new Error("No data found");
  return result[0];
};

export const patchUser = async (
  id: UserType["id"],
  payload: UserPostPayload
) => {
  return apiPatch<UserType[]>(apiUrl, payload, { params: { id } });
};
