import { ScheduleItemType } from "@/app/types/ScheduleType";
import { ReservationType } from "@/app/types/reservationType";
import { getIsBetween } from "@/app/utils/timeUtils";

export const convertScheduleList = (
  reservationList: ReservationType[],
  dateRange: { start: string; end: string }
): {
  startSchedules: ScheduleItemType[];
  endSchedules: ScheduleItemType[];
} => {
  const startSchedules: ScheduleItemType[] = [];
  const endSchedules: ScheduleItemType[] = [];

  reservationList.forEach((reservation) => {
    if (getIsBetween(reservation.startDate, dateRange)) {
      startSchedules.push({
        id: reservation.id,
        date: reservation.startDate,
        type: "start",
        title: `${reservation.userName} [no. ${reservation.id}]`,
        userId: reservation.userId,
      });
    }

    if (getIsBetween(reservation.endDate, dateRange)) {
      endSchedules.push({
        id: reservation.id,
        date: reservation.endDate,
        type: "end",
        title: `${reservation.userName} [no. ${reservation.id}]`,
        userId: reservation.userId,
      });
    }
  });

  return {
    startSchedules,
    endSchedules,
  };
};
