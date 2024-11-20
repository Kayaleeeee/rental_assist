import { Button } from "../Button";
import styles from "./index.module.scss";
import { Label } from "../Form/Label";
import { Margin } from "../Margin";
import { DateTimeSelector } from "../DateTimeSelector";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { useEquipmentCart } from "@/app/equipments/hooks/useEquipmentCart";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

type Props = {
  onCloseCart: () => void;
};

export const Cart = ({ onCloseCart }: Props) => {
  const {
    onChangeDate,
    dateRange,
    checkAvailability,
    availableListState,
    resetCart,
    isChecked,
    removeItem,
  } = useEquipmentCart();

  const handleCloseCart = () => {
    resetCart();
    onCloseCart();
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleCloseCart} />
      <div className={styles.cartContainer}>
        <section className={styles.main}>
          <h3>장비 장바구니</h3>
          <Margin bottom={16} />
          <div className={styles.dateWrapper}>
            <Label title="대여 시작일" />
            <DateTimeSelector
              value={dateRange.startDate}
              onChange={(value) => {
                if (!value) return;
                onChangeDate("startDate", value);
              }}
            />
            <Margin bottom={10} />

            <Label title="반납일" />
            <DateTimeSelector
              value={dateRange.endDate}
              onChange={(value) => {
                if (!value) return;
                onChangeDate("endDate", value);
              }}
            />
          </div>

          <Label title="장비 리스트" />
          <div className={styles.equipmentListWrapper}>
            {availableListState.map((item) => {
              const isAvailable = isChecked && item.isAvailable;
              const unavailable = isChecked && !item.isAvailable;
              const color = !isChecked
                ? "black"
                : isAvailable
                ? "var(--green)"
                : "var(--error)";

              const className = !isChecked
                ? styles.equipmentItem
                : item.isAvailable
                ? styles.availableItem
                : styles.unavailableItem;

              return (
                <div
                  key={item.id}
                  className={className}
                  onClick={
                    unavailable
                      ? () => {
                          window.open(
                            `/reservations/${item.reservationId}`,
                            "_blank"
                          );
                        }
                      : undefined
                  }
                >
                  {isAvailable && <CheckCircleOutlineIcon style={{ color }} />}
                  {unavailable && <CancelIcon style={{ color }} />}
                  <div
                    className={styles.title}
                    style={{
                      color,
                    }}
                  >
                    {item.title}
                  </div>
                  <div> {formatLocaleString(item.price)}원 / day</div>
                  <div
                    className={styles.closeButtonWrapper}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                  >
                    <CloseOutlinedIcon className={styles.closeButton} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className={styles.footer}>
          <Button
            variant="outlined"
            size="Medium"
            onClick={checkAvailability}
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            예약 가능 여부 확인하기
          </Button>
        </section>
      </div>
    </>
  );
};
