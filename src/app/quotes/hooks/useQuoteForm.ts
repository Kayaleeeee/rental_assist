import { EquipmentListItemType } from "@/app/types/equipmentType";
import { useState } from "react";

export type QuotItemStateType = {
  equipmentId: number;
  title: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

type QuotePostStateType = {
  userId?: number;
  guestName: string;
  guestPhoneNumber: string;
  discountPrice?: number;
  totalPrice: number;
  supplyPrice: number;
  startDate: string | null;
  endDate: string | null;
};

export const useQuoteForm = () => {
  const [form, setForm] = useState<QuotePostStateType>({
    guestName: "",
    guestPhoneNumber: "",
    discountPrice: 0,
    totalPrice: 0,
    supplyPrice: 0,
    startDate: null,
    endDate: null,
  });

  const [quoteItemListState, setQuoteItemListState] = useState<
    QuotItemStateType[]
  >([]);

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

  const onAddQuoteItemList = (list: EquipmentListItemType[]) => {
    const convertedList: QuotItemStateType[] = list.map((item) => {
      return {
        equipmentId: item.id,
        title: item.title,
        price: item.price,
        quantity: 1,
        totalPrice: item.price,
      };
    });

    setQuoteItemListState((prev) => [...prev, ...convertedList]);
  };

  return {
    form,
    onChangeForm,
    onChangeQuoteItem,
    onDeleteQuoteItem,
    quoteItemListState,
    onAddQuoteItemList,
  };
};
