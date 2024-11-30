import { useEffect, useRef, useState } from "react";
import styles from "./quoteEquipmentMenu.module.scss";
import { Modal } from "@/app/components/Modal";
import { Margin } from "@/app/components/Margin";
import { EditableField } from "@/app/components/EditableField";

const menu = [
  { key: "delete", title: "제거" },
  { key: "price", title: "가격 변경" },
];

type Props = {
  totalPrice: number;
  onChangeTotalPrice: (price: number) => void;
  onConfirm: (menu?: { key: string; title: string }) => void;
  menuOpen: boolean;
  closeMenu: () => void;
};

export const QuoteEquipmentMoreMenu = ({
  totalPrice,
  onChangeTotalPrice,
  onConfirm,
  closeMenu,
  menuOpen,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<undefined | string>(undefined);

  const handleConfirm = (menu?: { key: string; title: string }) => {
    closeMenu();

    if (!menu) {
      setMode(undefined);
      onConfirm(undefined);
    } else {
      setMode(menu.key);
      onConfirm(menu);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {mode === "price" && (
        <PriceChangingModal
          currentPrice={totalPrice}
          onClose={() => {
            handleConfirm(undefined);
          }}
          onConfirm={onChangeTotalPrice}
        />
      )}
      {menuOpen ? (
        <div id="equipment_quote_menu" ref={divRef} className={styles.wrapper}>
          {menu.map((item) => {
            return (
              <div
                key={item.key}
                className={styles.item}
                onClick={() => handleConfirm(item)}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

const PriceChangingModal = ({
  currentPrice,
  onConfirm,
  onClose,
}: {
  currentPrice: number;
  onConfirm: (price: number) => void;
  onClose: () => void;
}) => {
  const [price, setPrice] = useState<number>(currentPrice);

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
        },
        {
          title: "변경하기",
          onClick: () => {
            onConfirm(price);
            onClose();
          },
        },
      ]}
    >
      <div>
        <div className={styles.priceModalTitle}>가격 변경</div>
        <Margin top={10} bottom={10}>
          총 가격
        </Margin>
        <EditableField
          fullWidth
          value={price}
          onChange={(e) => {
            const value = Number(e.target.value);

            if (isNaN(value)) return;
            setPrice(value);
          }}
        />
        <Margin top={20} />
      </div>
    </Modal>
  );
};
