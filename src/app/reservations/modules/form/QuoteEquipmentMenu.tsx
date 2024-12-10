import { useState } from "react";
import styles from "./quoteEquipmentMenu.module.scss";
import { Modal } from "@/app/components/Modal";
import { Margin } from "@/app/components/Margin";
import { EditableField } from "@/app/components/EditableField";
import { formatLocaleString } from "@/app/utils/priceUtils";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { Popover } from "@mui/material";

export const QUOTE_ITEM_MENU = [
  { key: "delete", title: "삭제하기" },
  { key: "price", title: "가격 변경" },
  { key: "quantity", title: "수량 변경" },
];

export const CART_ITEM_MENU = [
  { key: "delete", title: "삭제하기" },
  { key: "quantity", title: "수량 변경" },
];

export const GROUP_QUOTE_MENU = [
  { key: "delete", title: "삭제하기" },
  { key: "price", title: "가격 변경" },
  { key: "item", title: "장비 추가하기" },
];

export const CART_GROUP_MENU = [
  { key: "delete", title: "삭제하기" },
  { key: "item", title: "장비 추가하기" },
];

export const GROUP_QUOTE_ITEM_MENU = [{ key: "delete", title: "삭제하기" }];

export const GROUP_EQUIPMENT_ITEM_MENU = [
  { key: "delete", title: "삭제하기" },
  { key: "quantity", title: "수량 변경" },
];

type Props = {
  menu: { key: string; title: string }[];
  onConfirm: (menu?: { key: string; title: string }) => void;
};

export const QuoteEquipmentMoreMenu = ({ onConfirm, menu }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConfirm = (menu?: { key: string; title: string }) => {
    handleClose();
    onConfirm(menu);
  };

  return (
    <>
      <div
        className={styles.moreIconWrapper}
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
      >
        <MoreVertOutlinedIcon className={styles.iconButton} />
      </div>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        id="equipment_quote_menu"
        sx={{
          boxShadow: "var(--shadow)",
          borderRadius: "24px",
        }}
        slotProps={{
          paper: {
            style: {
              padding: "16px 0",
              borderRadius: "16px",
              boxShadow: "var(--shadow)",
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className={styles.menuListWrapper}>
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
      </Popover>
    </>
  );
};

export const PriceChangingModal = ({
  currentTotalPrice,
  currentDiscountPrice,
  onConfirm,
  onClose,
}: {
  currentTotalPrice: number;
  currentDiscountPrice: number;
  onConfirm: (price: number) => void;
  onClose: () => void;
}) => {
  const [price, setPrice] = useState<number>(currentDiscountPrice);

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

export const QuantityChangingModal = ({
  currentQuantity,
  onConfirm,
  onClose,
}: {
  currentQuantity: number;
  onConfirm: (price: number) => void;
  onClose: () => void;
}) => {
  const [quantityState, setQuantityState] = useState<number>(currentQuantity);

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
          title: "변경하기",
          onClick: () => {
            onConfirm(quantityState);
            onClose();
          },
          size: "Small",
        },
      ]}
    >
      <div className={styles.priceModalTitle}>수량 변경</div>
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
