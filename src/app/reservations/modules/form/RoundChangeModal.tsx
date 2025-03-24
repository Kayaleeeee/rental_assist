import { EditableField } from "@/app/components/EditableField";
import { Modal } from "@/app/components/Modal";
import { useState } from "react";
import styles from "./roundChangeModal.module.scss";
import { ModalBasicProps } from "@/app/components/Modal/useModal";

export interface RoundChangeModalProps extends ModalBasicProps {
  currentValue: number;
  onConfirm: (rounds: number) => void;
}

export const RoundChangeModal = ({
  currentValue,
  onConfirm,
  onCloseModal,
}: RoundChangeModalProps) => {
  const [state, setState] = useState<number>(currentValue);

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
            onConfirm(state);
            onCloseModal();
          },
          size: "Small",
        },
      ]}
    >
      <div className={styles.modalText}>회차 변경</div>
      <div className={styles.roundChangeRow}>
        <EditableField
          fullWidth
          value={state}
          size="small"
          onChange={(e) => {
            const value = Number(e.target.value);

            if (isNaN(value)) return;
            setState(value);
          }}
        />
        <div className={styles.row}>회차</div>
      </div>
    </Modal>
  );
};
