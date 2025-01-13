import { ListParamsType } from "./listType";
import { QuoteSetType } from "./quoteType";
import { ReservationType } from "./reservationType";
import { UserType } from "./userType";

export type EquipmentListItemType = {
  id: number;
  title: string;
  price: number;
  category: string;
  detail?: string;
  disabled?: boolean;
  quantity: number;
};

export type EquipmentWithAvailabilityType = EquipmentListItemType & {
  isAvailable: boolean;
  remainQuantity: number;
};

export type EquipmentDetailType = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  category: string;
  detail: string;
  disabled: boolean;
  memo?: string;
};

export type EquipmentPostBody = {
  title: string;
  price?: number;
  quantity: number;
  category: EquipmentCategory;
  detail: string;
  disabled?: boolean;
  memo?: string;
};

export type EquipmentListParams = ListParamsType<{
  category?: EquipmentCategory | string;
  title?: string;
  disabled?: boolean;
  order?: string;
}>;

export type EquipmentWithAvailabilitySearchParams = EquipmentListParams & {
  startDate: string;
  endDate: string;
  excludeReservationId?: number;
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
  other = "other",
  tripod = "tripod",
  gimbal = "gimbal",
  grip = "grip",
  lens_adaptor = "lens_adaptor",
  wireless_focus = "wireless_focus",
  wireless_transmitter = "wireless_transmitter",
  monitor = "monitor",
  frame = "frame",
  sound = "sound",
  matte_box = "matte_box",
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
    case EquipmentCategory.tripod:
      return { key, title: "트라이팟" };
    case EquipmentCategory.gimbal:
      return { key, title: "짐벌" };
    case EquipmentCategory.grip:
      return { key, title: "그립" };
    case EquipmentCategory.lens_adaptor:
      return { key, title: "렌즈 어댑터" };
    case EquipmentCategory.wireless_focus:
      return { key, title: "무선 포커스" };
    case EquipmentCategory.wireless_transmitter:
      return { key, title: "무선 송수신기" };
    case EquipmentCategory.monitor:
      return { key, title: "모니터" };
    case EquipmentCategory.frame:
      return { key, title: "프레임" };
    case EquipmentCategory.sound:
      return { key, title: "사운드" };
    case EquipmentCategory.matte_box:
      return { key, title: "매트박스" };
    default:
      return { key, title: "ETC" };
  }
});

export type EquipmentItemWithRentedDates = {
  equipmentId: EquipmentListItemType["id"];
  title: string;
  price: number;
  category: string;
  detail: string;
  quantity: number;
  rentedDates: { startDate: string; endDate: string }[];
  reservationId: ReservationType["id"];
  userName: UserType["name"];
  userId: UserType["id"];
};

export type SetEquipmentType = {
  id: number;
  title: string;
  detail: string;
  price: number;
  discountPrice?: number;
  totalPrice: number;
  equipmentList: EquipmentListItemType[];
  memo?: string;
  disabled?: boolean;
};

export type SetEquipmentListItemType = {
  id: number;
  title: string;
  detail: string;
  price: number;
};

export type SetEquipmentPayload = {
  title: string;
  detail: string;
  price?: number;
  memo?: string;
  disabled?: boolean;
};

export type SetEquipmentItemType = {
  id: number;
  setId: SetEquipmentType["id"];
  quoteSetId?: QuoteSetType["id"];
  equipmentId: EquipmentListItemType["id"];
  quantity: number;
};

export type SetEquipmentItemPostPayload = Omit<SetEquipmentItemType, "id">;
export type SetEquipmentItemPutPayload = Partial<SetEquipmentItemPostPayload>;
export type SetEquipmentListParams = Partial<SetEquipmentItemType>;

export type SetEquipmentWithAvailabilityType = {
  id: number;
  title: string;
  detail: string;
  price: number;
  discountPrice?: number;
  totalPrice: number;
  equipmentList: EquipmentWithAvailabilityType[];
  memo?: string;
  disabled?: boolean;
};

export type SetEquipmentWithAvailabilitySearchParams = EquipmentListParams & {
  startDate: string;
  endDate: string;
  excludeReservationId?: number;
};
