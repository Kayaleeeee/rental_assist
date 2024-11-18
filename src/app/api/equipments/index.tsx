import {
  EquipmentDetailType,
  EquipmentItemWithRentedDates,
  EquipmentListItemType,
  EquipmentListParams,
  EquipmentPostBody,
} from "@/app/types/equipmentType";
import { apiGet, apiPost } from "..";
import { isEmpty } from "lodash";

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

export const getEquipmentListWithRentedDates = (params?: {
  equipmentId: EquipmentListItemType["id"];
}) => {
  return apiGet<EquipmentItemWithRentedDates[]>(
    `/equipment_with_rented_dates`,
    params
  );
};

export const getEquipmentRentedDates = async (
  equipmentId: EquipmentListItemType["id"]
): Promise<EquipmentItemWithRentedDates["rentedDates"]> => {
  const result = await apiGet<EquipmentItemWithRentedDates[]>(
    `/equipment_with_rented_dates`,
    { equipmentId }
  );

  return isEmpty(result) ? [] : result[0].rentedDates;
};
