import {
  PaymentListItemType,
  PaymentListSearchParams,
  PaymentSumUpItem,
  PaymentSumUpPostPayload,
} from "@/app/types/paymentType";
import { apiPost } from "..";
import { fetchListHandler } from "../shared/utils/fecthListHandler";
import { parsePaymentListParams } from "./utils";

export const getPaymentList = (params?: PaymentListSearchParams) => {
  return fetchListHandler<PaymentListItemType>(
    "payment_list",
    params,
    parsePaymentListParams
  );
};

export const getPaymentsSumUp = (payload: PaymentSumUpPostPayload) => {
  return apiPost<PaymentSumUpItem[]>("/rpc/calculate_total_amounts", payload);
};
