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
import { isEmpty, isNil } from "lodash";
import { createClient } from "@/app/utils/supabase/client";
import { DEFAULT_LIMIT, ListReturnType } from "@/app/types/listType";

const apiUrl = "/equipments";

const applyFilters = (query: any, params?: EquipmentListParams) => {
  if (!params) return query;

  if (params.category) {
    query = query.eq("category", params.category);
  }
  if (params.title) {
    query = query.ilike("title", `%${params.title}%`);
  }
  if (!isNil(params.disabled)) {
    query = query.eq("disabled", params.disabled);
  }
  if (params.order) {
    query = query.order(params.order, {
      ascending: params.order === "asc",
    });
  }

  return query.order("id", { ascending: false });
};

export const getEquipmentList = async (params?: EquipmentListParams) => {
  const supabase = await createClient();

  let query = supabase.from("equipments").select("*", { count: "exact" });

  query = applyFilters(query, params);

  const offset = params?.offset || 0;
  const limit = params?.limit || DEFAULT_LIMIT;

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return {
      data: [],
      totalElements: 0,
      error,
    };
  }

  return {
    data: data || [],
    totalElements: count || 0,
    error: null,
  };
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
    };
  };

  const result = await apiPost<ListReturnType<EquipmentWithAvailabilityType>>(
    `/rpc/equipments_with_availability`,
    convertParams()
  );

  return result;
};
