import { SetEquipmentStateType } from "@/app/store/useCartStore";
import { ReservationDetailType } from "../reservationType";
import { convertQuoteItemToEquipmentState } from "./convertQuoteItemToEquipmentState";

export const convertReservationGroupEquipmentToState = (
  set: ReservationDetailType["setList"][number]
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
