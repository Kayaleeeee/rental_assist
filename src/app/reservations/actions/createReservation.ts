import { createQuote, updateQuote } from "@/app/api/quote";
import { QuoteItemPostPayload } from "@/app/types/quoteType";
import { getValidReservationForm } from "../utils/reservationUtils";
import { ReservationFormState } from "../hooks/useReservationForm";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { createQuoteItemList } from "@/app/api/quoteItems";
import { showToast } from "@/app/utils/toastUtils";
import { postReservation } from "@/app/api/reservation";

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
  const validForm = await getValidReservationForm({
    form,
    dateRange,
    equipmentItemList,
    groupEquipmentList,
  });

  if (!validForm) return;

  try {
    // quote 생성
    const quoteResult = await createQuote(validForm);

    const quoteItemList: QuoteItemPostPayload = equipmentItemList.map(
      (item) => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        price: item.price,
        quoteId: quoteResult.id,
      })
    );

    //quote 종속 item list 생성
    await createQuoteItemList(quoteItemList);
    showToast({
      message: "예약이 생성되었습니다.",
      type: "success",
    });

    //생성된 quote로 reservation 생성
    const reservationResult = await postReservation({
      userId: Number(form.userId),
      quoteId: quoteResult.id,
    });

    if (!reservationResult) throw new Error("예약 생성 실패");

    // 생성ㅅ된 Resrvation으로 quote reservation.id 업데이트
    await updateQuote(quoteResult.id, {
      reservationId: reservationResult.id,
    });

    return { reservationId: reservationResult.id };
  } catch {
    showToast({
      message: "예약 생성에 오류가 발생했습니다.",
      type: "error",
    });
  }
};
