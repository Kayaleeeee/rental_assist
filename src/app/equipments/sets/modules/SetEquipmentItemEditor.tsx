import styles from "./setEquipmentItemEditor.module.scss";
import { EquipmentListItemType } from "@/app/types/equipmentType";

type Props = {
  item: EquipmentListItemType;
  onChangeField: (item: EquipmentListItemType) => void;
  onDeleteEquipment: (id: EquipmentListItemType["id"]) => void;
};

export const SetEquipmentItemEditor = ({ item }: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{item.title}</div>
      <div className={styles.quantity}>
        <div className={styles.quantityNumber}>{item.quantity} 개</div>
      </div>
    </div>
  );
};
