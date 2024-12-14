import { Modal } from "@/app/components/Modal";
import { useCallback, useState } from "react";
import styles from "./discountModal.module.scss";
import { EditableField } from "@/app/components/EditableField";
import { Margin } from "@/app/components/Margin";

const discountMenuList = [
  { key: 10, title: "10%" },
  { key: 30, title: "30%" },
  { key: 50, title: "50%" },
];

type Props = {
  supplyPrice: number;
  discountPrice: number;
  onClose: () => void;
  onConfirm: (price: number) => void;
};

export const DiscountModal = ({
  onClose,
  onConfirm,
  supplyPrice,
  discountPrice,
}: Props) => {
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
      onCloseModal={onClose}
      ButtonListWrapperStyle={{
        width: "200px",
        placeSelf: "flex-end",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onClose,
          size: "Small",
        },
        {
          title: "저장",
          size: "Small",

          onClick: () => {
            onConfirm(discountPriceState);
            onClose();
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
