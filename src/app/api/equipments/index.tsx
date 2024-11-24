import {
  EquipmentDetailType,
  EquipmentItemWithRentalDatesParams,
  EquipmentItemWithRentedDates,
  EquipmentListItemType,
  EquipmentListParams,
  EquipmentPostBody,
  SetEquipmentListItemType,
  SetEquipmentListParams,
} from "@/app/types/equipmentType";
import { apiDelete, apiGet, apiPatch, apiPost } from "..";
import { isEmpty } from "lodash";

const apiUrl = "/equipments";

export const getEquipmentList = (params?: EquipmentListParams) => {
  return apiGet<EquipmentListItemType[]>(apiUrl, params);
};

export const createEquipment = (payload: EquipmentPostBody) => {
  return apiPost(apiUrl, payload);
};

export const editEquipment = (
  id: EquipmentListItemType["id"],
  payload: EquipmentPostBody
) => {
  return apiPatch(`${apiUrl}`, payload, { params: { id } });
};

export const getEquipmentDetail = (id: EquipmentListItemType["id"]) => {
  return apiGet<EquipmentDetailType[]>(apiUrl, { id });
};

export const deleteEquipment = (id: EquipmentListItemType["id"]) => {
  return apiDelete(`${apiUrl}`, { params: { id } });
};

export const getEquipmentListWithRentedDates = (
  params?: EquipmentItemWithRentalDatesParams
) => {
  const convertParams = () => {
    if (!params) return {};

    const { startDate, endDate, ...rest } = params;
    if (!startDate || !endDate) return { ...rest };

    return {
      start_date: `lte.${params.endDate}`,
      end_date: `gte.${params.startDate}`,
      ...rest,
    };
  };

  return apiGet<EquipmentItemWithRentedDates[]>(
    `/equipment_rental_history`,
    convertParams()
  );
};

export const getEquipmentRentedDates = async (
  equipmentId: EquipmentListItemType["id"]
): Promise<EquipmentItemWithRentedDates | null> => {
  const result = await apiGet<EquipmentItemWithRentedDates[]>(
    `/equipment_with_rented_dates`,
    { equipmentId }
  );

  return isEmpty(result) ? null : result[0];
};

export const postSetEquipment = async (payload: {}) => {
  const result = await apiPost<{}[]>("equipment_sets", payload);
  if (isEmpty(result)) {
    throw new Error("No data found");
  } else {
    return result[0];
  }
};

export const getSetEquipmentList = (params?: SetEquipmentListParams) => {
  return apiGet<SetEquipmentListItemType[]>(`/equipment_sets`, params);
};
