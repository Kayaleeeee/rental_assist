import {
  EquipmentDetailType,
  EquipmentItemWithRentedDates,
  EquipmentListItemType,
  EquipmentListParams,
  EquipmentPostBody,
  EquipmentWithAvailabilitySearchParams,
  EquipmentWithAvailabilityType,
} from "@/app/types/equipmentType";
import { apiDelete, apiGet, apiPatch, apiPost } from "..";
import { isEmpty } from "lodash";
import { DEFAULT_LIMIT, ListReturnType } from "@/app/types/listType";
import { parseEquipmentListParams } from "./utils";
import { fetchListHandler } from "../shared/utils/fecthListHandler";

const apiUrl = "/equipments";

export const getEquipmentList = async (params?: EquipmentListParams) => {
  return await fetchListHandler("equipments", params, parseEquipmentListParams);
};

export const postEquipmentForm = async (payload: EquipmentPostBody) => {
  const result = await apiPost<EquipmentListItemType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
  });

  if (isEmpty(result)) {
    throw new Error("No data found");
  }

  return result[0];
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

export const getEquipmentRentedDates = async (
  equipmentId: EquipmentListItemType["id"]
): Promise<EquipmentItemWithRentedDates | null> => {
  const result = await apiGet<EquipmentItemWithRentedDates[]>(
    `/equipment_with_rented_dates`,
    { equipmentId }
  );

  return isEmpty(result) ? null : result[0];
};

export const getEquipmentRentalHistoryByDate = async ({
  equipmentId,
  startDate,
  endDate,
}: {
  equipmentId: EquipmentListItemType["id"];
  startDate: string;
  endDate: string;
}): Promise<EquipmentItemWithRentedDates[] | null> => {
  const convertParams = () => {
    if (!startDate || !endDate || !equipmentId) return {};

    return {
      start_date_param: startDate,
      end_date_param: endDate,
      equipment_id_param: equipmentId,
    };
  };

  const result = await apiPost<EquipmentItemWithRentedDates[]>(
    `/rpc/get_equipment_with_rented_dates`,
    convertParams()
  );

  return isEmpty(result) ? [] : result;
};

export const getEquipmentListRentalHistoryByDate = async ({
  idList,
  startDate,
  endDate,
}: {
  idList: EquipmentListItemType["id"][];
  startDate: string;
  endDate: string;
}): Promise<EquipmentItemWithRentedDates[] | null> => {
  const convertParams = () => {
    if (!startDate || !endDate || isEmpty(idList)) return {};

    return {
      start_date_param: startDate,
      end_date_param: endDate,
      equipment_ids: idList,
    };
  };

  const result = await apiPost<EquipmentItemWithRentedDates[]>(
    `/rpc/get_equipment_list_with_rented_dates`,
    convertParams()
  );

  return isEmpty(result) ? [] : result;
};

export const getEquipmentListWithAvailability = async (
  params: EquipmentWithAvailabilitySearchParams
): Promise<ListReturnType<EquipmentWithAvailabilityType>> => {
  const convertParams = () => {
    if (!params.startDate || !params.endDate) return {};

    return {
      paramsStartDate: params.startDate,
      paramsEndDate: params.endDate,
      limitRows: params.limit || DEFAULT_LIMIT,
      offsetRows: params.offset || 0,
      categoryFilter: params.category || null,
      titleSearch: params.title || null,
      excludeReservationId: params.excludeReservationId || null,
    };
  };

  const result = await apiPost<ListReturnType<EquipmentWithAvailabilityType>>(
    `/rpc/equipments_with_availability`,
    convertParams()
  );

  return result;
};
