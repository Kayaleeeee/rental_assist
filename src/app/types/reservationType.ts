import { QuoteItemType } from "./quoteType";

export type ReservationType = {
  id: number;
  createdAt: string;
  quoteId: QuoteItemType["id"];
  userId: number;
  updatedAt?: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
};

export enum ReservationStatus {
  pending = "대기중",
  confirmed = "확정",
  canceled = "취소됨",
}

export enum PaymentStatus {
  unpaid = "미결제",
  paid = "결제완료",
  refunded = "환불완료",
}

export type ReservationPostPayload = {
  quoteId: QuoteItemType["id"];
  userId: number;
};
