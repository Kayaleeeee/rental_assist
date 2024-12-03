import { SetEquipmentStateType } from "@/app/store/useCartStore";
import {
  ReservationDetailResponse,
  ReservationDetailStateType,
} from "../reservationType";
import { convertQuoteItemToEquipmentState } from "./convertQuoteItemToEquipmentState";

export const convertReservationGroupEquipmentToState = (
  set: ReservationDetailResponse["setList"][number]
): SetEquipmentStateType => {
  return {
    setId: set.setId,
    title: set.title,
    price: set.price,
    totalPrice: set.totalPrice,
    discountPrice: set.discountedPrice,
    quoteSetId: set.id,
    equipmentList: set.equipmentList.map(convertQuoteItemToEquipmentState),
  };
};

export const convertReservationDetailResponseToState = (
  reservation: ReservationDetailResponse
): ReservationDetailStateType => {
  return {
    ...reservation,
    equipmentList: reservation.equipmentList.map(
      convertQuoteItemToEquipmentState
    ),
    setList: reservation.setList.map(convertReservationGroupEquipmentToState),
  };
};
