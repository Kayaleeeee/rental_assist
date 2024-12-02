import { EquipmentListItemState } from "@/app/store/useCartStore";
import { EquipmentListItemType } from "../equipmentType";

export const convertEquipmentItemToState = (
  equipment: EquipmentListItemType
): EquipmentListItemState => ({
  equipmentId: equipment.id,
  title: equipment.title,
  quantity: equipment.quantity,
  price: equipment.price,
  discountPrice: 0,
  isAvailable: true,
});
