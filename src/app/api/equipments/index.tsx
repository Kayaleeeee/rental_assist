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
import { createClient } from "@/app/utils/supabase/client";
import { DEFAULT_LIMIT } from "@/app/types/listType";

const apiUrl = "/equipments";

const applyFilters = (query: any, params?: EquipmentListParams) => {
  if (!params) return query;

  if (params.category) {
    query = query.eq("category", params.category);
  }
  if (params.title) {
    query = query.ilike("title", `%${params.title}%`);
  }
  if (params.disabled !== undefined) {
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

export const getFullSetList = async (params?: EquipmentListParams) => {
  const supabase = await createClient();

  let query = supabase.from("equipment_sets").select("*", { count: "exact" });

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
