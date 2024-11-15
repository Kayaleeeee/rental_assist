import { EquipmentDetailType } from "./equipmentType";

export type QuoteItemType = {
  id: number;
  quoteId: QuoteType["id"];
  equipmentId: EquipmentDetailType["id"];
  equipmentName: EquipmentDetailType["title"];
  quantity: number;
  price: number;
};

export type QuoteType = {
  id: number;
  title: string;
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

export type QuoteDetailType = QuoteType & {
  userName: string;
  quoteItems: QuoteItemType[];
};

export type QuoteListParams = {
  userId?: number;
  guestPhoneNumber?: string;
};

export type QuotePostPayload = {
  title: string;
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
