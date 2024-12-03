import styles from "./quotationItemEditor.module.scss";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { useCallback, useMemo, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { EditableField } from "@/app/components/EditableField";
import { Margin } from "@/app/components/Margin";
import { isNil } from "lodash";
import { getEquipmentTotalPrice } from "../../utils/reservationUtils";

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
  // onDeleteEquipment,
  availableStatus,
  reservationId,
  quantityOnly = false,
}: Props) => {
  const quoteItemTotalPrice = useMemo(() => {
    return getEquipmentTotalPrice(quoteState, rentalDays);
  }, [quoteState, rentalDays]);

  const [quantityState, setQuantityState] = useState<number>(
    quoteState.quantity
  );

  const priceDiff = useMemo(() => {
    const diff = quoteState.discountPrice;

    if (diff === 0 || isNil(diff)) return undefined;
    return `${diff > 0 ? "+" : ""}${formatLocaleString(diff)}`;
  }, [rentalDays, quoteState.discountPrice]);

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
      <div className={styles.inlineWrapper}>
        {styleByStatus.renderIcon && styleByStatus.renderIcon()}
        <div
          className={styles.title}
          style={{
            color: styleByStatus.color,
          }}
        >
          {quoteState.title}
        </div>
      </div>
      <div className={styles.inlineWrapper}>
        <div className={styles.quantity}>
          <EditableField
            value={quantityState}
            type="phone"
            onChange={(e) => {
              const qty = Number(e.target.value);

              if (isNaN(qty) || qty >= 100 || qty < 0) return;
              setQuantityState(qty);
            }}
            onBlur={() => {
              onChangeField({ ...quoteState, quantity: quantityState });
            }}
            size="small"
            sx={{
              width: "45px",
              marginRight: "10px",
              textAlign: "right",
            }}
            fontSize="14px"
          />
          개
        </div>
        {!quantityOnly && (
          <div className={styles.inlineWrapper}>
            <Margin right={8} />
            <div className={styles.days}>{rentalDays}일</div>
            <div className={styles.supplyPrice}>
              단가: {formatLocaleString(quoteState.price)}원
            </div>
            <Margin right={8} />
            {priceDiff && (
              <div className={styles.diffPrice}>조정 가격: {priceDiff}원</div>
            )}
          </div>
        )}
        <div className={styles.totalPrice}>
          총 {formatLocaleString(quoteItemTotalPrice)}원
        </div>
      </div>
    </div>
  );
};
