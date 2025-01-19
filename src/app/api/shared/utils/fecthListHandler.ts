import { DEFAULT_LIMIT } from "@/app/types/listType";
import { createClient } from "@/app/utils/supabase/client";
import { toCamelCase } from "../../apiInstance";

export const fetchListHandler = async (
  tableName: string,
  params?: any,
  customizeQuery?: (query: any, params?: any) => any
) => {
  const supabase = await createClient();

  let query = supabase.from(tableName).select("*", { count: "exact" });

  if (customizeQuery) {
    query = customizeQuery(query, params);
  }

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
