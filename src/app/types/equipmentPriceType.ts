import { EquipmentListItemType, SetEquipmentType } from "./equipmentType";

export type EquipmentPriceItem = {
  id: number;
  day: number;
  price: number;
  equipmentId: EquipmentListItemType["id"];
};

export type EquipmentSetPriceItem = {
  id: number;
  day: number;
  price: number;
  setId: SetEquipmentType["id"];
};
