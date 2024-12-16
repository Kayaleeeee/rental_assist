import { EquipmentCategory, EquipmentListItemType } from "../equipmentType";
import { QuoteItemType } from "../quoteType";

export const convertQuoteItemToEquipmentItem = (
  item: QuoteItemType
): EquipmentListItemType => {
  return {
    id: item.equipmentId,
    title: item.equipmentName,
    quantity: item.quantity,
    category: EquipmentCategory.other,
    price: item.price,
  };
};
