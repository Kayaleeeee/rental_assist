import { ReservationSearchParams } from "@/app/types/reservationType";
import { isNil } from "lodash";

export const parseReservationListParams = (
  query: any,
  params?: ReservationSearchParams
) => {
  if (!params) return query;

  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.userName) {
    query = query.ilike("user_name", `%${params.userName}%`);
  }

  if (params.userId) {
    query = query.eq("user_id", params.userId);
  }

  if (!isNil(params.startDate) && !isNil(params.endDate)) {
    query = query.gte("start_date", params.startDate);
  }

  if (!isNil(params.endDate)) {
    query = query.lte("end_date", params.endDate);
  }

  return query.order("id", { ascending: false });
};
