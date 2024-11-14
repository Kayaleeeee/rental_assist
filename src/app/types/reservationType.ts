import { QuoteItemType } from "./quoteType";

export type ReservationType = {
  id: number;
  createdAt: string;
  quoteId: QuoteItemType["id"];
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  supplyPrice: number;
  discountPrice?: number;
  updatedAt?: string;
  status: ReservationStatus;
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
