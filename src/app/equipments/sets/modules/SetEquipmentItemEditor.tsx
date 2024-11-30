import { EditableField } from "@/app/components/EditableField";
import styles from "./setEquipmentItemEditor.module.scss";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useCallback, useMemo } from "react";

type Props = {
  item: EquipmentListItemType;
  onChangeField: (item: EquipmentListItemType) => void;
  onDeleteEquipment: () => void;
  availableStatus?: "available" | "unavailable" | "unknown";
  reservationId?: number;
};

export const SetEquipmentItemEditor = ({
  item,
  onDeleteEquipment,
  onChangeField,
  availableStatus = "unknown",
  reservationId,
}: Props) => {
  const styleByStatus = useMemo((): {
    color: string;
    className: any;
    renderIcon?: () => React.ReactElement;
  } => {
    switch (availableStatus) {
      case "available":
        return {
          color: "var(--green)",
          className: styles.availableItem,
          renderIcon: () => (
            <CheckCircleOutlineIcon style={{ color: "var(--green)" }} />
          ),
        };
      case "unavailable":
        return {
          color: "var(--error)",
          className: styles.unavailableItem,
          renderIcon: () => (
            <CancelOutlinedIcon style={{ color: "var(--error)" }} />
          ),
        };
      case "unknown":
        return { color: "black", className: styles.equipmentItem };
    }
  }, [availableStatus]);

  const handleClickItem = useCallback(() => {
    if (availableStatus === "unavailable") {
      window.open(`/reservations/${reservationId}`, "_blank");
    }
  }, []);

  return (
    <div className={styleByStatus.className} onClick={handleClickItem}>
      {styleByStatus.renderIcon && styleByStatus.renderIcon()}
      <div
        className={styles.title}
        style={{
          color: styleByStatus.color,
        }}
      >
        {item.title}
      </div>
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
          fontSize="16px"
          slotProps={{
            input: {
              style: {
                textAlign: "right",
              },
            },
          }}
        />
        개
      </div>

      <div className={styles.deleteButtonWrapper} onClick={onDeleteEquipment}>
        <CloseOutlinedIcon className={styles.closeButton} />
      </div>
    </div>
  );
};
