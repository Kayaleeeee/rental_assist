"use client";

import { useEffect, useState } from "react";
import { WeekCalendar } from "./components/Calendar/WeekCalendar";
import { DayCalendar } from "./components/Calendar/DayCalendar";
import { CategoryList } from "./components/Category/CategoryList";
import { CalendarComponent, CalendarEventType } from "./components/Calendar";
import { Margin } from "./components/Margin";
import { useReservationList } from "./reservations/\bhooks/useReservationList";
import dayjs from "dayjs";
import { useOnMount } from "@mui/x-data-grid";

const menu = [
  { key: "month", title: "월별" },
  { key: "week", title: "주별" },
  { key: "day", title: "일별" },
];

export default function Home() {
  const [mode, setMode] = useState<string>("month");
  const size = 600;
  const [eventList, setEventList] = useState<CalendarEventType[]>([]);
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
      setMode(mode);
      setDateRange({
        startDate: currentDate.startOf(mode).toISOString(),
        endDate: currentDate.endOf(mode).toISOString(),
      });
    }
  };

  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    const params = getSearchParams();
    fetchReservationList(params);
  }, [dateRange]);

  useEffect(() => {
    const convertedEventList: CalendarEventType[] = list.map((item) => {
      return {
        id: item.id,
        title: item.userName,
        start: dayjs(item.startDate).toDate(),
        end: dayjs(item.endDate).toDate(),
      };
    });

    setEventList(convertedEventList);
  }, [list]);

  const handleChangeCalendarDate = (
    mode: string,
    direction: "prev" | "next"
  ) => {
    if (mode === "month" || mode === "week" || mode === "day") {
      const changedMonthDate =
        direction === "prev"
          ? currentDate.subtract(1, mode)
          : currentDate.add(1, mode);

      setDateRange({
        startDate: changedMonthDate.startOf(mode).toISOString(),
        endDate: changedMonthDate.endOf(mode).toISOString(),
      });
    }
  };

  useOnMount(() => {
    setDateRangeByMode(mode);
  });

  return (
    <div>
      <main>
        <CategoryList
          categoryList={menu}
          onChangeCategory={setDateRangeByMode}
          selectedCategory={mode}
        />
        <Margin bottom={30} />
        {mode === "month" && (
          <CalendarComponent
            size={size}
            eventDateList={eventList}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onChangeNext={() => handleChangeCalendarDate("month", "next")}
            onChangePrev={() => handleChangeCalendarDate("month", "prev")}
          />
        )}
        {mode === "week" && (
          <WeekCalendar
            size={size}
            eventDateList={eventList}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onChangeNext={() => handleChangeCalendarDate("week", "next")}
            onChangePrev={() => handleChangeCalendarDate("week", "prev")}
          />
        )}
        {mode === "day" && (
          <DayCalendar
            size={size}
            eventDateList={eventList}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onChangeNext={() => handleChangeCalendarDate("day", "next")}
            onChangePrev={() => handleChangeCalendarDate("day", "prev")}
          />
        )}
      </main>
    </div>
  );
}
