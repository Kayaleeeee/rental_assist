import { EquipmentPostBody } from "@/app/types/equipmentType";
import { apiClient } from "..";

const client = apiClient.from("equipments");

export const getEquipmentList = async () => {
  const { data, error } = await client.select("*");

  return {
    data,
    error,
  };
};

export const createEquipment = async (payload: EquipmentPostBody) => {
  const { data, error } = await client.insert([payload]);

  return { data, error };
};
