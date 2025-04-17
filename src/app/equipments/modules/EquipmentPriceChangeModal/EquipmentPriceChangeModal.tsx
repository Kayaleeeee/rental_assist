import { EditableField } from "@/app/components/EditableField";
import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { ModalBasicProps } from "@/app/components/Modal/useModal";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { useState } from "react";
import styles from "./index.module.scss";

export interface EquipmentPriceChangeModalProps extends ModalBasicProps {
  currentTotalPrice: number;
  currentDiscountPrice: number;
  onConfirm: (price: number) => void;
}

export const EquipmentPriceChangeModal = ({
  currentTotalPrice,
  currentDiscountPrice,
  onConfirm,
  onCloseModal,
}: EquipmentPriceChangeModalProps) => {
  const [price, setPrice] = useState<number>(currentDiscountPrice);

  return (
    <Modal
      onCloseModal={onCloseModal}
      ButtonListWrapperStyle={{
        width: "200px",
        placeSelf: "flex-end",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onCloseModal,
        },
        {
          title: "변경하기",
          onClick: () => {
            onConfirm(price);
            onCloseModal();
          },
        },
      ]}
    >
      <div className={styles.priceModalTitle}>가격 변경</div>
      <Margin top={10} bottom={10}>
        <div className={styles.priceChangeModelText}>
          변경 전 가격: {formatLocaleString(currentTotalPrice)}원
        </div>
      </Margin>
      <Margin bottom={10}>
        <div className={styles.priceChangeModelText}>할인 금액</div>
      </Margin>
      <div className={styles.priceChangeRow}>
        <EditableField
          fullWidth
          value={price}
          size="small"
          onChange={(e) => {
            const value = Number(e.target.value);

            if (isNaN(value)) return;
            setPrice(value);
          }}
        />
        원
      </div>

      <Margin top={20} />
    </Modal>
  );
};
