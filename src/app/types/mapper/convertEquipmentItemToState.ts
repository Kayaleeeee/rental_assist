import { EquipmentListItemState } from "@/app/store/useCartStore";
import { EquipmentListItemType } from "../equipmentType";

export const convertEquipmentItemToState = (
  equipment: EquipmentListItemType
): EquipmentListItemState => ({
  equipmentId: equipment.id,
  title: equipment.title,
  quantity: 1,
  price: equipment.price,
  discountPrice: 0,
});

export const convertEquipmentItemToStateWithOption = (
  equipment: EquipmentListItemType,
  options?: Partial<EquipmentListItemState>
): EquipmentListItemState => ({
  equipmentId: equipment.id,
  title: equipment.title,
  quantity: equipment.quantity,
  price: equipment.price,
  discountPrice: 0,
  ...options,
});
