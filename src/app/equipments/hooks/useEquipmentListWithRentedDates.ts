import { getEquipmentListWithRentedDates } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentItemWithRentalDatesParams,
  EquipmentItemWithRentedDates,
} from "@/app/types/equipmentType";
import { useCallback, useEffect, useState } from "react";

export const useEquipmentListWithRentedDates = ({
  startDate,
  endDate,
}: {
  startDate: string | null;
  endDate: string | null;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | undefined
  >(undefined);
  const [list, setList] = useState<EquipmentItemWithRentedDates[]>([]);

  const getParams = useCallback(
    (params?: EquipmentItemWithRentalDatesParams) => {
      if (!startDate || !endDate) return undefined;

      return { startDate, endDate, category: selectedCategory, ...params };
    },
    [selectedCategory, startDate, endDate]
  );

  const fetchList = useCallback(async () => {
    try {
      const queryParams = getParams();
      const result = await getEquipmentListWithRentedDates(queryParams);
      setList(result || []);
    } catch (e) {
      console.log(e);
      setList([]);
    }
  }, [getParams]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    fetchList();
  }, [fetchList, startDate, endDate]);

  const toggleEquipmentCategory = (
    categoryKey: EquipmentCategory | undefined
  ) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

  return {
    list,
    selectedCategory,
    toggleEquipmentCategory,
  };
};
