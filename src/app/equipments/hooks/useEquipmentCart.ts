import { getEquipmentListWithRentedDates } from "@/app/api/equipments";
import { EquipmentListItemState, useCartStore } from "@/app/store/useCartStore";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { getDiffDays } from "@/app/utils/timeUtils";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

type EquipmentAvailabilityType = EquipmentListItemState & {
  isAvailable: boolean;
  reservationId?: number;
};

export const useEquipmentCart = () => {
  const { list, resetCart, onChangeDate, dateRange, setList } = useCartStore();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const [availableListState, setAvailableListState] = useState<
    EquipmentAvailabilityType[]
  >([]);

  useEffect(() => {
    setAvailableListState(list.map((item) => ({ ...item, isAvailable: true })));
  }, [list]);

  const removeItem = useCallback(
    (id: EquipmentAvailabilityType["equipmentId"]) => {
      setAvailableListState((prev) =>
        prev.filter((item) => item.equipmentId !== id)
      );
    },
    []
  );

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
          checkAvailabilityById(item.equipmentId, {
            startDate: dateRange.startDate!,
            endDate: dateRange.endDate!,
          })
        )
      );

      const checkedList = availableListState.map((item) => {
        const target = result.find((r) => r.id === item.equipmentId);
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

  const rentalDays = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    return getDiffDays(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const hasUnavailableItem = useMemo(() => {
    return availableListState.some((item) => !item.isAvailable);
  }, [availableListState]);

  return {
    hasUnavailableItem,
    availableListState,
    checkAvailability,
    onChangeDate,
    dateRange,
    resetCart,
    isChecked,
    removeItem,
    setList,
    rentalDays,
  };
};
