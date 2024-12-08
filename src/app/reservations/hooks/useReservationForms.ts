import {
  requestGroupPriceByRounds,
  requestPriceByRounds,
} from "@/app/api/equipments/equipmentPrice";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import {
  mapEquipmentGroupStateWithPrice,
  mapEquipmentStateWithPrice,
} from "@/app/types/mapper/mapEquipmentStateWithPrice";
import { getDiffDays } from "@/app/utils/timeUtils";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty, isEqual } from "lodash";
import { useCallback, useMemo, useState } from "react";

export type ReservationFormState = {
  userId?: number;
  guestName: string;
  guestPhoneNumber: string;
  discountPrice: number;
  rounds: number;
};

export const useReservationForms = () => {
  const [form, setForm] = useState<ReservationFormState>({
    userId: undefined,
    guestName: "",
    guestPhoneNumber: "",
    discountPrice: 0,
    rounds: 0,
  });

  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [equipmentItemList, setEquipmentItemList] = useState<
    EquipmentListItemState[]
  >([]);
  const [equipmentGroupList, setEquipmentGroupList] = useState<
    SetEquipmentStateType[]
  >([]);

  const rentalDays = useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    return getDiffDays(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const onChangeForm = (
    key: keyof ReservationFormState,
    value: ReservationFormState[keyof ReservationFormState]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

  const handleChangeDate = useCallback(
    (dateRange: { startDate?: string; endDate?: string }) => {
      setDateRange(dateRange);
    },
    []
  );

  const handleAddEquipmentGroup = useCallback(
    (groupList: SetEquipmentStateType[]) => {
      setEquipmentGroupList((prev) => [...prev, ...groupList]);
    },
    []
  );

  const handleAddEquipmentList = useCallback(
    (equipmentList: EquipmentListItemState[]) => {
      setEquipmentItemList((prev) => [...prev, ...equipmentList]);
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
      setEquipmentItemList((prev) =>
        prev.filter((item) => item.equipmentId !== itemId)
      );
    },
    []
  );

  const handleDeleteGroupEquipment = useCallback(
    (setId: SetEquipmentStateType["setId"]) => {
      setEquipmentGroupList((prev) =>
        prev.filter((set) => set.setId !== setId)
      );
    },
    []
  );

  const handleChangeGroupEquipment = (setEquipment: SetEquipmentStateType) => {
    setEquipmentGroupList((prev) =>
      prev.map((set) => (set.setId === setEquipment.setId ? setEquipment : set))
    );
  };

  const handleChangeEquipmentItem = (equipmentItem: EquipmentListItemState) => {
    setEquipmentItemList((prev) =>
      prev.map((prevItem) =>
        prevItem.equipmentId === equipmentItem.equipmentId
          ? equipmentItem
          : prevItem
      )
    );
  };

  const handleDeleteGroupEquipmentItem = (
    setEquipment: SetEquipmentStateType,
    equipmentItemId: EquipmentListItemState["equipmentId"]
  ) => {
    setEquipmentGroupList((prev) =>
      prev.map((prevSet) =>
        prevSet.setId === setEquipment.setId
          ? {
              ...prevSet,
              equipmentList: prevSet.equipmentList.filter(
                (item) => item.equipmentId !== equipmentItemId
              ),
            }
          : prevSet
      )
    );
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
    form,
    setForm,
    onChangeForm,
    dateRange,
    handleChangeDate,
    rentalDays,

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
