import { QuotePostPayload } from "@/app/types/quoteType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { ReservationFormState } from "../hooks/useReservationForm";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";

const getSumOfPrice = (
  field: "price" | "totalPrice",
  equipmentItemList: EquipmentListItemState[],
  groupEquipmentList: SetEquipmentStateType[]
): number => {
  const equipmentPrice = equipmentItemList.reduce(
    (prev, acc) => (prev += acc[field]),
    0
  );

  const groupEquipmentPrice = groupEquipmentList.reduce(
    (prev, acc) => (prev += acc[field]),
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
    supplyPrice: getSumOfPrice("price", equipmentItemList, groupEquipmentList),
    totalPrice: getSumOfPrice(
      "totalPrice",
      equipmentItemList,
      groupEquipmentList
    ),
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  };
};
