import { EquipmentListItemType, SetEquipmentType } from "./equipmentType";

export type EquipmentPriceItem = {
  id: number;
  day: number;
  price: number;
  equipmentId: EquipmentListItemType["id"];
};

export type EquipmentGroupPriceItem = {
  id: number;
  day: number;
  price: number;
  setId: SetEquipmentType["id"];
};

export type PostEquipmentPricePayload = {
  day: number;
  price: number;
  equipmentId: EquipmentListItemType["id"];
};

export type PostGroupPricePayload = Omit<EquipmentGroupPriceItem, "id">;

export type EquipmentPriceRequestPayload = {
  equipmentIds: EquipmentListItemType["id"][];
  rounds: number[];
};

export type EquipmentPriceItemByRound = {
  equipmentId: EquipmentListItemType["id"];
  round: number;
  price: number;
};
