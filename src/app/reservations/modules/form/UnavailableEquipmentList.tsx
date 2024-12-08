import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import styles from "./unavailableEquipmentList.module.scss";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
type Props = {
  unavailableList: EquipmentListItemState[];
};

export const UnavailableEquipmentList = ({ unavailableList }: Props) => {
  return (
    <div className={styles.unavailableList}>
      <div className={styles.title}>예약 불가 항목</div>
      {unavailableList.map((item) => {
        return (
          <div
            key={item.equipmentId}
            className={styles.unavailableItem}
            onClick={() => {
              window.open(`/equipments/${item.equipmentId}`, "_blank");
            }}
          >
            <div className={styles.itemTitleWrapper}>
              <ErrorOutlineOutlinedIcon sx={{ color: "var(--error)" }} />
              {item.title}
            </div>
            <ArrowForwardOutlinedIcon />
          </div>
        );
      })}
    </div>
  );
};
