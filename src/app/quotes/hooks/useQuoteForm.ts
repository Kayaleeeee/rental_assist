import { createQuote } from "@/app/api/quote";
import { createQuoteItemList } from "@/app/api/quoteItems";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { QuoteItemPostPayload, QuotePostPayload } from "@/app/types/quoteType";
import { createClient } from "@/app/utils/supabase/client";
import { getDiffDays } from "@/app/utils/timeUtils";
import { showToast } from "@/app/utils/toastUtils";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export type QuotItemStateType = {
  equipmentId: number;
  title: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

type QuotePostStateType = {
  title: string;
  userId?: number;
  guestName: string;
  guestPhoneNumber: string;
  discountPrice: number;
  startDate: string | null;
  endDate: string | null;
};

export const useQuoteForm = () => {
  const router = useRouter();
  const [form, setForm] = useState<QuotePostStateType>({
    title: "",
    guestName: "",
    guestPhoneNumber: "",
    discountPrice: 0,
    startDate: null,
    endDate: null,
  });

  const [quoteItemListState, setQuoteItemListState] = useState<
    QuotItemStateType[]
  >([]);

  const rentalDays = useMemo(() => {
    if (!form.endDate || !form.startDate) return 0;

    return getDiffDays(form.startDate, form.endDate);
  }, [form.startDate, form.endDate]);

  const totalPrice = useMemo(() => {
    if (!rentalDays) return 0;

    const sumOfPrice = quoteItemListState.reduce(
      (prev, acc) => (prev += acc.totalPrice),
      0
    );
    return sumOfPrice - form.discountPrice;
  }, [quoteItemListState, rentalDays, form.discountPrice]);

  const totalSupplyPrice = useMemo(() => {
    if (!rentalDays) return 0;

    const sumOfPrice = quoteItemListState.reduce(
      (prev, acc) => (prev += acc.price * rentalDays * acc.quantity),
      0
    );
    return sumOfPrice - form.discountPrice;
  }, [quoteItemListState, rentalDays, form.discountPrice]);

  const onChangeForm = (
    key: keyof QuotePostStateType,
    value: QuotePostStateType[keyof QuotePostStateType]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onChangeQuoteItem = (
    equipmentId: number,
    quoteItem: QuotItemStateType
  ) => {
    setQuoteItemListState((prev) =>
      prev.map((item) => (item.equipmentId === equipmentId ? quoteItem : item))
    );
  };

  const onDeleteQuoteItem = (equipmentId: number) => {
    setQuoteItemListState((prev) =>
      prev.filter((item) => item.equipmentId !== equipmentId)
    );
  };

  const onAddQuoteItemList = useCallback(
    (list: EquipmentListItemType[]) => {
      const convertedList: QuotItemStateType[] = list.map((item) => {
        return {
          equipmentId: item.id,
          title: item.title,
          price: item.price,
          quantity: 1,
          totalPrice: item.price * rentalDays,
        };
      });

      setQuoteItemListState((prev) => [...prev, ...convertedList]);
    },
    [rentalDays]
  );

  const onCreateQuote = useCallback(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (!form.startDate || !form.endDate) return;

    try {
      const payload: QuotePostPayload = {
        ...form,
        totalPrice,
        supplyPrice: totalSupplyPrice,
        startDate: form.startDate,
        endDate: form.endDate,
        createdBy: user.id,
      };

      const result = await createQuote(payload);

      const quoteItemList: QuoteItemPostPayload = quoteItemListState.map(
        (item) => ({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
          price: item.price,
          quoteId: result.id,
        })
      );

      await createQuoteItemList(quoteItemList);
      showToast({
        message: "견적서가 생성되었습니다.",
        type: "success",
      });

      router.replace("/quotes");
    } catch {
      showToast({
        message: "견적서 생성에 오류가 발생했습니다.",
        type: "error",
      });
    }
  }, [form, quoteItemListState, totalPrice, totalSupplyPrice, router]);

  return {
    form,
    onChangeForm,
    onChangeQuoteItem,
    onDeleteQuoteItem,
    quoteItemListState,
    onAddQuoteItemList,
    rentalDays,
    onCreateQuote,
    totalPrice,
    totalSupplyPrice,
  };
};
