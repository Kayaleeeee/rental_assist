import { UserListParams } from "@/app/types/userType";

export const parseReservationListParams = (
  query: any,
  params?: UserListParams
) => {
  if (!params) return query;

  if (params.name) {
    query = query.ilike("name", `%${params.name}%`);
  }

  if (params.phoneNumber) {
    query = query.eq("phone_number", params.phoneNumber);
  }

  return query.order("id", { ascending: false });
};
