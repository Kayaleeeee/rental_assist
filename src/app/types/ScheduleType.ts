import { UserType } from "./userType";

export type ScheduleItemType = {
  id: string | number;
  date: string;
  type: "start" | "end";
  title: string;
  userId?: UserType["id"];
};
