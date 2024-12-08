import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "../store/useCartStore";
import { EquipmentListItemType, SetEquipmentType } from "./equipmentType";
import { ListParamsType } from "./listType";
import { QuoteItemType, QuoteSetType } from "./quoteType";
import { UserType } from "./userType";

export type ReservationType = {
  id: number;
  createdAt: string;
  updatedAt?: string;
  quoteId: QuoteItemType["id"];
  userId: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  startDate: string;
  endDate: string;
  userName: string;
  memo?: string;
  paymentMethod?: PaymentMethod;
  rounds: number;
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

export type ReservationDetailResponse = ReservationType & {
  quoteId: QuoteItemType["id"];
  quoteTitle: string;
  createdBy: string;
  userId: UserType["id"];
  phoneNumber: UserType["phoneNumber"];
  supplyPrice: number;
  discountPrice?: number;
  totalPrice: number;
  paymentMethod?: PaymentMethod;
  equipmentList: QuoteItemType[];
  setList: {
    id: QuoteSetType["id"];
    title: SetEquipmentType["title"];
    price: SetEquipmentType["price"];
    discountedPrice: number;
    totalPrice: number;
    equipmentList: QuoteItemType[];
    setId: SetEquipmentType["id"];
  }[];
};

export type ReservationDetailStateType = ReservationType & {
  quoteId: QuoteItemType["id"];
  quoteTitle: string;
  createdBy: string;
  userId: UserType["id"];
  phoneNumber: UserType["phoneNumber"];
  supplyPrice: number;
  discountPrice?: number;
  totalPrice: number;
  paymentMethod?: PaymentMethod;
  equipmentList: EquipmentListItemState[];
  setList: SetEquipmentStateType[];
};

export type ReservationSearchParams = ListParamsType<{
  status?: string;
  userName?: string;
  userId?: UserType["id"];
  order?: string;
  startDate?: string;
  endDate?: string;
}>;

export type ReservationPutPayload = {
  status?: ReservationStatus;
  paymentStatus?: PaymentStatus;
};

export type EquipmentAvailabilityPostPayload = {
  paramStartDate: string;
  paramEndDate: string;
  equipmentList: {
    id: EquipmentListItemType["id"];
    quantity: EquipmentListItemType["quantity"];
  }[];
};

export type EquipmentAvailableItem = {
  id: EquipmentListItemType["id"];
  isAvailable: boolean;
  requestedQuantity: number;
};

export type UpdatedEquipmentAvailabilityPostPayload =
  EquipmentAvailabilityPostPayload & {
    paramQuoteId: QuoteItemType["id"];
  };
