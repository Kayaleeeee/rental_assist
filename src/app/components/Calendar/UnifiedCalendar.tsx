import dayjs, { Dayjs } from "dayjs";
import { Calendar, Event, View, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./index.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { CategoryList } from "../Category/CategoryList";
import { splitEventByDay } from "@/app/utils/calendarUtils";

// Localizer 설정
const localizer = dayjsLocalizer(dayjs);

export interface CalendarEventType extends Event {
  id: number;
  color?: string;
}

export type CalendarProps = {
  size?: number;
  view: View;
  setView: (view: View) => void;

  eventDateList?: CalendarEventType[];
  onClickEvent?: (event: CalendarEventType) => void;
  currentDate: Dayjs;
  setCurrentDate: (date: Dayjs) => void;
  defaultView?: View;
  onChangePrev?: () => void;
  onChangeNext?: () => void;
};

const menu: { key: View; title: string }[] = [
  { key: "month", title: "월별" },
  { key: "week", title: "주별" },
  { key: "day", title: "일별" },
];

export const UnifiedCalendar = ({
  size = 400,
  eventDateList = [],
  onClickEvent,
  currentDate,
  setCurrentDate,
  view,
  setView,
}: CalendarProps) => {
  //   const [view, setView] = useState<View>(defaultView); // 현재 뷰 상태
  const [displayEvents, setDisplayEvents] = useState<CalendarEventType[]>([]);

  const today = useMemo(() => dayjs(), []);
  const MAX_DATE = useMemo(() => today.add(1, "year"), [today]);
  const MIN_DATE = useMemo(() => today.subtract(1, "year"), [today]);

  // 날짜와 뷰에 따른 제목 생성
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

  // 이전 버튼 동작
  const goToPrev = useCallback(() => {
    if (view === "month" && currentDate.isBefore(MIN_DATE)) return;
    if (view === "week" && currentDate.isBefore(MIN_DATE)) return;
    if (view === "day" && currentDate.isBefore(MIN_DATE)) return;

    if (view === "month") setCurrentDate(currentDate.subtract(1, "month"));
    if (view === "week") setCurrentDate(currentDate.subtract(1, "week"));
    if (view === "day") setCurrentDate(currentDate.subtract(1, "day"));
  }, [view, currentDate, MIN_DATE]);

  // 다음 버튼 동작
  const goToNext = useCallback(() => {
    if (view === "month" && currentDate.isAfter(MAX_DATE)) return;
    if (view === "week" && currentDate.isAfter(MAX_DATE)) return;
    if (view === "day" && currentDate.isAfter(MAX_DATE)) return;

    if (view === "month") setCurrentDate(currentDate.add(1, "month"));
    if (view === "week") setCurrentDate(currentDate.add(1, "week"));
    if (view === "day") setCurrentDate(currentDate.add(1, "day"));
  }, [view, currentDate, MAX_DATE]);

  // 이벤트 스타일 설정
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

  const handleViewChange = useCallback(
    (newView: View) => {
      setView(newView);

      const adjustedEvents = eventDateList.flatMap((event) => {
        if (newView === "day") {
          return splitEventByDay(event);
        } else {
          return [event];
        }
      });

      setDisplayEvents(adjustedEvents);
    },
    [eventDateList]
  );

  const handleDrillDown = useCallback(
    (date: Date, view: View) => {
      handleViewChange(view);
      setCurrentDate(dayjs(date));
    },
    [setCurrentDate, handleViewChange]
  );

  useEffect(() => {
    handleViewChange(view);
  }, [view, handleViewChange]);

  const className = useMemo(() => {
    if (view === "day") return "dayCalendarWrapper";
    if (view === "week") return "weekCalendarWrapper";
    if (view === "month") return "wrapper";
  }, [view]);

  return (
    <div>
      <CategoryList
        categoryList={menu}
        onChangeCategory={(key) => handleViewChange(key as View)}
        selectedCategory={view}
      />
      <div
        className={className}
        style={{
          width: `${size}px`,
        }}
      >
        <div className="header">
          <button className="arrowButton" onClick={goToPrev}>
            <ArrowBackOutlinedIcon />
          </button>
          <h4>{headerTitle}</h4>
          <button className="arrowButton" onClick={goToNext}>
            <ArrowForwardOutlinedIcon />
          </button>
        </div>
        <Calendar<CalendarEventType>
          toolbar={false}
          culture="ko"
          view={view}
          dayLayoutAlgorithm={"no-overlap"}
          date={currentDate.toISOString()}
          localizer={localizer}
          events={displayEvents}
          onSelectEvent={onClickEvent}
          eventPropGetter={eventStyleGetter}
          onDrillDown={handleDrillDown}
          style={{
            width: `${size}px`,
            height: view === "month" ? `${size * 0.8}px` : undefined,
          }}
        />
      </div>
    </div>
  );
};
