import dayjs from "dayjs";
import { Calendar, Event, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.scss";
import { useCallback, useMemo } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { CalendarProps } from ".";
// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = dayjsLocalizer(dayjs); // or globalizeLocalizer

export interface CalendarEventType extends Event {
  id: number;
}

export const WeekCalendar = ({
  size = 400,
  eventDateList = [],
  onClickEvent,
  onChangePrev,
  onChangeNext,
  currentDate,
  setCurrentDate,
}: CalendarProps) => {
  const today = useMemo(() => dayjs(), []);

  const MAX_DATE = useMemo(() => today.add(1, "year"), [today]);
  const MIN_DATE = useMemo(() => today.subtract(1, "year"), [today]);

  const month = useMemo(() => dayjs(currentDate).month() + 1, [currentDate]);

  const startOfMonth = dayjs(currentDate).startOf("month");
  const weekOfMonth =
    Math.ceil(dayjs(currentDate).diff(startOfMonth, "day") / 7) + 1;

  const goToPrevWeek = useCallback(() => {
    if (dayjs(currentDate).isBefore(MIN_DATE)) return;
    setCurrentDate(dayjs(currentDate).subtract(1, "week"));
    onChangePrev?.();
  }, [currentDate, MIN_DATE]);

  const goToNextWeek = useCallback(() => {
    if (dayjs(currentDate).isAfter(MAX_DATE)) return;
    setCurrentDate(dayjs(currentDate).add(1, "week"));
    onChangeNext?.();
  }, [currentDate, MAX_DATE]);

  return (
    <div
      className={"weekCalendarWrapper"}
      style={{
        width: `${size}px`,
      }}
    >
      <div className="header">
        <button className="arrowButton" onClick={goToPrevWeek}>
          <ArrowBackOutlinedIcon />
        </button>
        <h4>
          {month}월 {weekOfMonth}주차
        </h4>
        <button className="arrowButton" onClick={goToNextWeek}>
          <ArrowForwardOutlinedIcon />
        </button>
      </div>
      <Calendar<CalendarEventType>
        toolbar={false}
        culture="ko"
        view="week"
        date={currentDate.toISOString()}
        localizer={localizer}
        events={eventDateList}
        onSelectEvent={onClickEvent}
      />
    </div>
  );
};
