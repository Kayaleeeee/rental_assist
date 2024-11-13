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

export enum EquipmentCategory {
  camera = "camera",
  accessory = "accessory",
  full_set = "full_set",
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
