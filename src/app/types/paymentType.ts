import { ListParamsType } from "./listType";
import {
  PaymentMethod,
  PaymentStatus,
  ReservationType,
} from "./reservationType";

export type PaymentSumUpPostPayload = {
  startDateParam: string;
  endDateParam: string;
  paymentStatusParam: string | null;
};

export type PaymentSumUpItem = {
  paymentStatus: PaymentStatus;
  totalAmount: number;
};

export type PaymentListSearchParams = ListParamsType<{
  paymentStatus?: string;
  userName?: string;
  paymentMethod?: string;
  order?: string;
  startDate?: string;
  endDate?: string;
}>;

export type PaymentListItemType = ReservationType & {
  paymentMethod: PaymentMethod | null;
};
