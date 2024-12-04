import { getEquipmentDetail } from "@/app/api/equipments";
import { EquipmentDetailType } from "@/app/types/equipmentType";
import { useEffect, useState } from "react";

export const useEquipmentDetail = (id: number) => {
  const [detail, setDetail] = useState<EquipmentDetailType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isNaN(id)) return;

    setIsLoading(true);
    getEquipmentDetail(id)
      .then((res) => setDetail(res[0]))
      .catch(() => setDetail(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { detail, isLoading };
};
