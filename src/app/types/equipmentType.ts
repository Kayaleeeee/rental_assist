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
  camera = "camera",
  accessory = "accessory",
  lens = "lens",
  body = "body",
  action_camera = "action_camera",
  filter = "filter",
  focus = "focus",
  shoulder_rig = "shoulder_rig",
  lamp = "lamp",
  audio = "audio",
  battery = "battery",
}

export const EquipmentCategoryList: {
  key: EquipmentCategory;
  title: string;
}[] = Object.entries(EquipmentCategory).map(([entityKey]) => {
  const key = entityKey as EquipmentCategory;

  switch (key) {
    case EquipmentCategory.camera:
      return { key, title: "카메라" };
    case EquipmentCategory.accessory:
      return { key, title: "악세서리" };
    case EquipmentCategory.lens:
      return { key, title: "렌즈" };
    case EquipmentCategory.body:
      return { key, title: "바디" };
    case EquipmentCategory.action_camera:
      return { key, title: "액션캠" };
    case EquipmentCategory.filter:
      return { key, title: "필터" };
    case EquipmentCategory.focus:
      return { key, title: "포커스" };
    case EquipmentCategory.shoulder_rig:
      return { key, title: "숄더리그" };
    case EquipmentCategory.lamp:
      return { key, title: "램프" };
    case EquipmentCategory.audio:
      return { key, title: "오디오" };
    case EquipmentCategory.battery:
      return { key, title: "배터리" };
    default:
      return { key, title: "알 수 없음" };
  }
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
  equipmentId?: EquipmentListItemType["id"];
  category?: EquipmentCategory;
  startDate?: string;
  endDate?: string;
};

export type SetEquipmentType = {
  id: string;
  title: string;
  detail: string;
  equipmentList: [];
};

export type SetEquipmentPayload = {
  title: string;
  detail: string;
};

export type SetEquipmentItemType = {
  id: string;
  setId: SetEquipmentType["id"];
  equipmentId: EquipmentListItemType["id"];
  quantity: number;
};

export type SetEquipmentItemPostPayload = Omit<SetEquipmentItemType, "id">;
export type SetEquipmentItemPutPayload = Partial<SetEquipmentItemPostPayload>;
