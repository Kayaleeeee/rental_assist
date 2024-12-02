import { EquipmentListItemState } from "@/app/store/useCartStore";
import { QuoteItemType } from "../quoteType";

export const convertQuoteItemToEquipmentState = (
  item: QuoteItemType
): EquipmentListItemState => {
  return {
    equipmentId: item.equipmentId,
    title: item.equipmentName,
    quantity: item.quantity,
    price: item.price,
  };
};
