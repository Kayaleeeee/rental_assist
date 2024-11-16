import {
  ReservationDetailType,
  ReservationPostPayload,
  ReservationType,
} from "@/app/types/reservationType";
import { apiGet, apiPost } from "..";

const apiUrl = "/reservations";
const listUrl = "/reservation_list";
const detailUrl = "/reservation_detail";

export const postReservation = async (payload: ReservationPostPayload) => {
  const result = await apiPost<ReservationType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
  });

  return result[0];
};

export const getReservationList = () => {
  return apiGet<ReservationType[]>(listUrl);
};

export const getReservationDetail = (id: number) => {
  return apiGet<ReservationDetailType>(detailUrl, { id });
};
