import { QuoteItemPostPayload, QuoteItemType } from "@/app/types/quoteType";
import { apiGet, apiPost } from "..";

const apiUrl = "/quote_items";

export const createQuoteItemList = (payload: QuoteItemPostPayload) => {
  return apiPost(apiUrl, payload);
};

export const getQuoteItemList = (quoteId: number) => {
  return apiGet<QuoteItemType[]>(apiUrl, { quoteId });
};
