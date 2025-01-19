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
    query = query.ilike("userName", `%${params.userName}%`);
  }

  if (!isNil(params.startDate) && !isNil(params.endDate)) {
    //   query = query.eq("disabled", params.disabled);
  }

  // if (params.order) {
  //   query = query.order(params.order, {
  //     ascending: params.order === "asc",
  //   });
  // }

  return query.order("id", { ascending: false });
};
