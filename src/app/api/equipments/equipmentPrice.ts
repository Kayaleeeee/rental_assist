import {
  EquipmentPriceItem,
  PostEquipmentPricePayload,
  PostGroupPricePayload,
} from "@/app/types/equipmentPriceType";
import { apiDelete, apiGet, apiPatch, apiPost } from "..";

const item_url = "equipment_prices";
const set_url = "equipment_sets";

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

export const createGroupEquipmentPrice = (payload: PostGroupPricePayload[]) => {
  return apiPost(set_url, payload);
};

export const deleteEquipmentPriceList = (idList: string) => {
  return apiDelete(item_url, { params: { id: `in.${idList}` } });
};

export const patchEquipmentPriceItem = (
  id: EquipmentPriceItem["id"],
  payload: PostEquipmentPricePayload
) => {
  return apiPatch(item_url, payload, { params: { id } });
};
