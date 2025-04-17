import styles from "./index.module.scss";
import { EditableField } from "@/app/components/EditableField";
import { Modal } from "@/app/components/Modal";
import { ModalBasicProps } from "@/app/components/Modal/useModal";
import { useState } from "react";

export interface EquipmentQuantityChangeModalProps extends ModalBasicProps {
  currentQuantity: number;
  onConfirm: (quantity: number) => void;
}

export const EquipmentQuantityChangeModal = ({
  currentQuantity,
  onConfirm,
  onCloseModal,
}: EquipmentQuantityChangeModalProps) => {
  const [quantityState, setQuantityState] = useState<number>(currentQuantity);

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
          size: "Small",
        },
        {
          title: "변경하기",
          onClick: () => {
            onConfirm(quantityState);
            onCloseModal();
          },
          size: "Small",
        },
      ]}
    >
      <div className={styles.modalTitle}>수량 변경</div>
      <div className={styles.quantityChangeRow}>
        <EditableField
          fullWidth
          value={quantityState}
          size="small"
          onChange={(e) => {
            const value = Number(e.target.value);

            if (isNaN(value)) return;
            setQuantityState(value);
          }}
        />
        개
      </div>
    </Modal>
  );
};
