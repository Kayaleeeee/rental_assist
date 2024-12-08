import {
  QuoteItemPostPayload,
  QuoteItemPutPayload,
  QuoteItemType,
  QuoteSetPayload,
  QuoteSetType,
} from "@/app/types/quoteType";
import { apiDelete, apiGet, apiPatch, apiPost } from "..";

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
  return apiPatch(`${apiUrl}`, payload, { params: { id } });
};

export const deleteQuoteItemList = (idList: string) => {
  return apiDelete(apiUrl, { params: { id: `in.(${idList})` } });
};

export const createQuoteSet = (payload: QuoteSetPayload[]) => {
  return apiPost<QuoteSetType[]>("quote_sets", payload, {
    headers: {
      Prefer: "return=representation",
    },
  });
};

export const updateQuoteSet = (
  id: QuoteSetType["id"],
  payload: Partial<QuoteSetPayload>
) => {
  return apiPatch("quote_sets", payload, { params: { id } });
};

export const deleteQuoteSetList = (idList: string) => {
  return apiDelete("quote_sets", { params: { id: `in.(${idList})` } });
};
