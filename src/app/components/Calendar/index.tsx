import dayjs from "dayjs";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
// import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./index.module.scss";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = dayjsLocalizer(dayjs); // or globalizeLocalizer

export const CalendarComponent = () => (
  <div className={styles.wrapper}>
    <Calendar
      localizer={localizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
    />
  </div>
);
