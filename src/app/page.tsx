"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarEventType } from "./components/Calendar/MonthCalendar";
import { Margin } from "./components/Margin";
import { useReservationList } from "./reservations/hooks/useReservationList";
import dayjs from "dayjs";
import { getRandomHexColor } from "./utils/colorUtils";
import { ReservationStatus, ReservationType } from "./types/reservationType";
import { UnifiedCalendar } from "./components/Calendar/UnifiedCalendar";
import { View } from "react-big-calendar";
import styles from "./page.module.scss";
import { getPaddingDateRange } from "./utils/timeUtils";
import { convertScheduleList } from "./reservations/utils/scheduleUtils";
import { ScheduleList } from "./schedules/modules/ScheduleList";

const convertedEventList = (list: ReservationType[]): CalendarEventType[] => {
  return list.map((item) => {
    return {
      id: item.id,
      title: `${item.userName} [no. ${item.id}]`,
      start: dayjs(item.startDate).toDate(),
      end: dayjs(item.endDate).toDate(),
      color: getRandomHexColor(item.userId),
    };
  });
};

export default function Home() {
  const size = 800;
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(dayjs().startOf("day"));
  const { list, fetchReservationList, setDateRange, getSearchParams } =
    useReservationList();

  const paddingDay = () => {
    if (view === "month") return 15;
    if (view === "week") return 1;
    if (view === "day") return 1;
    return 0;
  };

  const { startDate, endDate } = useMemo(
    () =>
      getPaddingDateRange({
        currentTime: currentDate,
        timeDiffUnit: view as "month" | "day" | "week",
        paddingNumber: paddingDay(),
        paddingUnit: "day",
      }),
    [currentDate, view]
  );

  useEffect(() => {
    if (!currentDate) return;

    setDateRange({
      startDate,
      endDate,
    });

    const params = getSearchParams({
      status: ReservationStatus.confirmed,
      startDate,
      endDate,
    });

    fetchReservationList(params);
  }, [currentDate, view, startDate, endDate]);

  const eventList = useMemo(() => convertedEventList(list), [list]);

  const scheduleList = useMemo(() => {
    const dateRange = getPaddingDateRange({
      currentTime: currentDate,
      timeDiffUnit: view as "month" | "day" | "week",
      paddingNumber: 0,
      paddingUnit: "day",
    });

    return convertScheduleList(list, {
      start: dateRange.startDate,
      end: dateRange.endDate,
    });
  }, [list, currentDate, view]);

  return (
    <div>
      <main>
        <Margin bottom={30} />
        <div className={styles.calendarWrapper}>
          <UnifiedCalendar
            view={view}
            setView={setView}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            eventDateList={eventList}
            size={size}
            onClickEvent={(event) => {
              window.open(`/reservations/${event.id}`, "_blank");
            }}
          />
          <div>
            <Margin top={50} />
            <ScheduleList
              startList={scheduleList.startSchedules}
              endList={scheduleList.endSchedules}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
