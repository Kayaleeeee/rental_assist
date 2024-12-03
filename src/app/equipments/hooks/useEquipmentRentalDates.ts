import {
  getEquipmentListRentalHistoryByDate,
  getEquipmentRentalHistoryByDate,
  getEquipmentRentedDates,
} from "@/app/api/equipments";
import {
  EquipmentItemWithRentedDates,
  EquipmentListItemType,
} from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";
import { useState } from "react";

export const useEquipmentRentalDates = () => {
  const [rentalInfo, setRentalInfo] = useState<
    | {
        rentedDates: EquipmentItemWithRentedDates["rentedDates"];
        reservationId: EquipmentItemWithRentedDates["reservationId"];
        userName: EquipmentItemWithRentedDates["userName"];
      }
    | undefined
  >(undefined);

  const fetchRentalDateList = async (id: EquipmentListItemType["id"]) => {
    try {
      const result = await getEquipmentRentedDates(id);

      if (!result) {
        setRentalInfo(undefined);
      } else {
        setRentalInfo({
          rentedDates: result.rentedDates,
          reservationId: result.reservationId,
          userName: result.userName,
        });
      }
    } catch {
      showToast({
        message: "예약 히스토리를 조회하는데 실패했습니다.",
        type: "error",
      });

      setRentalInfo(undefined);
    }
  };

  const fetchSingleEquipmentRentalHistory = async (param: {
    equipmentId: EquipmentListItemType["id"];
    startDate: string;
    endDate: string;
  }) => {
    try {
      const result = await getEquipmentRentalHistoryByDate(param);

      if (!result) {
        return [];
      } else {
        return result;
      }
    } catch {
      showToast({
        message: "예약 히스토리를 조회하는데 실패했습니다.",
        type: "error",
      });
      return [];
    }
  };

  const fetchMultipleEquipmentRentalHistory = async (param: {
    idList: EquipmentListItemType["id"][];
    startDate: string;
    endDate: string;
  }) => {
    try {
      const result = await getEquipmentListRentalHistoryByDate(param);

      if (!result) {
        return [];
      } else {
        return result;
      }
    } catch {
      showToast({
        message: "예약 히스토리를 조회하는데 실패했습니다.",
        type: "error",
      });
      return [];
    }
  };

  return {
    rentalInfo,
    fetchRentalDateList,
    fetchSingleEquipmentRentalHistory,
    fetchMultipleEquipmentRentalHistory,
  };
};
