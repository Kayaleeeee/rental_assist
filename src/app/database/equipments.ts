import {
  EquipmentListItemType,
  EquipmentPostBody,
} from "../types/equipmentType";

export interface EqipmentDatabase {
  public: {
    Tables: {
      equipments: {
        Row: EquipmentListItemType;
        Insert: EquipmentPostBody;
      };
    };
  };
}
