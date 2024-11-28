import {
  EquipmentListParams,
  SetEquipmentItemPostPayload,
  SetEquipmentListItemType,
  SetEquipmentListParams,
  SetEquipmentPayload,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { DEFAULT_LIMIT } from "@/app/types/listType";
import { createClient } from "@/app/utils/supabase/client";
import { apiDelete, apiGet, apiPatch, apiPost } from "..";
import { isEmpty } from "lodash";
import { toCamelCase } from "../apiInstance";

const apiUrl = "/equipment_sets";

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

export const getSetEquipmentList = async (params?: EquipmentListParams) => {
  const supabase = await createClient();

  let query = supabase
    .from("equipment_set_list")
    .select("*", { count: "exact" });

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
    data: toCamelCase(data) || [],
    totalElements: count || 0,
    error: null,
  };
};

export const createSetEquipment = async (payload: SetEquipmentPayload) => {
  const result = await apiPost<SetEquipmentType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
  });

  if (isEmpty(result)) {
    throw new Error("No data found");
  } else {
    return result[0];
  }
};

export const getSetEquipmentDetail = async (id: SetEquipmentType["id"]) => {
  return apiGet<SetEquipmentType[]>("equipment_set_list", { id });
};

export const editSetEquipment = (
  id: SetEquipmentType["id"],
  payload: SetEquipmentPayload
) => {
  return apiPatch(apiUrl, payload, { params: { id } });
};

export const deleteSetEquipment = (id: SetEquipmentType["id"]) => {
  return apiDelete(apiUrl, { params: { id } });
};

export const createSetEquipmentItemList = async (
  payload: SetEquipmentItemPostPayload[]
) => {
  if (isEmpty(payload)) return;

  await apiPost("equipment_set_items", payload);
};

export const deleteSetEquipmentItemList = async (idList: string) => {
  return apiDelete("equipment_set_items", {
    params: { equipmentId: `in.(${idList})` },
  });
};

export const getSetEquipmentItemList = (params?: SetEquipmentListParams) => {
  return apiGet<SetEquipmentListItemType[]>("equipment_set_items", { params });
};
