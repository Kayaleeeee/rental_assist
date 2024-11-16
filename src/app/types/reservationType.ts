import { QuoteItemType } from "./quoteType";
import { UserType } from "./userType";

export type ReservationType = {
  id: number;
  createdAt: string;
  quoteId: QuoteItemType["id"];
  userId: number;
  updatedAt?: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  startDate: string;
  endDate: string;
  userName: string;
};

export enum ReservationStatus {
  pending = "pending",
  confirmed = "confirmed",
  canceled = "canceled",
}

export enum PaymentStatus {
  unpaid = "unpaid",
  paid = "paid",
  refunded = "refunded",
}

export type ReservationPostPayload = {
  quoteId: QuoteItemType["id"];
  userId?: number;
};

export type ReservationDetailType = ReservationType & {
  quoteItems: QuoteItemType[];
  quoteId: QuoteItemType["id"];
  quoteTitle: string;
  createdBy: string;
  userId: UserType["id"];
  phoneNumber: UserType["phoneNumber"];
  supplyPrice: number;
  discountPrice?: number;
};
