import dayjs, { Dayjs } from "dayjs";
import { Calendar, Event, View, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.scss";
import { useMemo } from "react";

// Localizer 설정
const localizer = dayjsLocalizer(dayjs);

export interface CalendarEventType extends Event {
  id: number;
  color?: string;
}

export type CalendarProps = {
  size?: number;
  eventDateList?: CalendarEventType[];
  onClickEvent?: (event: CalendarEventType) => void;
  currentDate: Dayjs;
  view: Omit<View, "agenda">;
  hideHeader?: boolean;
};

export const AgendaCalendarView = ({
  size = 400,
  eventDateList = [],
  onClickEvent,
  currentDate,
  view,
  hideHeader = false,
}: CalendarProps) => {
  const headerTitle = useMemo(() => {
    const month = currentDate.month() + 1;
    const year = currentDate.year();
    const weekOfMonth = Math.ceil(
      currentDate.diff(currentDate.startOf("month"), "day") / 7 + 1
    );
    const date = currentDate.date();

    if (view === "month") return `${year}년 ${month}월`;
    if (view === "week") return `${month}월 ${weekOfMonth}주차`;
    return `${year}년 ${month}월 ${date}일`;
  }, [currentDate, view]);

  const dateLength = useMemo(() => {
    if (view === "day") return 1;
    if (view === "week") return 7;
    if (view === "month") return 31;
  }, [view]);

  return (
    <div
      style={{
        width: `${size}px`,
      }}
    >
      {!hideHeader && (
        <div className="header">
          <h4>{headerTitle}</h4>
        </div>
      )}
      <Calendar<CalendarEventType>
        toolbar={false}
        culture="ko"
        view={"agenda"}
        date={currentDate.toISOString()}
        length={dateLength}
        localizer={localizer}
        events={eventDateList}
        onSelectEvent={onClickEvent}
        messages={{
          allDay: "하루 종일",
          event: "예약",
        }}
        style={{
          width: `${size}px`,
          height: view === "month" ? `${size * 0.8}px` : undefined,
        }}
      />
    </div>
  );
};
