import { PaymentStatus } from "./reservationType";

export type PaymentSumUpPostPayload = {
  startDateParam: string;
  endDateParam: string;
  paymentStatusParam: string | null;
};

export type PaymentSumUpItem = {
  paymentStatus: PaymentStatus;
  totalAmount: number;
};
