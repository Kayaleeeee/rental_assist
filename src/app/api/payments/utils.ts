import { PaymentListSearchParams } from "@/app/types/paymentType";

import { isNil } from "lodash";

export const parsePaymentListParams = (
  query: any,
  params?: PaymentListSearchParams
) => {
  if (!params) return query;

  query = query.eq("status", "confirmed");

  if (params.paymentStatus) {
    query = query.eq("payment_status", params.paymentStatus);
  }

  if (params.userName) {
    query = query.ilike("user_name", `%${params.userName}%`);
  }

  if (params.paymentMethod) {
    query = query.eq("payment_method", params.paymentMethod);
  }

  if (!isNil(params.startDate) && !isNil(params.endDate)) {
    query = query.gte("start_date", params.startDate);
  }

  if (!isNil(params.endDate)) {
    query = query.lte("end_date", params.endDate);
  }

  return query.order("id", { ascending: false });
};
