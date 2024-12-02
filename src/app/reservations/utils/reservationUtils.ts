import { QuotePostPayload } from "@/app/types/quoteType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { ReservationFormState } from "../hooks/useReservationForm";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";

//equipment list 총 가격
export const getAllEquipmentTotalPrice = (
  list: EquipmentListItemState[],
  rentalDays: number
) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentTotalPrice(item, rentalDays));
  }, 0);
};

//equipment 단품 최종 가격
export const getEquipmentTotalPrice = (
  item: EquipmentListItemState,
  rentalDays: number
) => {
  return item.price * item.quantity * rentalDays - (item.discountPrice || 0);
};

// 세트 구성 하나당 총 가격
export const getEquipmentGroupTotalPrice = (
  list: SetEquipmentStateType,
  rentalDays: number
) => {
  return list.price * rentalDays - (list.discountPrice || 0);
};

// 세트 리스트 최종 합산 가격
export const getAllEquipmentGroupTotalPrice = (
  list: SetEquipmentStateType[],
  rentalDays: number
) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentGroupTotalPrice(item, rentalDays));
  }, 0);
};

//equipment list 정가 합산 가격
export const getAllEquipmentSupplyPrice = (
  list: EquipmentListItemState[],
  rentalDays: number
) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentSupplyPrice(item, rentalDays));
  }, 0);
};

//equipment 단품 정가
export const getEquipmentSupplyPrice = (
  item: EquipmentListItemState,
  rentalDays: number
) => {
  return item.price * item.quantity * rentalDays;
};

// 세트 구성 하나당 공급 가격
export const getEquipmentGroupSupplyPrice = (
  list: SetEquipmentStateType,
  rentalDays: number
) => {
  return list.price * rentalDays;
};

// 세트 리스트 정가 합산 가격
export const getAllEquipmentGroupSupplyPrice = (
  list: SetEquipmentStateType[],
  rentalDays: number
) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentGroupSupplyPrice(item, rentalDays));
  }, 0);
};

export const getValidReservationForm = ({
  form,
  dateRange,
  equipmentItemList,
  groupEquipmentList,
  rentalDays,
}: {
  form: ReservationFormState;
  dateRange: { startDate?: string; endDate?: string };
  equipmentItemList: EquipmentListItemState[];
  groupEquipmentList: SetEquipmentStateType[];
  rentalDays: number;
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

  if (isEmpty(equipmentItemList) && isEmpty(groupEquipmentList)) {
    showToast({
      message: "장비를 선택해주세요.",
      type: "error",
    });
    return null;
  }

  const totalPrice =
    getAllEquipmentTotalPrice(equipmentItemList, rentalDays) +
    getAllEquipmentGroupTotalPrice(groupEquipmentList, rentalDays);

  const supplyPrice =
    getAllEquipmentSupplyPrice(equipmentItemList, rentalDays) +
    getAllEquipmentGroupSupplyPrice(groupEquipmentList, rentalDays);

  return {
    ...form,
    supplyPrice,
    totalPrice,
    discountPrice: supplyPrice - totalPrice,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  };
};
