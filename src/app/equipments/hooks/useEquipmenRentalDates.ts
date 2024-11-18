import { getEquipmentRentedDates } from "@/app/api/equipments";
import {
  EquipmentItemWithRentedDates,
  EquipmentListItemType,
} from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";
import { useEffect, useState } from "react";

export const useEquipmentRentalDates = (id?: EquipmentListItemType["id"]) => {
  const [rentalDateList, setRentalDateList] = useState<
    EquipmentItemWithRentedDates["rentedDates"]
  >([]);

  const fetchRentalDateList = async (id: EquipmentListItemType["id"]) => {
    try {
      const result = await getEquipmentRentedDates(id);

      setRentalDateList(result);
    } catch (e) {
      showToast({
        message: "예약 히스토리를 조회하는데 실패했습니다.",
        type: "error",
      });

      setRentalDateList([]);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchRentalDateList(id);
  }, [id]);

  return { rentalDateList };
};
