import { create } from "zustand";

export type EquipmentListItemState = {
  equipmentId: number;
  title: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

type CartState = {
  list: EquipmentListItemState[];
  setList: (list: EquipmentListItemState[]) => void;
  resetCart: () => void;
  addEquipment: (equipment: EquipmentListItemState[]) => void;
  removeEquipment: (equipmentId: EquipmentListItemState["equipmentId"]) => void;
  dateRange: { startDate: string | undefined; endDate: string | undefined };
  onChangeDate: (key: "startDate" | "endDate", date: string) => void;
};

const initialState = {
  list: [],
  dateRange: { startDate: undefined, endDate: undefined },
};

export const useCartStore = create<CartState>((set, get) => ({
  list: [],
  setList: (list) => set({ list }),
  dateRange: { startDate: undefined, endDate: undefined },
  onChangeDate: (key, date) => {
    set({ dateRange: { ...get().dateRange, [key]: date } });
  },
  resetCart: () => {
    set(initialState);
  },
  addEquipment: (equipment) => set({ list: [...get().list, ...equipment] }),
  removeEquipment: (equipmentId) =>
    set({
      list: get().list.filter(
        (equipment) => equipment.equipmentId !== equipmentId
      ),
    }),
}));
