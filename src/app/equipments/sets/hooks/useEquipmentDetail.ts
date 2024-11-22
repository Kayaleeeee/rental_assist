import { getEquipmentDetail } from "@/app/api/equipments";
import { EquipmentDetailType } from "@/app/types/equipmentType";
import { useEffect, useState } from "react";

export const useEquipmentDetail = (id: number) => {
  const [detail, setDetail] = useState<EquipmentDetailType | null>(null);

  useEffect(() => {
    if (isNaN(id)) return;

    getEquipmentDetail(id)
      .then((res) => setDetail(res[0]))
      .catch(() => setDetail(null));
  }, [id]);

  return { detail };
};
