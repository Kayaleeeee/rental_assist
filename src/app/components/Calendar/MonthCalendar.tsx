import dayjs, { Dayjs } from "dayjs";
import { Calendar, Event, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.scss";
import { useCallback, useMemo } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = dayjsLocalizer(dayjs); // or globalizeLocalizer

export interface CalendarEventType extends Event {
  id: number;
  color?: string;
}

export type CalendarProps = {
  size?: number | string;
  eventDateList?: CalendarEventType[];
  onClickEvent?: (event: CalendarEventType) => void;
  currentDate: Dayjs;
  setCurrentDate: (date: Dayjs) => void;
  onChangePrev?: () => void;
  onChangeNext?: () => void;
};

export const MonthCalendar = ({
  size = 400,
  eventDateList = [],
  onClickEvent,
  currentDate,
  setCurrentDate,
}: CalendarProps) => {
  const today = useMemo(() => dayjs(), []);

  const MAX_DATE = useMemo(() => today.add(1, "year"), [today]);
  const MIN_DATE = useMemo(() => today.subtract(1, "year"), [today]);

  const month = useMemo(() => dayjs(currentDate).month() + 1, [currentDate]);
  const year = useMemo(() => dayjs(currentDate).year(), [currentDate]);

  const goToPrevMonth = useCallback(() => {
    if (dayjs(currentDate).isBefore(MIN_DATE)) return;
    setCurrentDate(dayjs(currentDate).subtract(1, "month"));
  }, [currentDate, MIN_DATE]);

  const goToNextMonth = useCallback(() => {
    if (dayjs(currentDate).isAfter(MAX_DATE)) return;
    setCurrentDate(dayjs(currentDate).add(1, "month"));
  }, [currentDate, MAX_DATE]);

  const eventStyleGetter = useCallback(
    (
      event: CalendarEventType
    ): { className?: string | undefined; style?: React.CSSProperties } => {
      return {
        style: {
          backgroundColor: event.color,
        },
      };
    },
    []
  );

  return (
    <div className="wrapper">
      <div
        className="header"
        style={{
          width: size,
        }}
      >
        <button className="arrowButton" onClick={goToPrevMonth}>
          <ArrowBackOutlinedIcon />
        </button>
        <h4>
          {year}년 {month}월
        </h4>
        <button className="arrowButton" onClick={goToNextMonth}>
          <ArrowForwardOutlinedIcon />
        </button>
      </div>
      <Calendar<CalendarEventType>
        toolbar={false}
        culture="ko"
        localizer={localizer}
        events={eventDateList}
        onSelectEvent={onClickEvent}
        date={currentDate.toISOString()}
        showMultiDayTimes
        min={dayjs(MIN_DATE).toDate()}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        style={{
          width: size,
          aspectRatio: 1.5,
        }}
      />
    </div>
  );
};
