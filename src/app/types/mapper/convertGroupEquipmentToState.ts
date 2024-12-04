import { SetEquipmentStateType } from "@/app/store/useCartStore";
import { SetEquipmentType } from "../equipmentType";
import { convertEquipmentItemToState } from "./convertEquipmentItemToState";

export const convertGroupEquipmentToState = (
  set: SetEquipmentType
): SetEquipmentStateType => {
  return {
    ...set,
    setId: set.id,
    equipmentList: set.equipmentList.map(convertEquipmentItemToState),
  };
};
