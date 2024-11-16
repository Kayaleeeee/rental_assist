import { User } from "@supabase/supabase-js";

export interface AdminUserType extends User {}

export type UserType = {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phoneNumber?: string;
};

export type UserPostPayload = Omit<UserType, "id">;
