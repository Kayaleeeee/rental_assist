import { getSetEquipmentDetail } from "@/app/api/equipments/setEquipments";
import { SetEquipmentType } from "@/app/types/equipmentType";
import { useEffect, useState } from "react";

export const useSetEquipmentDetail = (id: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<SetEquipmentType | null>(null);

  useEffect(() => {
    if (isNaN(id)) return;

    setIsLoading(true);
    getSetEquipmentDetail(id)
      .then((res) => setDetail(res[0]))
      .catch(() => setDetail(null))
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return { detail, isLoading };
};
