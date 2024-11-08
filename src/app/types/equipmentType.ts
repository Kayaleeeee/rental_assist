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
  accessary = "accessary",
}
