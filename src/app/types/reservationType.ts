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
  paymentMethod?: PaymentMethod;
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

export enum PaymentMethod {
  card = "card",
  cash = "cash",
  bank_transfer = "bank_transfer",
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
  paymentMethod?: PaymentMethod;
};

export type ReservationSearchParams = {
  status?: string;
  userName?: string;
};

export type ReservationPutPayload = {
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
};
