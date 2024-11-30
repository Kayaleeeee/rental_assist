import { createQuote, updateQuote } from "@/app/api/quote";
import { QuoteItemPostPayload } from "@/app/types/quoteType";
import { getValidReservationForm } from "../utils/reservationUtils";
import { ReservationFormState } from "../hooks/useReservationForm";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { createQuoteItemList } from "@/app/api/quoteItems";
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

  // quote 생성
  const quoteResult = await createQuote(validForm);

  const quoteItemList: QuoteItemPostPayload = equipmentItemList.map((item) => ({
    equipmentId: item.equipmentId,
    quantity: item.quantity,
    price: item.price,
    quoteId: quoteResult.id,
    setId: null,
  }));

  const groupItemList: QuoteItemPostPayload = groupEquipmentList
    .map((item) => ({
      ...item,
      totalPrice: item.price,
      equipmentList: item.equipmentList.map((equipment) => ({
        equipmentId: equipment.equipmentId,
        quantity: equipment.quantity,
        price: 0,
        quoteId: quoteResult.id,
        setId: item.id,
      })),
    }))
    .flatMap((set) => set.equipmentList);

  const combinedItemList: QuoteItemPostPayload = [
    ...quoteItemList,
    ...groupItemList,
  ];

  //quote 종속 item list 생성
  await createQuoteItemList(combinedItemList);

  //생성된 quote로 reservation 생성
  const reservationResult = await postReservation({
    userId: Number(form.userId),
    quoteId: quoteResult.id,
  });

  if (!reservationResult) throw new Error("예약 생성 실패");

  // 생성된 reservation으로 quote reservation.id 업데이트
  await updateQuote(quoteResult.id, {
    reservationId: reservationResult.id,
  });

  return { reservationId: reservationResult.id };
};
