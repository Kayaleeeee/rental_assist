import { ReservationStatus } from "@/app/types/reservationType";
import { useMemo } from "react";

export const ReservationStatusText = ({
  status,
}: {
  status: ReservationStatus;
}) => {
  const color = useMemo(() => {
    switch (status) {
      case ReservationStatus.canceled:
        return "#f3260c";
      case ReservationStatus.confirmed:
        return "#009cd8";
      default:
        return "#000";
    }
  }, [status]);

  return (
    <div
      style={{
        color,
        fontWeight: 700,
      }}
    >
      {getReservationStatusText(status)}
    </div>
  );
};

const getReservationStatusText = (status: ReservationStatus) => {
  switch (status) {
    case ReservationStatus.pending:
      return "대기";
    case ReservationStatus.confirmed:
      return "확정";
    case ReservationStatus.canceled:
      return "취소";
    default:
      return "대기";
  }
};
