import { getReservationDetail } from "@/app/api/reservation";
import { ReservationDetailType } from "@/app/types/reservationType";
import { useEffect, useState } from "react";

export const useReservationDetail = (id?: number) => {
  const [detail, setDetail] = useState<ReservationDetailType>();

  const fetchDetail = async (id: number) => {
    try {
      const result = await getReservationDetail(id);
      setDetail(result);
    } catch {
      setDetail(undefined);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchDetail(id);
  }, [id]);

  return { detail, setDetail };
};
