import { getSetEquipmentItemList } from "@/app/api/equipments/setEquipments";
import {
  SetEquipmentListItemType,
  SetEquipmentListParams,
} from "@/app/types/equipmentType";
import { useCallback, useState } from "react";

export const useSetEquipmentItemList = () => {
  const [list, setList] = useState<SetEquipmentListItemType[]>([]);

  const fetchList = useCallback(async (params?: SetEquipmentListParams) => {
    const result = await getSetEquipmentItemList(params);
    setList(result);
  }, []);

  return { list, fetchList };
};
