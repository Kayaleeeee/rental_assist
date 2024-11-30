import styles from "./quotationItemEditor.module.scss";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { useCallback, useMemo, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { EditableField } from "@/app/components/EditableField";
import { QuoteEquipmentMoreMenu } from "./QuoteEquipmentMenu";

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
  const [quantityState, setQuantityState] = useState<number>(
    quoteState.quantity
  );
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  const priceDiff = useMemo(() => {
    const diff = (quoteState.totalPrice || 0) - quoteState.price * rentalDays;

    if (diff === 0) return undefined;
    return `${diff > 0 && "+"}${formatLocaleString(diff)}`;
  }, [rentalDays, quoteState.totalPrice, quoteState.price]);

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
        <div className={styles.moreIconWrapper}>
          <MoreVertOutlinedIcon
            onClick={() => setIsOpenMenu(true)}
            className={styles.iconButton}
          />

          <QuoteEquipmentMoreMenu
            menuOpen={isOpenMenu}
            closeMenu={() => setIsOpenMenu(false)}
            totalPrice={quoteState.totalPrice || 0}
            onChangeTotalPrice={(changedPrice) =>
              onChangeField({ ...quoteState, totalPrice: changedPrice })
            }
            onConfirm={(menu) => {
              if (!menu) return;

              if (menu.key === "delete") {
                onDeleteEquipment();
                return;
              }
            }}
          />
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
            <div className={styles.inlineWrapper}>
              <div className={styles.days}>{rentalDays}일</div>
              <div className={styles.supplyPrice}>
                단가: {formatLocaleString(quoteState.price)}원
              </div>
              {priceDiff && (
                <div className={styles.diffPrice}>조정 가격: {priceDiff}원</div>
              )}
            </div>
            <div className={styles.totalPrice}>
              총 {formatLocaleString(quoteState?.totalPrice || 0)}원
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
