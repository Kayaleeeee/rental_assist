import dayjs from "dayjs";

export const getDiffDays = (startTime: string, endTime: string) => {
  const diffDays = dayjs(startTime).diff(dayjs(endTime), "day");
  return Math.abs(diffDays) + 1;
};

export const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format("YYYY-MM-DD HH:mm");
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
