import { createQuote, updateQuote } from "@/app/api/quote";
import { QuoteItemPostPayload, QuoteSetPayload } from "@/app/types/quoteType";
import { getValidReservationForm } from "../utils/reservationUtils";
import { ReservationFormState } from "../hooks/useReservationForm";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { createQuoteItemList, createQuoteSet } from "@/app/api/quoteItems";
import { postReservation } from "@/app/api/reservation";
import { isEmpty } from "lodash";

export const onCreateReservation = async ({
  form,
  dateRange,
  equipmentItemList,
  groupEquipmentList,
}: {
  form: ReservationFormState;
  dateRange: { startDate?: string; endDate?: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
}) => {
  try {
    // 유효한 예약 데이터 확인
    const validForm = await getValidReservationForm({
      form,
      dateRange,
      equipmentItemList,
      groupEquipmentList,
    });

    if (!validForm) return;

    // quote 생성
    const quoteResult = await createQuote(validForm);
    if (!quoteResult) throw new Error("견적 생성 실패");

    const { quoteItemList, quoteGroupList } = prepareQuoteData(
      equipmentItemList,
      groupEquipmentList,
      quoteResult.id
    );

    // 병렬로 데이터 생성
    await Promise.all([
      !isEmpty(quoteGroupList) && createQuoteSet(quoteGroupList),
      createQuoteItemList(quoteItemList),
    ]);

    // 예약 생성
    const reservationResult = await postReservation({
      userId: Number(form.userId),
      quoteId: quoteResult.id,
    });

    if (!reservationResult) throw new Error("예약 생성 실패");

    // quote에 reservationId 업데이트
    await updateQuote(quoteResult.id, {
      reservationId: reservationResult.id,
    });

    return { reservationId: reservationResult.id };
  } catch (error) {
    console.error("예약 생성 중 오류:", error);
    throw error; // 호출하는 곳에서 추가 처리 가능
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
          setId: item.id,
        });
      });
    });
  }

  return { quoteItemList, quoteGroupList };
};
