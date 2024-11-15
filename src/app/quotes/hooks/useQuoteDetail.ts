import { getQuoteDetail } from "@/app/api/quote";
import { QuoteDetailType, QuoteItemType } from "@/app/types/quoteType";
import { getDiffDays } from "@/app/utils/timeUtils";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useQuoteDetail = (id?: number) => {
  const [detail, setDetail] = useState<QuoteDetailType | null>(null);
  const [quoteItemList, setQuoteItemList] = useState<QuoteItemType[]>([]);

  const rentalDays = useMemo(() => {
    if (!detail) return 0;

    return getDiffDays(detail.startDate, detail.endDate);
  }, [detail]);

  const fetchDetail = useCallback(async (id: number) => {
    try {
      const result = await getQuoteDetail(id);
      setDetail(result);
      setQuoteItemList(result.quoteItems);
    } catch {
      setDetail(null);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchDetail(id);
  }, [fetchDetail, id]);

  return { detail, quoteItemList, rentalDays };
};
