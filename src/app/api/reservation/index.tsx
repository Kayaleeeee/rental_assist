import {
  ReservationDetailResponse,
  ReservationPostPayload,
  ReservationPutPayload,
  ReservationSearchParams,
  ReservationStatus,
  ReservationType,
} from "@/app/types/reservationType";
import { apiGet, apiPatch, apiPost } from "..";
import { isEmpty, isNil } from "lodash";
import { fetchListHandler } from "../shared/utils/fecthListHandler";
import { parseReservationListParams } from "./utils";

const apiUrl = "/reservations";
const listUrl = "reservation_list";
const detailUrl = "/reservation_detail";

export const postReservation = async (payload: ReservationPostPayload) => {
  const result = await apiPost<ReservationType[]>(apiUrl, payload, {
    headers: {
      Prefer: "return=representation",
    },
  });

  return result[0];
};

export const getReservationList = (params?: ReservationSearchParams) => {
  return fetchListHandler<ReservationType>(
    listUrl,
    params,
    parseReservationListParams
  );
};

export const getReservationDetail = async (id: number) => {
  const result = await apiGet<ReservationDetailResponse[]>(detailUrl, { id });

  if (isEmpty(result)) throw new Error("No data found");

  const detail = result[0];

  return {
    ...detail,
    setList: detail.setList.map((item) => ({
      ...item,
      equipmentList: isNil(item.equipmentList) ? [] : item.equipmentList,
    })),
  };
};

export const getReservationStatusCount = async () => {
  const result = await apiGet<
    { statusCounts: { status: ReservationStatus; count: number }[] }[]
  >("reservation_counts");

  return result[0].statusCounts;
};

export const updateReservation = (
  id: number,
  payload: ReservationPutPayload
) => {
  return apiPatch(apiUrl, payload, {
    params: { id },
  });
};
