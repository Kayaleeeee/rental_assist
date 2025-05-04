import {
  EquipmentListItemType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { isEmpty } from "lodash";
import { create } from "zustand";

type GroupEquipmentStoreState = {
  selectedGroupEquipmentMap: Map<SetEquipmentType["id"], SetEquipmentType>;
  toggleGroupEquipment: (groupEquipment: SetEquipmentType) => void;
  toggleEquipmentItemOfGroup: (
    groupEquipment: SetEquipmentType,
    equipment: EquipmentListItemType
  ) => void;
};

export const useGroupEquipmentStore = create<GroupEquipmentStoreState>(
  (set) => ({
    selectedGroupEquipmentMap: new Map([]),
    toggleGroupEquipment: (groupEquipment) => {
      set((state) => {
        const newMap = new Map(state.selectedGroupEquipmentMap);
        if (newMap.has(groupEquipment.id)) {
          newMap.delete(groupEquipment.id);
        } else {
          newMap.set(groupEquipment.id, groupEquipment);
        }

        return { selectedGroupEquipmentMap: newMap };
      });
    },

    toggleEquipmentItemOfGroup: (groupEquipment, equipment) =>
      set((state) => {
        const newMap = new Map(state.selectedGroupEquipmentMap);

        const targetSet = newMap.get(groupEquipment.id) ?? {
          ...groupEquipment,
          equipmentList: [],
        };

        const isIncludedEquipment = targetSet.equipmentList.some(
          (item) => item.id === equipment.id
        );

        if (isIncludedEquipment) {
          const newEquipmentList = targetSet.equipmentList.filter(
            (item) => item.id !== equipment.id
          );

          if (isEmpty(newEquipmentList)) {
            newMap.delete(groupEquipment.id);
          } else {
            newMap.set(groupEquipment.id, {
              ...targetSet,
              equipmentList: newEquipmentList,
            });
          }
        } else {
          newMap.set(groupEquipment.id, {
            ...targetSet,
            equipmentList: [...targetSet.equipmentList, equipment],
          });
        }
        return { selectedGroupEquipmentMap: newMap };
      }),
  })
);
