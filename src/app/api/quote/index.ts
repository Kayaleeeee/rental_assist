import {
  QuoteDetailType,
  QuoteListParams,
  QuotePostPayload,
  QuoteType,
} from "@/app/types/quoteType";
import { apiGet, apiPatch, apiPost } from "..";

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

export const updateQuote = async (
  id: number,
  payload: Partial<QuotePostPayload>
) => {
  console.log(payload, id);
  const data = await apiPatch<QuoteType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
    params: { id },
  });

  return data[0];
};
