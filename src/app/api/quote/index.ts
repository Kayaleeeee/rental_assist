import {
  QuoteDetailType,
  QuoteListParams,
  QuotePostPayload,
  QuoteType,
} from "@/app/types/quoteType";
import { apiGet, apiPatch, apiPost } from "..";
import { isEmpty } from "lodash";

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
  const data = await apiPatch<QuoteType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
    params: { id },
  });

  if (isEmpty(data)) {
    throw new Error("no data found");
  } else {
    return data[0];
  }
};
