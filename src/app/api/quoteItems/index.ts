import {
  QuoteItemPostPayload,
  QuoteItemPutPayload,
  QuoteItemType,
} from "@/app/types/quoteType";
import { apiDelete, apiGet, apiPost, apiPut } from "..";

const apiUrl = "/quote_items";

export const createQuoteItemList = (payload: QuoteItemPostPayload) => {
  return apiPost(apiUrl, payload);
};

export const getQuoteItemList = (quoteId: number) => {
  return apiGet<QuoteItemType[]>(apiUrl, { quoteId });
};

export const updateQuoteItem = (
  id: QuoteItemType["id"],
  payload: QuoteItemPutPayload
) => {
  return apiPut(`${apiUrl}/${id}`, payload);
};

export const deleteQuoteItemList = (idList: string) => {
  return apiDelete(apiUrl, { params: { id: `in.(${idList})` } });
};
