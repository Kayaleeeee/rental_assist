import {
  PaymentSumUpItem,
  PaymentSumUpPostPayload,
} from "@/app/types/paymentType";
import { apiPost } from "..";

export const getPaymentsSumUp = (payload: PaymentSumUpPostPayload) => {
  return apiPost<PaymentSumUpItem[]>("/rpc/calculate_total_amounts", payload);
};
