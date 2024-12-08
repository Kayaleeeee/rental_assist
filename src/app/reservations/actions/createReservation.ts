import { createQuote, updateQuote } from "@/app/api/quote";
import { QuoteItemPostPayload } from "@/app/types/quoteType";
import {
  checkEquipmentAvailability,
  getEquipmentGroupTotalPrice,
  getEquipmentTotalPrice,
  getValidReservationForm,
} from "../utils/reservationUtils";

import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { createQuoteItemList, createQuoteSet } from "@/app/api/quoteItems";
import { postReservation } from "@/app/api/reservation";
import { isEmpty } from "lodash";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import { ReservationFormState } from "../hooks/useReservationForms";

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
}): Promise<
  | {
      isAvailable: false;
      checkedList: EquipmentAvailableItem[];
      reservationId: null;
    }
  | { reservationId: number }
> => {
  try {
    // 유효한 예약 데이터 확인
    const validForm = await getValidReservationForm({
      form,
      dateRange,
      equipmentItemList,
      groupEquipmentList,
    });

    if (!validForm) throw new Error("form validation 실패");

    const { isAvailable, checkedList } = await checkEquipmentAvailability({
      dateRange: { startDate: validForm.startDate, endDate: validForm.endDate },
      equipmentItemList,
      groupEquipmentList,
    });

    if (!isAvailable) {
      return {
        reservationId: null,
        isAvailable,
        checkedList,
      };
    }

    // quote 생성
    const quoteResult = await createQuote(validForm);
    if (!quoteResult) throw new Error("견적 생성 실패");

    if (!isEmpty(equipmentItemList)) {
      const payload: QuoteItemPostPayload = equipmentItemList.map((item) => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: getEquipmentTotalPrice({
          itemPrice: item.price,
          quantity: item.quantity,
          discountPrice: item.discountPrice,
        }),
        quoteId: quoteResult.id,
        quoteSetId: null,
        setId: null,
      }));

      await createQuoteItemList(payload);
    }

    if (!isEmpty(groupEquipmentList)) {
      groupEquipmentList.forEach(async (set) => {
        const result = await createQuoteSet([
          {
            setId: set.setId,
            quoteId: quoteResult.id,
            price: set.price,
            totalPrice: getEquipmentGroupTotalPrice({
              price: set.price,
              discountPrice: set.discountPrice,
            }),
            discountPrice: set.discountPrice || 0,
          },
        ]);

        if (isEmpty(result)) throw new Error("quote set 생성 실패");

        const quoteItemPayload = set.equipmentList.map((item) => ({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
          price: 0,
          totalPrice: 0,
          quoteId: quoteResult.id,
          quoteSetId: result[0].id,
          setId: set.setId,
        }));

        await createQuoteItemList(quoteItemPayload);
      });
    }

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
    throw error;
  }
};
