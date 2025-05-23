import {
  requestGroupPriceByRounds,
  requestPriceByRounds,
} from "@/app/api/equipments/equipmentPrice";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
  useCartStore,
} from "@/app/store/useCartStore";
import {
  mapEquipmentGroupStateWithPrice,
  mapEquipmentStateWithPrice,
} from "@/app/types/mapper/mapEquipmentStateWithPrice";
import { getDiffDays } from "@/app/utils/timeUtils";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty, isEqual } from "lodash";
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
  } = useCartStore();

  const convertGroupEquipmentPrice = async ({
    setList,
    rounds,
  }: {
    setList: SetEquipmentStateType[];
    rounds: number;
  }) => {
    if (isEmpty(setList)) return [];

    try {
      const idList = setList.map((item) => item.setId);
      const priceByRounds = await requestGroupPriceByRounds({
        setIds: idList,
        rounds: [rounds],
      });

      const listWithPrice = mapEquipmentGroupStateWithPrice(
        setList,
        priceByRounds
      );

      return listWithPrice;
    } catch (e) {
      showToast({
        message: "세트 가격 정보 조회에 실패했습니다.",
        type: "error",
      });
      throw e;
    }
  };

  const convertEquipmentListPrice = async ({
    equipmentList,
    rounds,
  }: {
    equipmentList: EquipmentListItemState[];
    rounds: number;
  }) => {
    if (isEmpty(equipmentList)) return [];

    try {
      const idList = equipmentList.map((item) => item.equipmentId);
      const priceList = await requestPriceByRounds({
        equipmentIds: idList,
        rounds: [rounds],
      });

      const listWithPrice = mapEquipmentStateWithPrice(
        equipmentList,
        priceList
      );

      return listWithPrice;
    } catch (e) {
      showToast({
        message: "단품 가격 정보 조회에 실패했습니다.",
        type: "error",
      });
      throw e;
    }
  };

  const rentalDays = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    return getDiffDays(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const handleChangeDate = useCallback(
    (dateRange: { startDate?: string; endDate?: string }) => {
      setDateRange(dateRange);
    },
    []
  );

  const handleAddEquipmentGroup = useCallback(
    (equipmentList: SetEquipmentStateType[]) => {
      addEquipmentGroup(equipmentList);
    },
    []
  );

  const handleAddEquipmentList = useCallback(
    (equipmentList: EquipmentListItemState[]) => {
      addEquipment(equipmentList);
    },
    []
  );

  const handleSetEquipmentGroup = useCallback(
    (setList: SetEquipmentStateType[]) => {
      setEquipmentGroupList(setList);
    },
    []
  );

  const handleSetEquipmentList = useCallback(
    (equipmentList: EquipmentListItemState[]) => {
      setEquipmentItemList(equipmentList);
    },
    []
  );

  const handleDeleteEquipmentItem = useCallback(
    (itemId: EquipmentListItemState["equipmentId"]) => {
      removeEquipment(itemId);
    },
    []
  );

  const handleDeleteGroupEquipment = useCallback(
    (setId: SetEquipmentStateType["setId"]) => {
      removeEquipmentGroup(setId);
    },
    []
  );

  const handleChangeGroupEquipment = (setEquipment: SetEquipmentStateType) => {
    changeEquipmentGroup(setEquipment);
  };

  const handleChangeEquipmentItem = (equipmentItem: EquipmentListItemState) => {
    changeEquipmentItem(equipmentItem);
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
  };

  const handleChangeItemPriceByRounds = useCallback(
    async ({
      equipmentItemList,
      rounds,
    }: {
      equipmentItemList: EquipmentListItemState[];
      rounds: number;
    }) => {
      const pricedEquipmentList = await convertEquipmentListPrice({
        equipmentList: equipmentItemList,
        rounds,
      });

      if (
        pricedEquipmentList &&
        !isEqual(pricedEquipmentList, equipmentItemList)
      ) {
        handleSetEquipmentList(pricedEquipmentList);
      }
    },
    []
  );

  const handleChangeGroupPriceByRounds = useCallback(
    async ({
      groupEquipmentList,
      rounds,
    }: {
      groupEquipmentList: SetEquipmentStateType[];
      rounds: number;
    }) => {
      const pricedGroupList = await convertGroupEquipmentPrice({
        setList: groupEquipmentList,
        rounds,
      });

      if (pricedGroupList && !isEqual(pricedGroupList, groupEquipmentList)) {
        handleSetEquipmentGroup(pricedGroupList);
      }
    },
    []
  );

  return {
    dateRange,
    handleChangeDate,
    resetCart,
    rentalDays,

    //flag 변수
    isCartOpen,
    setIsCartOpen,

    //세트 아이템
    equipmentGroupList,
    handleDeleteGroupEquipment,
    handleDeleteGroupEquipmentItem,
    handleChangeGroupEquipment,
    handleAddEquipmentGroup,
    handleSetEquipmentGroup,
    handleChangeGroupPriceByRounds,

    //단품 아이템
    equipmentItemList,
    handleAddEquipmentList,
    handleDeleteEquipmentItem,
    handleChangeEquipmentItem,
    handleSetEquipmentList,
    handleChangeItemPriceByRounds,
  };
};
