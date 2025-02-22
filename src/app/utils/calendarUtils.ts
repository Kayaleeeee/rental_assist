import dayjs, { Dayjs } from "dayjs";
import { CalendarEventType } from "../components/Calendar/MonthCalendar";
import { formatDateTimeWithLocale } from "./timeUtils";

// 하루 단위로 이벤트를 분리
export const splitEventByDay = (event: CalendarEventType) => {
  const results: CalendarEventType[] = [];
  const start = dayjs(event.start);
  const end = dayjs(event.end);

  // 하루 단위로 이벤트 분리
  let currentDate = start.startOf("day");

  const eventTitle = `${event.title} ${formatDateTimeWithLocale(
    start.toISOString()
  )} - ${formatDateTimeWithLocale(end.toISOString())}`;

  while (currentDate.isBefore(end, "day")) {
    // 하루 종일 이벤트
    results.push({
      ...event,
      id: event.id,
      title: eventTitle,
      start: currentDate.toDate(), // 하루의 시작
      end: currentDate.endOf("day").toDate(), // 하루의 끝
      allDay: true,
    });
    currentDate = currentDate.add(1, "day");
  }

  // 마지막 날 처리 (부분 시간 이벤트)
  if (currentDate.isSame(end, "day")) {
    results.push({
      ...event,
      title: eventTitle,
      id: event.id,
      start: currentDate.toDate(), // 마지막 날의 시작
      end: end.toDate(), // 실제 종료 시간
      allDay: false,
    });
  }

  return results;
};

// 주 단위로 이벤트를 분리
export const splitEventByWeek = (
  event: CalendarEventType,
  start: Dayjs,
  end: Dayjs
): CalendarEventType[] => {
  const weeks: CalendarEventType[] = [];
  let index = 1;
  let currentWeekStart = start.startOf("week");

  while (currentWeekStart.isBefore(end)) {
    const currentWeekEnd = currentWeekStart.endOf("week");

    weeks.push({
      ...event,
      id: event.id * 1000 + index,
      start: currentWeekStart.isSame(start, "week")
        ? start.toDate()
        : currentWeekStart.toDate(), // 시작 시간 조정
      end: currentWeekEnd.isAfter(end) ? end.toDate() : currentWeekEnd.toDate(), // 종료 시간 조정
    });

    currentWeekStart = currentWeekStart.add(1, "week");
    index++;
  }

  return weeks;
};
