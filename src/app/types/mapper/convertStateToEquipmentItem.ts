import { EquipmentListItemState } from "@/app/store/useCartStore";
import { EquipmentCategory, EquipmentListItemType } from "../equipmentType";

export const convertStateToEquipmentItem = (
  item: EquipmentListItemState
): EquipmentListItemType => {
  return {
    id: item.equipmentId,
    title: item.title,
    price: item.price,
    category: item.category || EquipmentCategory.others,
    detail: "",
    quantity: item.quantity,
  };
};
