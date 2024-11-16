import { getQuoteDetail } from "@/app/api/quote";
import { QuoteDetailType, QuoteItemType } from "@/app/types/quoteType";
import { getDiffDays } from "@/app/utils/timeUtils";
import { showToast } from "@/app/utils/toastUtils";
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

  const createReservation = useCallback(async () => {
    try {
    } catch {
      showToast({
        message: "예약 생성에 실패했습니다.",
        type: "error",
      });
    }
  }, []);

  return { detail, quoteItemList, rentalDays };
};
