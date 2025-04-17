import { useState } from "react";
import styles from "./quoteEquipmentMenu.module.scss";
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
