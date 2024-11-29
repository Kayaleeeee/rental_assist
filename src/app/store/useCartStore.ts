import { create } from "zustand";
import { QuoteItemType } from "../types/quoteType";
import { SetEquipmentType } from "../types/equipmentType";

export type EquipmentListItemState = {
  equipmentId: number;
  title: string;
  price: number;
  quantity: number;
  totalPrice?: number;
  id?: QuoteItemType["id"];
};

type CartState = {
  list: EquipmentListItemState[];
  setList: (list: EquipmentListItemState[]) => void;
  resetCart: () => void;
  addEquipment: (equipment: EquipmentListItemState[]) => void;
  removeEquipment: (equipmentId: EquipmentListItemState["equipmentId"]) => void;

  equipmentSetList: SetEquipmentType[];
  addEquipmentSet: (setEquipment: SetEquipmentType[]) => void;
  removeEquipmentSet: (setEquipmentId: SetEquipmentType["id"]) => void;
  changeEquipmentSet: (setEquipment: SetEquipmentType) => void;

  dateRange: { startDate: string | undefined; endDate: string | undefined };
  onChangeDate: (key: "startDate" | "endDate", date: string) => void;
  setDateRange: (dateRange: { startDate: string; endDate: string }) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
};

const initialState = {
  list: [],
  dateRange: { startDate: undefined, endDate: undefined },
};

export const useCartStore = create<CartState>((set, get) => ({
  isCartOpen: false,
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  list: [],
  setList: (list) => set({ list }),

  equipmentSetList: [],
  addEquipmentSet: (setEquipment) =>
    set({ equipmentSetList: [...get().equipmentSetList, ...setEquipment] }),
  removeEquipmentSet: (setEquipmentId) =>
    set({
      equipmentSetList: get().equipmentSetList.filter(
        (setEquipment) => setEquipment.id !== setEquipmentId
      ),
    }),
  changeEquipmentSet: (changedSet) => {
    set({
      equipmentSetList: get().equipmentSetList.map((setEquipmentItem) =>
        setEquipmentItem.id === changedSet.id ? changedSet : setEquipmentItem
      ),
    });
  },
  dateRange: { startDate: undefined, endDate: undefined },
  onChangeDate: (key, date) => {
    set({ dateRange: { ...get().dateRange, [key]: date } });
  },
  setDateRange: (dateRange) => {
    set({ dateRange });
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
