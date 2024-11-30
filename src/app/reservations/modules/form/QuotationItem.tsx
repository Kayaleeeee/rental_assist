import { QuoteItemType } from "@/app/types/quoteType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import styles from "./quotationItemEditor.module.scss";

type Props = {
  rentalDays: number;
  quoteItem: QuoteItemType;
};

export const QuotationItem = ({ rentalDays, quoteItem }: Props) => {
  const totalPrice = quoteItem.price * quoteItem.quantity * rentalDays;

  return (
    <div className={styles.equipmentItem}>
      <div className={styles.inlineWrapper}>
        <div className={styles.title}>{quoteItem.equipmentName}</div>
      </div>
      <div className={styles.inlineWrapper}>
        <div className={styles.quantity}>
          <div className={styles.quantityNumber}>{quoteItem.quantity}개</div>
        </div>

        <div className={styles.days}>{rentalDays}일</div>
        <div className={styles.supplyPrice}>
          정가: {formatLocaleString(quoteItem.price)}원
        </div>

        <div className={styles.totalPrice}>
          {formatLocaleString(totalPrice)}원
        </div>
      </div>
    </div>
  );
};
