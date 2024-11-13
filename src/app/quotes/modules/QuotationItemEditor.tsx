import { EquipmentListItemType } from "@/app/types/equipmentType";
import styles from "./quotationItemEditor.module.scss";
import { EditableField } from "@/app/components/EditableField";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
type Props = {
  rentalDays: number;
  equipmentState: EquipmentListItemType;
  onChangeField: (item: EquipmentListItemType) => void;
  onDeleteEquipment: () => void;
};

export const QuotationItemEditor = ({
  equipmentState,
  rentalDays,
  onChangeField,
  onDeleteEquipment,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{equipmentState.title}</div>
      <div className={styles.days}>{rentalDays}일</div>
      <div className={styles.price}>
        <EditableField
          isEditable
          value={rentalDays * equipmentState.price}
          onChange={(e) => {
            const changedPrice = Number(e.target.value);
            if (isNaN(changedPrice)) return;

            onChangeField({ ...equipmentState, price: changedPrice });
          }}
        />
        원
      </div>
      <div className={styles.deleteButtonWrapper} onClick={onDeleteEquipment}>
        <CloseOutlinedIcon className={styles.closeButton} />
      </div>
    </div>
  );
};
