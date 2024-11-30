import { useCartStore } from "@/app/store/useCartStore";
import styles from "./index.module.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Margin } from "../Margin";
import { useMemo } from "react";

export const CartMenu = () => {
  const { equipmentItemList, setIsCartOpen, equipmentGroupList } =
    useCartStore();

  const cartItemCount = useMemo(() => {
    return equipmentItemList.length + equipmentGroupList.length;
  }, [equipmentItemList, equipmentGroupList]);

  return (
    <div className={styles.item} onClick={() => setIsCartOpen(true)}>
      <div className={styles.icon}>
        <AddShoppingCartIcon />
      </div>
      장바구니
      {cartItemCount > 0 && (
        <Margin left={5}>
          <div className={styles.cartCountBadge}>{`(${cartItemCount})`}</div>
        </Margin>
      )}
    </div>
  );
};
