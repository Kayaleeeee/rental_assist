import {
  QuoteListParams,
  QuotePostPayload,
  QuoteType,
} from "@/app/types/quoteType";
import { apiGet, apiPost } from "..";

const apiUrl = "/quotes";

export const createQuote = async (payload: QuotePostPayload) => {
  const data = await apiPost<QuoteType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
  });

  return data[0];
};

export const getQuoteList = (params?: QuoteListParams) => {
  return apiGet<QuoteType[]>(apiUrl, params);
};
