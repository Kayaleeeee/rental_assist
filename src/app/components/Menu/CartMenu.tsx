import { useCartStore } from "@/app/store/useCartStore";
import styles from "./index.module.scss";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Margin } from "../Margin";
import { useMemo } from "react";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useRouter } from "next/navigation";

export const CartMenu = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { equipmentItemList, setIsCartOpen, equipmentGroupList } =
    useCartStore();

  const cartItemCount = useMemo(() => {
    return equipmentItemList.length + equipmentGroupList.length;
  }, [equipmentItemList, equipmentGroupList]);

  const onClickCartIcon = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsCartOpen(true);
  };

  return (
    <div className={styles.item} onClick={onClickCartIcon}>
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
