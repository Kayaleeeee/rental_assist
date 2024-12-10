import dayjs, { Dayjs } from "dayjs";

export const getDiffDays = (startTime: string, endTime: string) => {
  const diffHours = Math.abs(dayjs(startTime).diff(dayjs(endTime), "hour"));
  const diffDays = Math.ceil(diffHours / 24);

  if (diffDays === 0) return 1;
  return Math.abs(diffDays);
};

export const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).locale("ko").format("YYYY-MM-DD HH:mm");
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

export const getPaddingDateRange = (
  currentTime: Dayjs,
  paddingNumber: number,
  paddingUnit: "day" | "month" | "year"
) => {
  return {
    startDate: currentTime
      .startOf("month")
      .subtract(paddingNumber, paddingUnit)
      .format("YYYY-MM-DD"),
    endDate: currentTime
      .endOf("month")
      .add(paddingNumber, paddingUnit)
      .format("YYYY-MM-DD"),
  };
};
