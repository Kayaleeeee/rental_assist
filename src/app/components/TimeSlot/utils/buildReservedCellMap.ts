import { addDays, formatDateTime } from "@/app/utils/timeUtils";
import { isEmpty } from "lodash";

const HOURS = 24;

export type ReservedCell = {
  startCell: number;
  cellCount: number;
  reservationId: number;
  title?: string;
};

export type HourCell = {
  hour: number;
  count: number;
  reservationId: number | undefined;
  title?: string;
};

export const buildReservedCellMap = (
  reservations: {
    startDate: string;
    endDate: string;
    reservationId: number;
    userName: string;
  }[]
) => {
  const reservationMap = new Map<string, ReservedCell[]>([]);

  const addCell = ({
    dayKey,
    startCell,
    cellCount,
    reservationId,
    title,
  }: {
    dayKey: string;
    startCell: number;
    cellCount: number;
    reservationId: number;
    title?: string;
  }) => {
    const currentCells = reservationMap.get(dayKey) || [];

    reservationMap.set(dayKey, [
      ...currentCells,
      {
        startCell,
        cellCount,
        reservationId,
        title,
      },
    ]);
  };

  const getReservationTitle = (id: number, userName: string) => {
    return `[no. ${id}] ${userName}`;
  };

  reservations.forEach((reservation) => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    const hourDiff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    );

    const startHour = start.getHours();
    const reservationTitle = getReservationTitle(
      reservation.reservationId,
      reservation.userName
    );

    if (startHour + hourDiff > HOURS) {
      const firstDayKey = formatDateTime(start.toString(), "YYYY-MM-DD");
      const firstDayHours = HOURS - startHour;

      addCell({
        dayKey: firstDayKey,
        startCell: startHour,
        cellCount: firstDayHours,
        reservationId: reservation.reservationId,
        title: reservationTitle,
      });

      let remainingHours = hourDiff - firstDayHours;
      let dayOffset = 1;

      while (remainingHours > 0) {
        const dayKey = addDays(start.toString(), dayOffset);
        const cellCount = Math.min(remainingHours, HOURS);
        addCell({
          dayKey,
          startCell: 0,
          cellCount,
          reservationId: reservation.reservationId,
          title: reservationTitle,
        });
        remainingHours -= cellCount;
        dayOffset++;
      }
    } else {
      const dayKey = formatDateTime(start.toString(), "YYYY-MM-DD");
      addCell({
        dayKey,
        startCell: startHour,
        cellCount: hourDiff,
        reservationId: reservation.reservationId,
        title: reservationTitle,
      });
    }
  });

  return reservationMap;
};

export const buildHourCell = (reservationCell: ReservedCell[]) => {
  let hourCell: HourCell[] = Array.from({ length: HOURS }).map((_, index) => ({
    hour: index + 1,
    count: 1,
    reservationId: undefined,
  }));

  if (isEmpty(reservationCell)) hourCell;

  const sortedReservation = [...reservationCell].sort(
    (a, b) => a.startCell - b.startCell
  );

  sortedReservation.forEach((reservation) => {
    const copiedHourCell = [...hourCell];
    const modifiedCell = [
      ...copiedHourCell.slice(0, reservation.startCell),
      {
        hour: reservation.startCell,
        count: reservation.cellCount,
        reservationId: reservation.reservationId,
        title: reservation.title,
      },
      ...copiedHourCell.slice(reservation.startCell + reservation.cellCount),
    ];

    hourCell = modifiedCell;
  });

  return hourCell;
};
