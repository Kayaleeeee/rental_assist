import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import styles from "./setEquipmentItemEditor.module.scss";
import { EquipmentListItemType } from "@/app/types/equipmentType";

type Props = {
  isSelected: boolean;
  item: EquipmentListItemType;
  toggleItem: (item: EquipmentListItemType) => void;
};

export const SetEquipmentItem = ({ item, toggleItem, isSelected }: Props) => {
  return (
    <div className={styles.wrapper} onClick={() => toggleItem(item)}>
      {isSelected ? <CheckBox /> : <CheckBoxOutlineBlank />}
      <div className={styles.title}>{item.title}</div>
      <div className={styles.quantity}>
        <div className={styles.quantityNumber}>{item.quantity} 개</div>
      </div>
    </div>
  );
};
