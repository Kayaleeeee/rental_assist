import { getEquipmentList } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentListItemType,
  EquipmentListParams,
} from "@/app/types/equipmentType";
import { useCallback, useEffect, useState } from "react";

export const useEquipmentList = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<EquipmentCategory | null>(null);
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

  const toggleEquipmentCategory = (categoryKey: EquipmentCategory) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory(null);
      fetchList();
    } else {
      setSelectedCategory(categoryKey);
      fetchList({ category: categoryKey });
    }
  };

  return {
    list,
    selectedCategory,
    toggleEquipmentCategory,
  };
};
