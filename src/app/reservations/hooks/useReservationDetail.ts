import { getReservationDetail } from "@/app/api/reservation";
import { convertReservationDetailResponseToState } from "@/app/types/mapper/convertReservationResponseToState";
import { ReservationDetailStateType } from "@/app/types/reservationType";
import { useEffect, useState } from "react";

export const useReservationDetail = (id?: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<ReservationDetailStateType>();

  const fetchDetail = async (id: number) => {
    try {
      setIsLoading(true);
      const result = await getReservationDetail(id);
      setDetail(convertReservationDetailResponseToState(result));
    } catch {
      setDetail(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchDetail(id);
  }, [id]);

  return { detail, setDetail, isLoading };
};
