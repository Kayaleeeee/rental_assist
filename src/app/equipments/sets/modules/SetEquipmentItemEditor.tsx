import { EditableField } from "@/app/components/EditableField";
import styles from "./setEquipmentItemEditor.module.scss";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

type Props = {
  item: EquipmentListItemType;
  onChangeField: (item: EquipmentListItemType) => void;
  onDeleteEquipment: (id: EquipmentListItemType["id"]) => void;
};

export const SetEquipmentItemEditor = ({
  item,
  onDeleteEquipment,
  onChangeField,
}: Props) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{item.title}</div>
      <div className={styles.quantity}>
        <EditableField
          value={item.quantity}
          type="phone"
          onChange={(e) => {
            const qty = Number(e.target.value);

            if (isNaN(qty) || qty >= 100) return;
            onChangeField({ ...item, quantity: qty });
          }}
          size="small"
          sx={{
            width: "50px",
            marginRight: "10px",
          }}
        />
        개
      </div>

      <div
        className={styles.deleteButtonWrapper}
        onClick={(e) => {
          e.stopPropagation();
          onDeleteEquipment(item.id);
        }}
      >
        <CloseOutlinedIcon className={styles.closeButton} />
      </div>
    </div>
  );
};
