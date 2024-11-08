import { getEquipmentList } from "@/app/api/equipments";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { useEffect, useState } from "react";

export const useEquipmentList = () => {
  const [list, setList] = useState<EquipmentListItemType[]>([]);

  useEffect(() => {
    getEquipmentList()
      .then((data) => {
        setList(data || []);
      })
      .catch(() => setList([]));
  }, []);

  return {
    list,
  };
};
