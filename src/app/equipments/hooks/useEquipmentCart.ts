import { getEquipmentListWithRentedDates } from "@/app/api/equipments";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
  useCartStore,
} from "@/app/store/useCartStore";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { getDiffDays } from "@/app/utils/timeUtils";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { useCallback, useMemo } from "react";

export const useEquipmentCart = () => {
  const {
    resetCart,
    dateRange,
    setDateRange,
    isCartOpen,
    setIsCartOpen,

    equipmentItemList,
    setEquipmentItemList,
    removeEquipment,
    changeEquipmentItem,
    addEquipment,

    equipmentGroupList,
    setEquipmentGroupList,
    changeEquipmentGroup,
    removeEquipmentGroup,
    addEquipmentGroup,

    isChecked,
    setIsChecked,
  } = useCartStore();

  const handleCheckAvailability = useCallback(async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      showToast({
        message: "날짜를 선택해주세요",
        type: "error",
      });
      return;
    }

    setIsChecked(false);

    try {
      const [checkedList, checkedSetList] = await Promise.all([
        checkListAvailability(equipmentItemList),
        Promise.all(
          equipmentGroupList.map(async (set) => {
            const checkedEquipmentList = await checkListAvailability(
              set.equipmentList
            );
            return {
              ...set,
              equipmentList: checkedEquipmentList || set.equipmentList,
            };
          })
        ),
      ]);

      if (checkedList) setEquipmentItemList(checkedList);
      if (checkedSetList) setEquipmentGroupList(checkedSetList);
    } catch {
      showToast({
        message: "장비 스케줄 검색에 실패했습니다.",
        type: "error",
      });
    } finally {
      setIsChecked(true);
    }
  }, [equipmentGroupList, equipmentItemList, dateRange]);

  const checkListAvailability = useCallback(
    async (equipmentItemList: EquipmentListItemState[]) => {
      if (isEmpty(equipmentItemList)) return;

      const result = await Promise.all(
        equipmentItemList.map((item) =>
          checkAvailabilityById(item.equipmentId, item.quantity, {
            startDate: dateRange.startDate!,
            endDate: dateRange.endDate!,
          })
        )
      );

      const checkedList = equipmentItemList.map((item, index) => {
        const target = result[index];
        return {
          ...item,
          isAvailable: target.isAvailable,
          reservationId: target.reservationId,
        };
      });

      return checkedList;
    },
    [dateRange]
  );

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

      return { id, isAvailable: false, reservationId: result[0].reservationId };
    } catch {
      throw new Error("장비 검색에 에러가 발생했습니다.");
    }
  };

  const rentalDays = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    return getDiffDays(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const hasUnavailableItem = useMemo(() => {
    return equipmentItemList.some((item) => !item.isAvailable);
  }, [equipmentItemList]);

  const handleChangeDate = useCallback(
    (dateRange: { startDate?: string; endDate?: string }) => {
      setDateRange(dateRange);
      setIsChecked(false);
    },
    []
  );

  const handleAddEquipmentGroup = useCallback(
    (equipmentList: SetEquipmentStateType[]) => {
      addEquipmentGroup(equipmentList);
      setIsChecked(false);
    },
    []
  );

  const handleAddEquipmentList = useCallback(
    (equipmentList: EquipmentListItemState[]) => {
      addEquipment(equipmentList);
      setIsChecked(false);
    },
    []
  );

  const handleSetEquipmentGroup = useCallback(
    (equipmentList: SetEquipmentStateType[]) => {
      setEquipmentGroupList(equipmentList);
      setIsChecked(false);
    },
    []
  );

  const handleSetEquipmentList = useCallback(
    (equipmentList: EquipmentListItemState[]) => {
      setEquipmentItemList(equipmentList);
      setIsChecked(false);
    },
    []
  );

  const handleDeleteEquipmentItem = useCallback(
    (itemId: EquipmentListItemState["equipmentId"]) => {
      removeEquipment(itemId);
      setIsChecked(false);
    },
    []
  );

  const handleDeleteGroupEquipment = useCallback(
    (setId: SetEquipmentStateType["setId"]) => {
      removeEquipmentGroup(setId);
      setIsChecked(false);
    },
    []
  );

  const handleChangeGroupEquipment = (setEquipment: SetEquipmentStateType) => {
    changeEquipmentGroup(setEquipment);
    setIsChecked(false);
  };

  const handleChangeEquipmentItem = (equipmentItem: EquipmentListItemState) => {
    changeEquipmentItem(equipmentItem);
    setIsChecked(false);
  };

  const handleDeleteGroupEquipmentItem = (
    setEquipment: SetEquipmentStateType,
    equipmentItemId: EquipmentListItemState["equipmentId"]
  ) => {
    changeEquipmentGroup({
      ...setEquipment,
      equipmentList: setEquipment.equipmentList.filter(
        (item) => item.equipmentId !== equipmentItemId
      ),
    });
    setIsChecked(false);
  };

  return {
    hasUnavailableItem,
    handleCheckAvailability,
    dateRange,
    handleChangeDate,
    resetCart,
    rentalDays,

    //flag 변수
    isCartOpen,
    setIsCartOpen,
    isChecked,
    setIsChecked,

    //세트 아이템
    equipmentGroupList,
    handleDeleteGroupEquipment,
    handleDeleteGroupEquipmentItem,
    handleChangeGroupEquipment,
    handleAddEquipmentGroup,
    handleSetEquipmentGroup,

    //단품 아이템
    equipmentItemList,
    handleAddEquipmentList,
    handleDeleteEquipmentItem,
    handleChangeEquipmentItem,
    handleSetEquipmentList,
  };
};
