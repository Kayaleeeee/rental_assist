import { Modal } from "@/app/components/Modal";
import { useCallback, useState } from "react";
import styles from "./discountModal.module.scss";
import { EditableField } from "@/app/components/EditableField";
import { Margin } from "@/app/components/Margin";
import { ModalBasicProps } from "@/app/components/Modal/useModal";

const discountMenuList = [
  { key: 10, title: "10%" },
  { key: 30, title: "30%" },
  { key: 50, title: "50%" },
];

export interface DiscountModalProps extends ModalBasicProps {
  supplyPrice: number;
  discountPrice: number;
  onConfirm: (price: number) => void;
}

export const DiscountModal = ({
  onCloseModal,
  onConfirm,
  supplyPrice,
  discountPrice,
}: DiscountModalProps) => {
  const [discountPriceState, setDiscountPriceState] =
    useState<number>(discountPrice);

  const onClickMenu = useCallback(
    (key: number) => {
      setDiscountPriceState(supplyPrice * (key / 100));
    },
    [supplyPrice]
  );

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
          title: "저장",
          size: "Small",

          onClick: () => {
            onConfirm(discountPriceState);
            onCloseModal();
          },
        },
      ]}
    >
      <div className={styles.priceModalTitle}>할인 설정</div>
      <div className={styles.contentWrapper}>
        <Margin top={16} />
        <div className={styles.categoryList}>
          {discountMenuList.map((menu) => {
            return (
              <div
                key={menu.key}
                className={styles.categoryItem}
                onClick={() => onClickMenu(menu.key)}
              >
                {menu.title}
              </div>
            );
          })}
        </div>
        <Margin top={16} />

        <div className={styles.priceChangeRow}>
          <EditableField
            fullWidth
            value={discountPriceState}
            size="small"
            onChange={(e) => {
              const value = Number(e.target.value);

              if (isNaN(value)) return;
              setDiscountPriceState(value);
            }}
          />
          원
        </div>
        <Margin top={16} />
      </div>
    </Modal>
  );
};
