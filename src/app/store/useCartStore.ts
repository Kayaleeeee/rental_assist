import { create } from "zustand";
import { EquipmentListItemType } from "../types/equipmentType";

type CartState = {
  list: EquipmentListItemType[];
  resetCart: () => void;
  addEquipment: (equipment: EquipmentListItemType[]) => void;
  removeEquipment: (equipmentId: EquipmentListItemType["id"]) => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  list: [],
  resetCart: () => {
    set({ list: [] });
  },
  addEquipment: (equipment) => set({ list: [...get().list, ...equipment] }),
  removeEquipment: (equipmentId) =>
    set({
      list: get().list.filter((equipment) => equipment.id !== equipmentId),
    }),
}));
