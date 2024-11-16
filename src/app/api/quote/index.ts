import {
  QuoteDetailType,
  QuoteListParams,
  QuotePostPayload,
  QuoteType,
} from "@/app/types/quoteType";
import { apiGet, apiPost } from "..";

const apiUrl = "/quotes";
const detailUrl = "/quote_detail";

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

export const getQuoteDetail = async (id: number) => {
  const result = await apiGet<QuoteDetailType[]>(detailUrl, { id });
  return result[0];
};
