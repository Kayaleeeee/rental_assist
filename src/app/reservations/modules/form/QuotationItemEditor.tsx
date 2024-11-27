import styles from "./quotationItemEditor.module.scss";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { useCallback } from "react";

type Props = {
  rentalDays: number;
  quoteState: EquipmentListItemState;
  onChangeField: (item: EquipmentListItemState) => void;
  onDeleteEquipment: () => void;
  availableStatus: "available" | "unavailable" | "unknown";
  onClickItem?: () => void;
  reservationId?: number;
};

export const QuotationItemEditor = ({
  quoteState,
  rentalDays,
  onChangeField,
  onDeleteEquipment,
  availableStatus,
  onClickItem,
  reservationId,
}: Props) => {
  const handleClickItem = useCallback(() => {
    if (availableStatus === "unavailable") {
      window.open(`/reservations/${reservationId}`, "_blank");
    }
  }, [onClickItem]);

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
    <div className={styles.wrapper} onClick={handleClickItem}>
      <div className={styles.title}>{quoteState.title}</div>
      <div className={styles.quantity}>
        <div className={styles.quantityButton} onClick={onClickMinus}>
          -
        </div>
        <div className={styles.quantityNumber}>{quoteState.quantity}</div>
        <div className={styles.quantityButton} onClick={onClickPlus}>
          +
        </div>
      </div>

      <div className={styles.days}>{rentalDays}일</div>
      <div className={styles.supplyPrice}>
        {formatLocaleString(quoteState.price)}원
      </div>

      <div className={styles.price}>
        총 {formatLocaleString(quoteState.totalPrice)}원
      </div>
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
