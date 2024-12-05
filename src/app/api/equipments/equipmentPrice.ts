import {
  EquipmentGroupPriceItem,
  EquipmentPriceItem,
  PostEquipmentPricePayload,
  PostGroupPricePayload,
} from "@/app/types/equipmentPriceType";
import { apiDelete, apiGet, apiPatch, apiPost } from "..";

const item_url = "equipment_prices";
const set_url = "equipment_set_prices";

export const getEquipmentPriceList = (
  id: EquipmentPriceItem["equipmentId"]
) => {
  return apiGet<EquipmentPriceItem[]>(item_url, {
    equipmentId: id,
    order: "day.asc",
  });
};

export const postEquipmentPrice = (payload: PostEquipmentPricePayload[]) => {
  return apiPost(item_url, payload);
};

export const deleteEquipmentPriceList = (idList: string) => {
  return apiDelete(item_url, { params: { id: `in.(${idList})` } });
};

export const patchEquipmentPriceItem = (
  id: EquipmentPriceItem["id"],
  payload: PostEquipmentPricePayload
) => {
  return apiPatch(item_url, payload, { params: { id } });
};

export const getGroupEquipmentPriceList = (
  id: EquipmentGroupPriceItem["setId"]
) => {
  return apiGet<EquipmentGroupPriceItem[]>(set_url, {
    setId: id,
    order: "day.asc",
  });
};

export const postGroupEquipmentPrice = (payload: PostGroupPricePayload[]) => {
  return apiPost(set_url, payload);
};

export const deleteGroupEquipmentPriceList = (idList: string) => {
  return apiDelete(set_url, { params: { id: `in.(${idList})` } });
};

export const patchGroupEquipmentPriceItem = (
  id: EquipmentGroupPriceItem["id"],
  payload: PostGroupPricePayload
) => {
  return apiPatch(set_url, payload, { params: { id } });
};
