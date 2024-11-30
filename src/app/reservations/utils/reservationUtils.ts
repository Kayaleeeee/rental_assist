import { QuotePostPayload } from "@/app/types/quoteType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { ReservationFormState } from "../hooks/useReservationForm";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";

const getTotalPrice = (
  equipmentItemList: EquipmentListItemState[],
  groupEquipmentList: SetEquipmentStateType[]
): number => {
  const equipmentPrice = equipmentItemList.reduce(
    (prev, acc) => (prev += acc.price),
    0
  );

  const groupEquipmentPrice = groupEquipmentList.reduce(
    (prev, acc) => (prev += acc.price),
    0
  );

  return Number(equipmentPrice + groupEquipmentPrice);
};

export const getValidReservationForm = ({
  form,
  dateRange,
  equipmentItemList,
  groupEquipmentList,
}: {
  form: ReservationFormState;
  dateRange: { startDate?: string; endDate?: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
}): QuotePostPayload | null => {
  if (!form.userId) {
    showToast({
      message: "회원을 선택해주세요.",
      type: "error",
    });
    return null;
  }

  if (!dateRange.startDate || !dateRange.endDate) {
    showToast({
      message: "대여일정을 선택해주세요.",
      type: "error",
    });
    return null;
  }

  if (isEmpty(equipmentItemList)) {
    showToast({
      message: "장비를 선택해주세요.",
      type: "error",
    });
    return null;
  }

  return {
    ...form,
    supplyPrice: getTotalPrice(equipmentItemList, groupEquipmentList),
    totalPrice: getTotalPrice(equipmentItemList, groupEquipmentList),
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  };
};
