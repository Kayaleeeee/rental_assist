import {
  EquipmentDetailType,
  EquipmentItemWithRentalDatesParams,
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

export const getEquipmentListWithRentedDates = (
  params?: EquipmentItemWithRentalDatesParams
) => {
  const convertParams = () => {
    if (!params) return {};

    const { startDate, endDate, ...rest } = params;
    if (!startDate || !endDate) return { ...rest };

    return {
      start_date: `gte.${params.startDate}`,
      end_date: `lte.${params.endDate}`,
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

export const getSetEquipmentList = () => {
  return apiGet(`/equipment_sets`);
};
