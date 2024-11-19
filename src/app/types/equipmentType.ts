import { ReservationType } from "./reservationType";

export type EquipmentListItemType = {
  id: number;
  title: string;
  price: number;
  category: string;
  detail: string;
};

export type EquipmentDetailType = {
  id: number;
  title: string;
  price: number;
  category: string;
  detail: string;
};

export type EquipmentPostBody = {
  title: string;
  price: number;
  category: EquipmentCategory;
  detail: string;
};

export type EquipmentListParams = {
  category?: EquipmentCategory;
  title?: string;
};

export enum EquipmentCategory {
  camera = "카메라",
  accessory = "악세서리",
  full_set = "풀세트",
  lens = "렌즈",
  body = "바디",
  action_camera = "액션캠",
  filter = "필터",
  focus = "포커스",
  shoulder_rig = "숄더리그",
  lamp = "조명",
  audio = "오디오",
  battery = "배터리",
}

export const EquipmentCategoryList: {
  key: EquipmentCategory;
  title: string;
}[] = Object.entries(EquipmentCategory).map(([key, value]) => {
  return { key: key as EquipmentCategory, title: value };
});

export type EquipmentItemWithRentedDates = {
  equipmentId: EquipmentListItemType["id"];
  title: string;
  price: number;
  category: string;
  detail: string;
  rentedDates: { startDate: string; endDate: string }[];
  reservationId: ReservationType["id"];
};

export type EquipmentItemWithRentalDatesParams = {
  category?: EquipmentCategory;
  startDate?: string;
  endDate?: string;
};
