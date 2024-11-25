import { createQuote, updateQuote } from "@/app/api/quote";
import { createQuoteItemList } from "@/app/api/quoteItems";
import { postReservation } from "@/app/api/reservation";
import { EquipmentListItemState, useCartStore } from "@/app/store/useCartStore";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { QuoteItemPostPayload, QuotePostPayload } from "@/app/types/quoteType";
import { createClient } from "@/app/utils/supabase/client";

import { getDiffDays } from "@/app/utils/timeUtils";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type QuotePostStateType = {
  userId?: string;
  guestName: string;
  guestPhoneNumber: string;
  discountPrice: number;
};

export const useQuoteForm = () => {
  const {
    list: quoteItemListState,
    dateRange,
    onChangeDate,
    removeEquipment,
    setList: setQuoteItemListState,
    resetCart,
    setDateRange,
  } = useCartStore();

  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState<QuotePostStateType>({
    userId: undefined,
    guestName: "",
    guestPhoneNumber: "",
    discountPrice: 0,
  });

  const rentalDays = useMemo(() => {
    if (!dateRange.endDate || !dateRange.startDate) return 0;

    return getDiffDays(dateRange.startDate, dateRange.endDate);
  }, [dateRange.startDate, dateRange.endDate]);

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
    quoteItem: EquipmentListItemState
  ) => {
    setQuoteItemListState(
      quoteItemListState.map((item) =>
        item.equipmentId === equipmentId ? quoteItem : item
      )
    );
  };

  const onDeleteQuoteItem = (equipmentId: number) => {
    removeEquipment(equipmentId);
  };

  const onAddQuoteItemList = useCallback(
    (list: EquipmentListItemType[]) => {
      const convertedList: EquipmentListItemState[] = list.map((item) => {
        return {
          equipmentId: item.id,
          title: item.title,
          price: item.price,
          quantity: 1,
          totalPrice: item.price * rentalDays,
        };
      });

      setQuoteItemListState([...quoteItemListState, ...convertedList]);
    },
    [rentalDays, quoteItemListState, setQuoteItemListState]
  );

  const onCreateQuote = useCallback(async () => {
    const {
      data: { user: writer },
    } = await supabase.auth.getUser();

    if (!writer) return;

    if (!form.userId) {
      showToast({
        message: "회원을 선택해주세요.",
        type: "error",
      });
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      showToast({
        message: "대여일정을 선택해주세요.",
        type: "error",
      });
      return;
    }

    if (isEmpty(quoteItemListState)) {
      showToast({
        message: "장비를 선택해주세요.",
        type: "error",
      });
      return;
    }

    try {
      const payload: QuotePostPayload = {
        ...form,
        totalPrice,
        supplyPrice: totalSupplyPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        createdBy: writer.id,
      };

      const quoteResult = await createQuote(payload);

      const quoteItemList: QuoteItemPostPayload = quoteItemListState.map(
        (item) => ({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
          price: item.price,
          quoteId: quoteResult.id,
        })
      );

      await createQuoteItemList(quoteItemList);
      showToast({
        message: "예약이 생성되었습니다.",
        type: "success",
      });

      const reservationResult = await postReservation({
        userId: Number(form.userId),
        quoteId: quoteResult.id,
      });

      if (!reservationResult) throw new Error("예약 생성 실패");

      await updateQuote(quoteResult.id, {
        reservationId: reservationResult.id,
      });

      router.replace(`/reservations/${reservationResult.id}`);
    } catch {
      showToast({
        message: "예약 생성에 오류가 발생했습니다.",
        type: "error",
      });
    }
  }, [
    form,
    dateRange,
    quoteItemListState,
    totalPrice,
    totalSupplyPrice,
    router,
  ]);

  const onEditQuote = useCallback(
    async (quoteId: number, reservationId: number) => {
      const {
        data: { user: writer },
      } = await supabase.auth.getUser();

      if (!writer) return;

      if (!form.userId) {
        showToast({
          message: "회원을 선택해주세요.",
          type: "error",
        });
        return;
      }

      if (!dateRange.startDate || !dateRange.endDate) {
        showToast({
          message: "대여일정을 선택해주세요.",
          type: "error",
        });
        return;
      }

      if (isEmpty(quoteItemListState)) {
        showToast({
          message: "장비를 선택해주세요.",
          type: "error",
        });
        return;
      }

      try {
        const payload: QuotePostPayload = {
          ...form,
          totalPrice,
          supplyPrice: totalSupplyPrice,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          createdBy: writer.id,
        };

        const quoteResult = await updateQuote(quoteId, payload);

        const quoteItemList: QuoteItemPostPayload = quoteItemListState.map(
          (item) => ({
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            price: item.price,
            quoteId: quoteResult.id,
          })
        );

        await createQuoteItemList(quoteItemList);
        showToast({
          message: "예약이 수정되었습니다.",
          type: "success",
        });

        router.replace(`/reservations/${reservationId}`);
      } catch {
        showToast({
          message: "예약 생성에 오류가 발생했습니다.",
          type: "error",
        });
      }
    },
    [form, dateRange, quoteItemListState, totalPrice, totalSupplyPrice, router]
  );

  return {
    form,
    setForm,
    onChangeForm,
    onChangeQuoteItem,
    onDeleteQuoteItem,
    quoteItemListState,
    setQuoteItemListState,
    onAddQuoteItemList,
    rentalDays,
    onCreateQuote,
    onEditQuote,
    totalPrice,
    totalSupplyPrice,
    resetCart,
    onChangeDate,
    dateRange,
    setDateRange,
  };
};
