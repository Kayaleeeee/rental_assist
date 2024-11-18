import dayjs from "dayjs";
import { Event } from "react-big-calendar";

export const convertRentedDaysToEvent = (date: {
  startDate: string;
  endDate: string;
}): Event => {
  return {
    start: dayjs(date.startDate).toDate(),
    end: dayjs(date.endDate).toDate(),
  };
};
