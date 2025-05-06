import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const getDiffDays = (startTime: string, endTime: string) => {
  const diffHours = Math.abs(dayjs(startTime).diff(dayjs(endTime), "hour"));
  const diffDays = Math.ceil(diffHours / 24);

  if (diffDays === 0) return 1;
  return Math.abs(diffDays);
};

export const formatDateTime = (dateTime: string, format?: string) => {
  return dayjs(dateTime)
    .locale("ko")
    .format(format || "YYYY-MM-DD HH:mm");
};

export const formatDateTimeWithLocale = (dateTime: string) => {
  return dayjs(dateTime).locale("ko").format("YYYY-MM-DD LT");
};

export const isDateRangeOverlap = (
  { startDate, endDate }: { startDate: string; endDate: string },
  { newStartDate, newEndDate }: { newStartDate: string; newEndDate: string }
) => {
  const start1 = dayjs(startDate);
  const end1 = dayjs(endDate);
  const start2 = dayjs(newStartDate);
  const end2 = dayjs(newEndDate);

  return start1.isBefore(end2) && start2.isBefore(end1);
};

export const getPaddingDateRange = ({
  currentTime,
  timeDiffUnit,
  paddingNumber,
  paddingUnit,
}: {
  currentTime: Dayjs;
  timeDiffUnit: "day" | "month" | "year" | "week";
  paddingNumber: number;
  paddingUnit: "day" | "month" | "year" | "week";
}) => {
  return {
    startDate: currentTime
      .startOf(timeDiffUnit)
      .subtract(paddingNumber, paddingUnit)
      .format("YYYY-MM-DD HH:mm:ss"),
    endDate: currentTime
      .endOf(timeDiffUnit)
      .add(paddingNumber, paddingUnit)
      .format("YYYY-MM-DD HH:mm:ss"),
  };
};

export const getIsBetween = (
  target: string,
  dateRange: { start: string; end: string }
) => {
  const targetDate = dayjs(target);
  const startDate = dayjs(dateRange.start);
  const endDate = dayjs(dateRange.end);

  const isSameAndBefore = targetDate.isSameOrBefore(endDate, "second");
  const isSameAndAfter = targetDate.isSameOrAfter(startDate, "second");

  return isSameAndBefore && isSameAndAfter;
};

export const isAfter = (baseDate: string, targetDate: string) => {
  const base = dayjs(baseDate);
  const target = dayjs(targetDate);

  return target.isBefore(base);
};

export const addDays = (date: string, days: number, format?: string) => {
  return dayjs(date)
    .add(days, "day")
    .format(format || "YYYY-MM-DD");
};
