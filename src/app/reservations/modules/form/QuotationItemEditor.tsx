import styles from "./quotationItemEditor.module.scss";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { EquipmentListItemState } from "@/app/store/useCartStore";

type Props = {
  rentalDays: number;
  quoteState: EquipmentListItemState;
  onChangeField: (item: EquipmentListItemState) => void;
  onDeleteEquipment: () => void;
};

export const QuotationItemEditor = ({
  quoteState,
  rentalDays,
  onChangeField,
  onDeleteEquipment,
}: Props) => {
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
    <div className={styles.wrapper}>
      <div className={styles.title}>{quoteState.title}</div>
      <div className={styles.quantity}>
        <div className={styles.quantityButton} onClick={onClickMinus}>
          {" "}
          -{" "}
        </div>
        <div className={styles.quantityNumber}>{quoteState.quantity}</div>
        <div className={styles.quantityButton} onClick={onClickPlus}>
          {" "}
          +{" "}
        </div>
      </div>

      <div className={styles.days}>{rentalDays}일</div>
      <div className={styles.supplyPrice}>
        정가: {formatLocaleString(quoteState.price)}원
      </div>

      <div className={styles.price}>
        {formatLocaleString(quoteState.totalPrice)}원
      </div>
      <div className={styles.deleteButtonWrapper} onClick={onDeleteEquipment}>
        <CloseOutlinedIcon className={styles.closeButton} />
      </div>
    </div>
  );
};
