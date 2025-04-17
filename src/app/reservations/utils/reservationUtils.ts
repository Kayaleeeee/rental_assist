import { QuotePostPayload } from "@/app/types/quoteType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";

import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import { ReservationFormState } from "../hooks/useReservationForms";

export const initialAvailability: {
  checkedList: EquipmentAvailableItem[];
} = {
  checkedList: [],
};

//equipment list 총 가격
export const getAllEquipmentTotalPrice = (list: EquipmentListItemState[]) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentTotalPrice({
      itemPrice: item.price,
      quantity: item.quantity,
      discountPrice: item.discountPrice,
    }));
  }, 0);
};

//equipment 단품 최종 가격
export const getEquipmentTotalPrice = ({
  itemPrice,
  quantity,
  discountPrice,
}: {
  itemPrice: number;
  quantity: number;
  discountPrice?: number;
}) => {
  return itemPrice * quantity - (discountPrice || 0);
};

// 세트 구성 하나당 총 가격
export const getEquipmentGroupTotalPrice = ({
  price,
  discountPrice,
}: {
  price: number;
  discountPrice?: number;
}) => {
  return price - (discountPrice || 0);
};

// 세트 리스트 최종 합산 가격
export const getAllEquipmentGroupTotalPrice = (
  list: SetEquipmentStateType[]
) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentGroupTotalPrice({
      price: item.price,
      discountPrice: item.discountPrice,
    }));
  }, 0);
};

//equipment list 정가 합산 가격
export const getAllEquipmentSupplyPrice = (list: EquipmentListItemState[]) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentSupplyPrice({
      price: item.price,
      quantity: item.quantity,
    }));
  }, 0);
};

//equipment 단품 정가
export const getEquipmentSupplyPrice = ({
  price,
  quantity,
}: {
  price: number;
  quantity: number;
}) => {
  return price * quantity;
};

// 세트 구성 하나당 공급 가격
export const getEquipmentGroupSupplyPrice = (list: SetEquipmentStateType) => {
  return list.price;
};

// 세트 리스트 정가 합산 가격
export const getAllEquipmentGroupSupplyPrice = (
  list: SetEquipmentStateType[]
) => {
  return list.reduce((prev, item) => {
    return (prev += getEquipmentGroupSupplyPrice(item));
  }, 0);
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

  if (form.rounds < 1) {
    showToast({
      message: "회차는 1회보다 작을 수 없습니다.",
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
    getAllEquipmentTotalPrice(equipmentItemList) +
    getAllEquipmentGroupTotalPrice(groupEquipmentList) -
    form.discountPrice;

  const supplyPrice =
    getAllEquipmentSupplyPrice(equipmentItemList) +
    getAllEquipmentGroupSupplyPrice(groupEquipmentList);

  return {
    ...form,
    supplyPrice,
    totalPrice,
    discountPrice: form.discountPrice,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  };
};
