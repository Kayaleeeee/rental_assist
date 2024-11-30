import styles from "./quotationItemEditor.module.scss";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { useCallback, useMemo } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

type Props = {
  rentalDays: number;
  quoteState: EquipmentListItemState;
  onChangeField: (item: EquipmentListItemState) => void;
  onDeleteEquipment: () => void;
  availableStatus: "available" | "unavailable" | "unknown";
  reservationId?: number;
  quantityOnly?: boolean;
};

export const QuotationItemEditor = ({
  quoteState,
  rentalDays,
  onChangeField,
  onDeleteEquipment,
  availableStatus,
  reservationId,
  quantityOnly = false,
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

  const onClickPlus = () => {
    const newQuantity = quoteState.quantity + 1;

    onChangeField({
      ...quoteState,
      quantity: newQuantity,
      totalPrice: quoteState.price * newQuantity * rentalDays,
    });
  };

  const onClickMinus = () => {
    if (quoteState.quantity === 1) return;

    const newQuantity = quoteState.quantity - 1;

    onChangeField({
      ...quoteState,
      quantity: newQuantity,
      totalPrice: quoteState.price * newQuantity * rentalDays,
    });
  };

  return (
    <div className={styleByStatus.className} onClick={handleClickItem}>
      {styleByStatus.renderIcon && styleByStatus.renderIcon()}
      <div
        className={styles.title}
        style={{
          color: styleByStatus.color,
        }}
      >
        {quoteState.title}
      </div>
      <div className={styles.quantity}>
        <div className={styles.quantityButton} onClick={onClickMinus}>
          -
        </div>
        <div className={styles.quantityNumber}>{quoteState.quantity}</div>
        <div className={styles.quantityButton} onClick={onClickPlus}>
          +
        </div>
      </div>
      {!quantityOnly && (
        <>
          <div className={styles.days}>{rentalDays}일</div>
          <div className={styles.supplyPrice}>
            {formatLocaleString(quoteState.price)}원
          </div>
          <div className={styles.price}>
            총 {formatLocaleString(quoteState?.totalPrice || 0)}원
          </div>
        </>
      )}
      <div
        className={styles.deleteButtonWrapper}
        onClick={(e) => {
          e.stopPropagation();
          onDeleteEquipment();
        }}
      >
        <CloseOutlinedIcon className={styles.closeButton} />
      </div>
    </div>
  );
};
