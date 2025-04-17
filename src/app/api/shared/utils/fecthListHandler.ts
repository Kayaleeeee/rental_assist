import { DEFAULT_LIMIT } from "@/app/types/listType";

import { toCamelCase } from "../../apiInstance";
import { PostgrestError } from "@supabase/supabase-js";
import { clientSupabase } from "@/app/utils/supabase/client";

export const fetchListHandler = async <T>(
  tableName: string,
  params?: any,
  customizeQuery?: (query: any, params?: any) => any
): Promise<{
  data: T[];
  totalElements: number;
  error: PostgrestError | null;
}> => {
  let query = clientSupabase.from(tableName).select("*", { count: "exact" });

  if (customizeQuery) {
    query = customizeQuery(query, params);
  }

  const offset = params?.offset || 0;
  const limit = params?.limit || DEFAULT_LIMIT;

  const { data, count, error } = await query.range(offset, offset + limit - 1);

  if (error) {
    return {
      data: [] as T[],
      totalElements: 0,
      error,
    };
  }

  return {
    data: (toCamelCase(data) || []) as T[],
    totalElements: count || 0,
    error: null,
  };
};
