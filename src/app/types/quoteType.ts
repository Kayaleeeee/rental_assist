import { EquipmentDetailType } from "./equipmentType";

export type QuoteItemType = {
  id: number;
  quoteId: QuoteType["id"];
  equipmentId: EquipmentDetailType["id"];
  quantity: number;
  price: number;
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
};

export type QuotePostPayload = {
  userId?: number;
  guestName?: string;
  guestPhoneNumber?: string;
  discountPrice?: number;
  totalPrice: number;
  supplyPrice: number;
  startDate: string;
  endDate: string;
  createdBy: string;
};

export type QuoteItemPostPayload = {
  quoteId: QuoteType["id"];
  equipmentId: number;
  quantity: number;
  price: number;
}[];
