import { User } from "@supabase/supabase-js";

export interface AdminUserType extends User {}

export type UserType = {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phoneNumber?: string;
  isBlackList?: boolean;
  memo?: string;
};

export type UserPostPayload = Omit<UserType, "id">;

export type UserListParams = {
  name?: string;
  phoneNumber?: string;
  email?: string;
};
