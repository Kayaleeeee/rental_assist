import { getEquipmentListWithRentedDates } from "@/app/api/equipments";
import { useCartStore } from "@/app/store/useCartStore";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";

type EquipmentAvailabilityType = EquipmentListItemType & {
  isAvailable: boolean;
  reservationId?: number;
};

export const useEquipmentCart = () => {
  const { list, resetCart } = useCartStore();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  const [availableListState, setAvailableListState] = useState<
    EquipmentAvailabilityType[]
  >([]);

  useEffect(() => {
    setAvailableListState(list.map((item) => ({ ...item, isAvailable: true })));
  }, [list]);

  const removeItem = useCallback((id: EquipmentAvailabilityType["id"]) => {
    setAvailableListState((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const checkAvailability = useCallback(async () => {
    if (isEmpty(availableListState)) return;

    if (!dateRange.startDate || !dateRange.endDate) {
      showToast({
        message: "날짜를 선택해주세요",
        type: "error",
      });
      return;
    }

    setIsChecked(false);

    try {
      const result = await Promise.all(
        availableListState.map((item) =>
          checkAvailabilityById(item.id, {
            startDate: dateRange.startDate!,
            endDate: dateRange.endDate!,
          })
        )
      );

      const checkedList = availableListState.map((item) => {
        const target = result.find((r) => r.id === item.id);
        if (!target) return item;
        return {
          ...item,
          isAvailable: target.isAvailable,
          reservationId: target.reservationId,
        };
      });
      setAvailableListState(checkedList);
      setIsChecked(true);
    } catch (e) {
      console.log(e);
    }
  }, [availableListState, dateRange]);

  const checkAvailabilityById = async (
    id: EquipmentListItemType["id"],
    dateRange: { startDate: string; endDate: string }
  ) => {
    try {
      const result = await getEquipmentListWithRentedDates({
        equipmentId: id,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      if (isEmpty(result))
        return { id, isAvailable: true, reservationId: undefined };

      return { id, isAvailable: false, reservationId: result[0].reservationId };
    } catch {
      showToast({
        message: "장비 검색에 실패했습니다.",
        type: "error",
      });
      throw new Error("장비 검색에 에러가 발생했습니다.");
    }
  };

  const onChangeDate = useCallback(
    (key: "startDate" | "endDate", date: string) => {
      setDateRange((prev) => ({ ...prev, [key]: date }));
    },
    []
  );

  return {
    availableListState,
    checkAvailability,
    onChangeDate,
    dateRange,
    resetCart,
    isChecked,
    removeItem,
  };
};
