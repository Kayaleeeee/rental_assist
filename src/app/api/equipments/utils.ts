import { EquipmentListParams } from "@/app/types/equipmentType";
import { isNil } from "lodash";

export const parseEquipmentListParams = (query: any, params?: EquipmentListParams) => {
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
  