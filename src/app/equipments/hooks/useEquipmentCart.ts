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

export const convertEquipmentItemToState = (
  equipment: EquipmentListItemType
): EquipmentListItemState => ({
  equipmentId: equipment.id,
  title: equipment.title,
  quantity: equipment.quantity,
  price: equipment.price,
  totalPrice: equipment.price,
  isAvailable: true,
});

export const useEquipmentCart = () => {
  const {
    list,
    resetCart,
    onChangeDate,
    dateRange,
    setList,
    setEquipmentSetList,
    isCartOpen,
    setIsCartOpen,
    equipmentSetList,
    changeEquipmentSet,
    removeEquipment,
    removeEquipmentSet,
    addEquipmentSet,
    addEquipment,
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
        checkListAvailability(list),
        Promise.all(
          equipmentSetList.map(async (set) => {
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

      if (checkedList) setList(checkedList);
      if (checkedSetList) setEquipmentSetList(checkedSetList);
    } catch {
      showToast({
        message: "장비 스케줄 검색에 실패했습니다.",
        type: "error",
      });
    } finally {
      setIsChecked(true);
    }
  }, [equipmentSetList, list, dateRange]);

  const checkListAvailability = useCallback(
    async (list: EquipmentListItemState[]) => {
      if (isEmpty(list)) return;

      const result = await Promise.all(
        list.map((item) =>
          checkAvailabilityById(item.equipmentId, item.quantity, {
            startDate: dateRange.startDate!,
            endDate: dateRange.endDate!,
          })
        )
      );

      const checkedList = list.map((item, index) => {
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

      if (isEmpty(result))
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
    return list.some((item) => !item.isAvailable);
  }, [list]);

  const handleAddEquipment = useCallback(
    (itemList: EquipmentListItemState[]) => {
      addEquipment(itemList);
      setIsChecked(false);
    },
    []
  );

  const handleAddEquipmentSet = useCallback(
    (setList: SetEquipmentStateType[]) => {
      addEquipmentSet(setList);
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

  const handleDeleteSetEquipment = useCallback(
    (setId: SetEquipmentStateType["id"]) => {
      removeEquipmentSet(setId);
      setIsChecked(false);
    },
    []
  );

  const handleChangeSetEquipment = (setEquipment: SetEquipmentStateType) => {
    changeEquipmentSet(setEquipment);
    setIsChecked(false);
  };

  const handleDeleteSetEquipmentItem = (
    setEquipment: SetEquipmentStateType,
    equipmentItemId: EquipmentListItemState["equipmentId"]
  ) => {
    changeEquipmentSet({
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
    onChangeDate,
    dateRange,
    resetCart,

    isChecked,
    setIsChecked,

    handleDeleteEquipmentItem,
    handleDeleteSetEquipment,
    handleDeleteSetEquipmentItem,
    handleChangeSetEquipment,
    setList,
    rentalDays,
    isCartOpen,
    setIsCartOpen,
    equipmentList: list,
    equipmentSetList,
    handleAddEquipment,
    handleAddEquipmentSet,
  };
};
