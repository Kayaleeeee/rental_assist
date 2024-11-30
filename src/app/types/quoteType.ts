import { EquipmentDetailType } from "./equipmentType";
import { ReservationType } from "./reservationType";
import { UserType } from "./userType";

export type QuoteItemType = {
  id: number;
  quoteId: QuoteType["id"];
  equipmentId: EquipmentDetailType["id"];
  equipmentName: EquipmentDetailType["title"];
  quantity: number;
  price: number;
  discountPrice?: number;
  totalPrice: number;
};

export type QuoteType = {
  id: number;
  createdAt: string;
  userId?: number;
  guestName?: string;
  guestPhoneNumber?: string;
  discountPrice?: number;
  totalPrice: number;
  supplyPrice: number;
  startDate: string;
  endDate: string;
  reservationId?: ReservationType["id"];
};

export type QuoteDetailType = QuoteType & {
  userName: string;
  quoteItems: QuoteItemType[];
};

export type QuoteListParams = {
  userId?: number;
  guestPhoneNumber?: string;
};

export type QuotePostPayload = {
  userId?: UserType["id"];
  guestName?: UserType["name"];
  guestPhoneNumber?: UserType["phoneNumber"];
  discountPrice?: number;
  totalPrice: number;
  supplyPrice: number;
  startDate: string;
  endDate: string;
  createdBy?: string;
  reservationId?: ReservationType["id"];
};

export type QuoteItemPostPayload = {
  quoteId: QuoteType["id"];
  equipmentId: number;
  quantity: number;
  price: number;
}[];

export type QuoteItemPutPayload = {
  equipmentId?: number;
  quantity?: number;
  price?: number;
  quoteId: number;
};
