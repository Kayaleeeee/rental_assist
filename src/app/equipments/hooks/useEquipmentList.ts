import { getEquipmentList } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentListItemType,
  EquipmentListParams,
} from "@/app/types/equipmentType";
import { useCallback, useEffect, useState } from "react";

export const useEquipmentList = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | undefined
  >(undefined);
  const [list, setList] = useState<EquipmentListItemType[]>([]);

  const fetchList = useCallback(async (params?: EquipmentListParams) => {
    try {
      const result = await getEquipmentList(params);
      setList(result || []);
    } catch (e) {
      console.log(e);
      setList([]);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const toggleEquipmentCategory = (
    categoryKey: EquipmentCategory | undefined
  ) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory(undefined);
      fetchList();
    } else {
      setSelectedCategory(categoryKey);
      fetchList(categoryKey ? { category: categoryKey } : undefined);
    }
  };

  return {
    list,
    selectedCategory,
    toggleEquipmentCategory,
  };
};
