import dayjs from "dayjs";

export const getDiffDays = (startTime: string, endTime: string) => {
  const diffDays = dayjs(startTime).diff(dayjs(endTime), "day");
  return Math.abs(diffDays) + 1;
};
