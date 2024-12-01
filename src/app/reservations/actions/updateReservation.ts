import { updateQuote } from "@/app/api/quote";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { ReservationFormState } from "../hooks/useReservationForm";
import { getValidReservationForm } from "../utils/reservationUtils";
import {
  createQuoteItemList,
  createQuoteSet,
  deleteQuoteItemList,
  deleteQuoteSetList,
} from "@/app/api/quoteItems";

import { isEmpty } from "lodash";
import { QuoteItemPostPayload, QuoteSetPayload } from "@/app/types/quoteType";

export const onUpdateReservation = async ({
  quoteId,
  reservationId,
  form,
  dateRange,
  originQuoteItemList,
  originSetList,
  equipmentItemList,
  groupEquipmentList,
}: {
  quoteId: number;
  reservationId: number;
  originQuoteItemList: EquipmentListItemState[];
  originSetList: SetEquipmentStateType[];
  form: ReservationFormState;
  dateRange: { startDate?: string; endDate?: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
}) => {
  try {
    const validForm = await getValidReservationForm({
      form,
      dateRange,
      equipmentItemList,
      groupEquipmentList,
    });

    if (!validForm) throw new Error("form validation 실패");

    const removedQuoteItemList = originQuoteItemList
      .map((item) => item.equipmentId)
      .join(",");
    const removeSetList = originSetList.map((item) => item.id).join(",");

    const { quoteItemList, quoteGroupList } = prepareQuoteData(
      equipmentItemList,
      groupEquipmentList,
      quoteId
    );

    // 오리지널 set item, item list 제거
    await Promise.all([
      !isEmpty(originQuoteItemList) &&
        deleteQuoteItemList(removedQuoteItemList),
      !isEmpty(quoteItemList) && createQuoteItemList(quoteItemList),
    ]);

    await Promise.all([
      !isEmpty(originSetList) && deleteQuoteSetList(removeSetList),
      !isEmpty(quoteGroupList) && createQuoteSet(quoteGroupList),
    ]);

    // quote update
    await updateQuote(quoteId, validForm);

    return { reservationId };
  } catch (error) {
    throw error;
  }
};

// Helper 함수로 데이터 준비 로직 분리
const prepareQuoteData = (
  equipmentItemList: EquipmentListItemState[],
  groupEquipmentList: SetEquipmentStateType[],
  quoteId: number
) => {
  const quoteItemList: QuoteItemPostPayload = [];
  const quoteGroupList: QuoteSetPayload = [];

  // 개별 장비 처리
  if (!isEmpty(equipmentItemList)) {
    equipmentItemList.forEach((item) => {
      quoteItemList.push({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        quoteId,
        setId: null,
      });
    });
  }

  // 그룹 장비 처리
  if (!isEmpty(groupEquipmentList)) {
    groupEquipmentList.forEach((item) => {
      quoteGroupList.push({
        setId: item.id,
        quoteId,
        price: item.price,
        totalPrice: item.totalPrice,
      });

      item.equipmentList.forEach((equipment) => {
        quoteItemList.push({
          equipmentId: equipment.equipmentId,
          quantity: equipment.quantity,
          price: 0,
          quoteId,
          totalPrice: item.totalPrice,
          setId: item.id,
        });
      });
    });
  }

  return { quoteItemList, quoteGroupList };
};
