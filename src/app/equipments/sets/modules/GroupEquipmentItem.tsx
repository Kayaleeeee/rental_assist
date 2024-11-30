import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import styles from "./setEquipmentItemEditor.module.scss";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { useCallback } from "react";

type Props =
  | {
      isSelectable: true;
      isSelected: boolean;
      item: EquipmentListItemType;
      toggleItem: (item: EquipmentListItemType) => void;
    }
  | {
      isSelectable: false;
      item: EquipmentListItemType;
    };

export const GroupEquipmentItem = ({ item, ...props }: Props) => {
  const handleClickItem = useCallback(
    (item: EquipmentListItemType) => {
      if (props.isSelectable) {
        props.toggleItem(item);
      }
    },
    [props.isSelectable]
  );

  return (
    <div className={styles.wrapper} onClick={() => handleClickItem(item)}>
      {!props.isSelectable ? (
        <></>
      ) : props.isSelected ? (
        <CheckBox />
      ) : (
        <CheckBoxOutlineBlank />
      )}
      <div className={styles.title}>{item.title}</div>
      <div className={styles.quantity}>
        <div className={styles.quantityNumber}>{item.quantity} 개</div>
      </div>
    </div>
  );
};
