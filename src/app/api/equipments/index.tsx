import {
  EquipmentDetailType,
  EquipmentListItemType,
  EquipmentPostBody,
} from "@/app/types/equipmentType";
import { apiGet, apiPost } from "..";

const apiUrl = "/equipments";

export const getEquipmentList = () => {
  return apiGet<EquipmentListItemType[]>(apiUrl);
};

export const createEquipment = (payload: EquipmentPostBody) => {
  return apiPost(apiUrl, payload);
};

export const getEquipmentDetail = (id: number) => {
  return apiGet<EquipmentDetailType[]>(apiUrl, { id });
};
