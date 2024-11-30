import {
  QuoteItemPostPayload,
  QuoteItemPutPayload,
  QuoteItemType,
  QuoteSetPayload,
  QuoteSetType,
} from "@/app/types/quoteType";
import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "..";

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

export const createQuoteSet = (payload: QuoteSetPayload) => {
  return apiPost("quote_sets", payload);
};

export const updateQuoteSet = (
  id: QuoteSetType["id"],
  payload: QuoteSetPayload
) => {
  return apiPatch("quote_sets", payload, { params: id });
};

export const deleteQuoteSet = (id: QuoteSetType["id"]) => {
  return apiDelete("quote_sets", { params: id });
};
