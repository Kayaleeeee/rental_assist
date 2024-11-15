import { getQuoteList } from "@/app/api/quote";
import { QuoteListParams, QuoteType } from "@/app/types/quoteType";
import { useCallback, useEffect, useState } from "react";

export const useQuoteList = () => {
  const [list, setList] = useState<QuoteType[]>([]);

  const fetchList = useCallback(async (params?: QuoteListParams) => {
    try {
      const result = await getQuoteList(params);
      setList(result);
    } catch {
      setList([]);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { list };
};
