import { create } from "zustand";
import { QuoteItemType } from "../types/quoteType";
import { EquipmentCategory, SetEquipmentType } from "../types/equipmentType";

export type EquipmentListItemState = {
  equipmentId: number;
  title: string;
  price: number;
  quantity: number;
  totalPrice: number;
  category?: EquipmentCategory;
  discountPrice?: number;
  id?: QuoteItemType["id"];
  isAvailable?: boolean;
  reservationId?: number;
};

export type SetEquipmentStateType = Omit<
  SetEquipmentType,
  "equipmentList" | "detail" | "memo"
> & {
  equipmentList: EquipmentListItemState[];
};

type CartState = {
  equipmentItemList: EquipmentListItemState[];
  setEquipmentItemList: (list: EquipmentListItemState[]) => void;

  resetCart: () => void;
  addEquipment: (equipment: EquipmentListItemState[]) => void;
  removeEquipment: (equipmentId: EquipmentListItemState["equipmentId"]) => void;
  changeEquipmentItem: (equipment: EquipmentListItemState) => void;

  equipmentGroupList: SetEquipmentStateType[];
  setEquipmentGroupList: (list: SetEquipmentStateType[]) => void;
  addEquipmentGroup: (setEquipment: SetEquipmentStateType[]) => void;
  removeEquipmentGroup: (setEquipmentId: SetEquipmentStateType["id"]) => void;
  changeEquipmentGroup: (setEquipment: SetEquipmentStateType) => void;

  dateRange: { startDate: string | undefined; endDate: string | undefined };
  onChangeDate: (key: "startDate" | "endDate", date: string) => void;
  setDateRange: (dateRange: { startDate: string; endDate: string }) => void;

  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;

  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
};

const initialState = {
  isCartOpen: false,
  isChecked: false,
  equipmentItemList: [],
  equipmentGroupList: [],
  dateRange: { startDate: undefined, endDate: undefined },
};

export const useCartStore = create<CartState>((set, get) => ({
  ...initialState,
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  setEquipmentItemList: (list) => set({ equipmentItemList: list }),
  changeEquipmentItem: (item) => {
    set({
      equipmentItemList: get().equipmentItemList.map((prevItem) =>
        prevItem.equipmentId === item.equipmentId ? item : prevItem
      ),
    });
  },
  addEquipment: (equipment) =>
    set({ equipmentItemList: [...get().equipmentItemList, ...equipment] }),
  removeEquipment: (equipmentId) =>
    set({
      equipmentItemList: get().equipmentItemList.filter(
        (equipment) => equipment.equipmentId !== equipmentId
      ),
    }),

  setIsChecked: (isChecked) => set({ isChecked }),

  setEquipmentGroupList: (list) => set({ equipmentGroupList: list }),
  addEquipmentGroup: (setEquipment) =>
    set({
      equipmentGroupList: [...get().equipmentGroupList, ...setEquipment],
    }),
  removeEquipmentGroup: (setEquipmentId) =>
    set({
      equipmentGroupList: get().equipmentGroupList.filter(
        (setEquipment) => setEquipment.id !== setEquipmentId
      ),
    }),
  changeEquipmentGroup: (changedSet) => {
    set({
      equipmentGroupList: get().equipmentGroupList.map((setEquipmentItem) =>
        setEquipmentItem.id === changedSet.id ? changedSet : setEquipmentItem
      ),
    });
  },
  onChangeDate: (key, date) => {
    set({ dateRange: { ...get().dateRange, [key]: date } });
  },
  setDateRange: (dateRange) => {
    set({ dateRange });
  },
  resetCart: () => {
    set(initialState);
  },
}));
