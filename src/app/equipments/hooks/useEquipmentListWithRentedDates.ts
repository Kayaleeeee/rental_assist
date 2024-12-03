import { getEquipmentListWithRentedDates } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentItemWithRentalDatesParams,
  EquipmentItemWithRentedDates,
  EquipmentListItemType,
} from "@/app/types/equipmentType";
import { isEmpty } from "lodash";
import { useCallback, useState } from "react";

export const useEquipmentListWithRentedDates = ({
  startDate,
  endDate,
}: {
  startDate: string | undefined;
  endDate: string | undefined;
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

  const toggleEquipmentCategory = (
    categoryKey: EquipmentCategory | undefined
  ) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

  const checkAvailabilityById = async (
    id: EquipmentListItemType["id"],
    quantity: number,
    dateRange: { startDate: string; endDate: string }
  ) => {
    try {
      const result = await getEquipmentListWithRentedDates({
        equipmentId: id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      const sumOfQuantity = result.reduce((prev, acc) => {
        return (prev += acc.quantity);
      }, 0);

      if (isEmpty(result) || quantity - sumOfQuantity < 0)
        return { id, isAvailable: true, reservationId: undefined };

      return {
        id,
        isAvailable: false,
        reservationId: result[0].reservationId,
      };
    } catch {
      throw new Error("장비 검색에 에러가 발생했습니다.");
    }
  };

  return {
    list,
    selectedCategory,
    toggleEquipmentCategory,
    fetchList,
    checkAvailabilityById,
  };
};
