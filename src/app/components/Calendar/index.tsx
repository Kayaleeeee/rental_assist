import dayjs from "dayjs";
import { Calendar, Event, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.scss";
import { useCallback, useMemo, useState } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = dayjsLocalizer(dayjs); // or globalizeLocalizer

type Props = {
  size?: number;
  eventDateList?: Event[];
};

export const CalendarComponent = ({
  size = 400,
  eventDateList = [],
}: Props) => {
  const today = useMemo(() => dayjs(), []);

  const MAX_DATE = useMemo(() => today.add(1, "year"), [today]);
  const MIN_DATE = useMemo(() => today.subtract(1, "year"), [today]);

  const [currentDate, setCurrentDate] = useState(today.toISOString());

  const month = useMemo(() => dayjs(currentDate).month() + 1, [currentDate]);
  const year = useMemo(() => dayjs(currentDate).year(), [currentDate]);

  const goToPrevMonth = useCallback(() => {
    if (dayjs(currentDate).isBefore(MIN_DATE)) return;
    setCurrentDate(dayjs(currentDate).subtract(1, "month").toISOString());
  }, [currentDate, MIN_DATE]);

  const goToNextMonth = useCallback(() => {
    if (dayjs(currentDate).isAfter(MAX_DATE)) return;
    setCurrentDate(dayjs(currentDate).add(1, "month").toISOString());
  }, [currentDate, MAX_DATE]);

  return (
    <div
      className="wrapper"
      style={{
        width: `${size}px`,
      }}
    >
      <div className="header">
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
      <Calendar
        toolbar={false}
        culture="ko"
        localizer={localizer}
        events={eventDateList}
        date={currentDate}
        min={dayjs(MIN_DATE).toDate()}
        startAccessor="start"
        endAccessor="end"
        style={{
          width: `${size}px`,
          height: `${size * 0.8}px`,
        }}
      />
    </div>
  );
};
