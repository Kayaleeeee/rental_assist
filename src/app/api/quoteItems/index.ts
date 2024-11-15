import { QuoteItemPostPayload } from "@/app/types/quoteType";
import { apiGet, apiPost } from "..";

const apiUrl = "/quote_items";

export const createQuoteItemList = (payload: QuoteItemPostPayload) => {
  return apiPost(apiUrl, payload);
};

export const getQuoteItemList = () => {
  return apiGet(apiUrl);
};
