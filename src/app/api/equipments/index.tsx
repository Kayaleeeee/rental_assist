import {
  EquipmentDetailType,
  EquipmentListItemType,
  EquipmentListParams,
  EquipmentPostBody,
} from "@/app/types/equipmentType";
import { apiGet, apiPost } from "..";

const apiUrl = "/equipments";

export const getEquipmentList = (params?: EquipmentListParams) => {
  return apiGet<EquipmentListItemType[]>(apiUrl, params);
};

export const createEquipment = (payload: EquipmentPostBody) => {
  return apiPost(apiUrl, payload);
};

export const getEquipmentDetail = (id: number) => {
  return apiGet<EquipmentDetailType[]>(apiUrl, { id });
};
