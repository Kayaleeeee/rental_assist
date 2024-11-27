import { useCartStore } from "@/app/store/useCartStore";
import styles from "./index.module.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { isEmpty } from "lodash";
import { Margin } from "../Margin";

export const CartMenu = () => {
  const { list, setIsCartOpen } = useCartStore();

  return (
    <div className={styles.item} onClick={() => setIsCartOpen(true)}>
      <div className={styles.icon}>
        <AddShoppingCartIcon />
      </div>
      장바구니
      {!isEmpty(list) && (
        <Margin left={5}>
          <div className={styles.cartCountBadge}>{`(${list.length})`}</div>
        </Margin>
      )}
    </div>
  );
};
