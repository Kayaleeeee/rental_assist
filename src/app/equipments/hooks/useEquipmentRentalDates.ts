import { getEquipmentRentedDates } from "@/app/api/equipments";
import {
  EquipmentItemWithRentedDates,
  EquipmentListItemType,
} from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";
import { useEffect, useState } from "react";

export const useEquipmentRentalDates = (id?: EquipmentListItemType["id"]) => {
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
    } catch (e) {
      showToast({
        message: "예약 히스토리를 조회하는데 실패했습니다.",
        type: "error",
      });

      setRentalInfo(undefined);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchRentalDateList(id);
  }, [id]);

  return { rentalInfo };
};
