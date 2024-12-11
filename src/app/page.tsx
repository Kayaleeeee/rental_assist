"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarEventType } from "./components/Calendar/MonthCalendar";
import { Margin } from "./components/Margin";
import { useReservationList } from "./reservations/hooks/useReservationList";
import dayjs from "dayjs";
import { useOnMount } from "@mui/x-data-grid";
import { getRandomHexColor } from "./utils/colorUtils";
import { ReservationStatus, ReservationType } from "./types/reservationType";
import { UnifiedCalendar } from "./components/Calendar/UnifiedCalendar";
import { AgendaCalendarView } from "./components/Calendar/AgendaCalendarView";
import { View } from "react-big-calendar";
import styles from "./page.module.scss";

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
  const {
    dateRange,
    list,
    fetchReservationList,
    setDateRange,
    getSearchParams,
  } = useReservationList();

  const setDateRangeByMode = (mode: string) => {
    if (mode === "month" || mode === "week" || mode === "day") {
      setDateRange({
        startDate: currentDate.startOf(mode).toISOString(),
        endDate: currentDate.endOf(mode).toISOString(),
      });
    }
  };

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    const params = getSearchParams({ status: ReservationStatus.confirmed });
    fetchReservationList(params);
  }, [dateRange]);

  const eventList = useMemo(() => convertedEventList(list), [list]);

  useOnMount(() => {
    setDateRangeByMode("month");
  });

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
          />
          <div>
            <Margin top={100} />
            <AgendaCalendarView
              size={size}
              hideHeader
              currentDate={currentDate}
              eventDateList={eventList}
              view={view}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
