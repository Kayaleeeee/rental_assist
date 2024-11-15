import { QuotePostPayload, QuoteType } from "@/app/types/quoteType";
import { apiPost } from "..";

const apiUrl = "/quotes";

export const createQuote = async (payload: QuotePostPayload) => {
  const data = await apiPost<QuoteType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
  });

  return data[0];
};
