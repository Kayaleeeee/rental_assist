import styles from "./quotationItemEditor.module.scss";
import { EditableField } from "@/app/components/EditableField";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { QuotItemStateType } from "../hooks/useQuoteForm";

type Props = {
  rentalDays: number;
  quoteState: QuotItemStateType;
  onChangeField: (item: QuotItemStateType) => void;
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
      totalPrice: quoteState.price * newQuantity,
    });
  };

  const onClickMinus = () => {
    if (quoteState.quantity === 1) return;

    const newQuantity = quoteState.quantity - 1;

    onChangeField({
      ...quoteState,
      quantity: newQuantity,
      totalPrice: quoteState.price * newQuantity,
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
      <div className={styles.price}>
        <EditableField
          isEditable
          value={quoteState.totalPrice}
          onChange={(e) => {
            const changedPrice = Number(e.target.value);
            if (isNaN(changedPrice)) return;

            onChangeField({ ...quoteState, totalPrice: changedPrice });
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
