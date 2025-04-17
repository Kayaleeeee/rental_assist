import { EquipmentWithAvailabilityType } from "@/app/types/equipmentType";

export const getAvailableItemOnly = (
  equipmentList: EquipmentWithAvailabilityType[],
  disabledEquipmentIdList: number[]
) => {
  return equipmentList.filter(
    (item) => item.isAvailable && !disabledEquipmentIdList.includes(item.id)
  );
};

export const getIsAvailableItem = (
  equipment: EquipmentWithAvailabilityType,
  disabledEquipmentIdList: number[]
) => {
  return (
    equipment.isAvailable && !disabledEquipmentIdList.includes(equipment.id)
  );
};
