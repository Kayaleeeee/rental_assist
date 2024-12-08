import {
  EquipmentAvailabilityPostPayload,
  EquipmentAvailableItem,
  UpdatedEquipmentAvailabilityPostPayload,
} from "@/app/types/reservationType";
import { apiPost } from "..";

export const postEquipmentAvailability = (
  payload: EquipmentAvailabilityPostPayload
) => {
  return apiPost<EquipmentAvailableItem[]>(
    "/rpc/check_equipment_availability",
    payload
  );
};

export const postEquipmentAvailabilityOnUpdate = (
  payload: UpdatedEquipmentAvailabilityPostPayload
) => {
  return apiPost<EquipmentAvailableItem[]>(
    "/rpc/check_updated_equipment_availability",
    payload
  );
};
