import {
  postEquipmentAvailability,
  postEquipmentAvailabilityOnUpdate,
} from "@/app/api/reservation/reservationEquipment";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { QuoteItemType } from "@/app/types/quoteType";
import {
  EquipmentAvailabilityPostPayload,
  EquipmentAvailableItem,
} from "@/app/types/reservationType";
import { showToast } from "@/app/utils/toastUtils";

const convertEquipmentListToPayload = (
  equipmentItemList: EquipmentListItemState[],
  groupEquipmentList: SetEquipmentStateType[]
) => {
  const equipmentList: EquipmentAvailabilityPostPayload["equipmentList"] = [];

  equipmentItemList.forEach((item) =>
    equipmentList.push({
      id: item.equipmentId,
      quantity: item.quantity,
    })
  );

  groupEquipmentList
    .flatMap((group) => group.equipmentList)
    .forEach((item) => {
      const existingItem = equipmentList.find(
        (prev) => prev.id === item.equipmentId
      );

      if (existingItem) {
        // 이미 존재하는 경우 quantity를 합산
        existingItem.quantity += item.quantity;
      } else {
        // 존재하지 않는 경우 새로 추가
        equipmentList.push({ id: item.equipmentId, quantity: item.quantity });
      }
    });

  return equipmentList;
};

export const checkEquipmentAvailability = async ({
  dateRange,
  equipmentItemList,
  groupEquipmentList,
}: {
  dateRange: { startDate: string; endDate: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
}): Promise<{
  isAvailable: boolean;
  checkedList: EquipmentAvailableItem[];
}> => {
  const equipmentList = convertEquipmentListToPayload(
    equipmentItemList,
    groupEquipmentList
  );

  try {
    const result = await postEquipmentAvailability({
      paramStartDate: dateRange.startDate,
      paramEndDate: dateRange.endDate,
      equipmentList,
    });

    return {
      isAvailable: !result.some((item) => !item.isAvailable),
      checkedList: result,
    };
  } catch (e) {
    showToast({
      message: "장비 스케줄 확인 중 에러가 발생했습니다.",
      type: "error",
    });
    throw e;
  }
};

export const checkUpdateEquipmentAvailability = async ({
  dateRange,
  equipmentItemList,
  groupEquipmentList,
  quoteId,
}: {
  dateRange: { startDate: string; endDate: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
  quoteId: QuoteItemType["id"];
}): Promise<{
  isAvailable: boolean;
  checkedList: EquipmentAvailableItem[];
}> => {
  const equipmentList = convertEquipmentListToPayload(
    equipmentItemList,
    groupEquipmentList
  );

  try {
    const result = await postEquipmentAvailabilityOnUpdate({
      paramStartDate: dateRange.startDate,
      paramEndDate: dateRange.endDate,
      equipmentList,
      paramQuoteId: quoteId,
    });

    return {
      isAvailable: !result.some((item) => !item.isAvailable),
      checkedList: result,
    };
  } catch (e) {
    showToast({
      message: "장비 스케줄 확인 중 에러가 발생했습니다.",
      type: "error",
    });
    throw e;
  }
};
