import { ReservationPostPayload } from "@/app/types/reservationType";
import { apiGet, apiPost } from "..";

const apiUrl = "/reservations";

export const postReservation = (payload: ReservationPostPayload) => {
  return apiPost(apiUrl, payload);
};

export const getReservationList = () => {
  return apiGet(apiUrl);
};

export const getReservationDetail = () => {};
