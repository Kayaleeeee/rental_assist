import { getReservationList } from "@/app/api/reservation";
import { ReservationType } from "@/app/types/reservationType";
import { showToast } from "@/app/utils/toastUtils";
import { useCallback, useEffect, useState } from "react";

export const useReservationList = () => {
  const [list, setList] = useState<ReservationType[]>([]);

  const fetchReservationList = useCallback(async () => {
    try {
      const result = await getReservationList();
      setList(result);
    } catch {
      showToast({
        message: "예약 목록을 불러오는데 실패했습니다.",
        type: "error",
      });
    }
  }, []);

  useEffect(() => {
    fetchReservationList();
  }, []);

  return {
    list,
  };
};
