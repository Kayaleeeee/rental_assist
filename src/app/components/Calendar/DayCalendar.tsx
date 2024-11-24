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

export const DayCalendar = ({
  size = 400,
  eventDateList = [],
  onClickEvent,
  currentDate,
  setCurrentDate,
  onChangePrev,
  onChangeNext,
}: CalendarProps) => {
  const today = useMemo(() => dayjs(), []);

  const MAX_DATE = useMemo(() => today.add(1, "year"), [today]);
  const MIN_DATE = useMemo(() => today.subtract(1, "year"), [today]);

  const date = useMemo(() => currentDate.date(), [currentDate]);
  const month = useMemo(() => currentDate.month() + 1, [currentDate]);
  const year = useMemo(() => currentDate.year(), [currentDate]);

  const goToPrevDay = useCallback(() => {
    if (currentDate.isBefore(MIN_DATE)) return;
    setCurrentDate(currentDate.subtract(1, "day"));
    onChangePrev?.();
  }, [currentDate, MIN_DATE]);

  const goToNextDay = useCallback(() => {
    if (currentDate.isAfter(MAX_DATE)) return;
    setCurrentDate(currentDate.add(1, "day"));
    onChangeNext?.();
  }, [currentDate, MAX_DATE]);

  return (
    <div
      className={"dayCalendarWrapper"}
      style={{
        width: `${size}px`,
      }}
    >
      <div className="header">
        <button className="arrowButton" onClick={goToPrevDay}>
          <ArrowBackOutlinedIcon />
        </button>
        <h4>
          {year}년 {month}월 {date}일
        </h4>
        <button className="arrowButton" onClick={goToNextDay}>
          <ArrowForwardOutlinedIcon />
        </button>
      </div>
      <Calendar<CalendarEventType>
        toolbar={false}
        culture="ko"
        view="day"
        date={currentDate.toISOString()}
        localizer={localizer}
        events={eventDateList}
        onSelectEvent={onClickEvent}
      />
    </div>
  );
};
