import { updateQuote } from "@/app/api/quote";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { QuoteItemPostPayload } from "@/app/types/quoteType";
import { ReservationFormState } from "../hooks/useReservationForm";
import { getValidReservationForm } from "../utils/reservationUtils";
import { createQuoteItemList, deleteQuoteItemList } from "@/app/api/quoteItems";
import { showToast } from "@/app/utils/toastUtils";

export const onUpdateReservation = async ({
  quoteId,
  reservationId,
  form,
  dateRange,
  originQuoteItemList,
  equipmentItemList,
  groupEquipmentList,
}: {
  quoteId: number;
  reservationId: number;
  originQuoteItemList: EquipmentListItemState[];
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

  const removedQuoteItemList = originQuoteItemList
    .map((item) => item.id)
    .join(",");

  try {
    const quoteResult = await updateQuote(quoteId, validForm);

    const quoteItemList: QuoteItemPostPayload = equipmentItemList.map(
      (item) => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity,
        price: item.price,
        quoteId: quoteResult.id,
        totalPrice: item.totalPrice,
        discountPrice: item.discountPrice,
      })
    );

    await deleteQuoteItemList(removedQuoteItemList);

    await createQuoteItemList(quoteItemList);
    showToast({
      message: "예약이 수정되었습니다.",
      type: "success",
    });

    return { reservationId };
  } catch {
    showToast({
      message: "예약 생성에 오류가 발생했습니다.",
      type: "error",
    });
  }
};
