import { ScheduleItemType } from "@/app/types/ScheduleType";
import { ReservationType } from "@/app/types/reservationType";

export const convertScheduleList = (
  reservationList: ReservationType[]
): {
  startSchedules: ScheduleItemType[];
  endSchedules: ScheduleItemType[];
} => {
  const startSchedules: ScheduleItemType[] = [];
  const endSchedules: ScheduleItemType[] = [];

  reservationList.forEach((reservation) => {
    startSchedules.push({
      id: reservation.id,
      date: reservation.startDate,
      type: "start",
      title: `${reservation.userName} [no. ${reservation.id}]`,
      userId: reservation.userId,
    });

    endSchedules.push({
      id: reservation.id,
      date: reservation.endDate,
      type: "end",
      title: `${reservation.userName} [no. ${reservation.id}]`,
      userId: reservation.userId,
    });
  });

  return {
    startSchedules,
    endSchedules,
  };
};
