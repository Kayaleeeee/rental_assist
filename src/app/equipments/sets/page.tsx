"use client";

import { useRouter } from "next/navigation";
import { Button } from "@components/Button";
import { Margin } from "@components/Margin";
import styles from "./page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { GroupEquipmentList } from "./modules/GroupEquipmentList";
import { AddToCartFooter } from "./modules/AddToCartFooter/AddToCartFooter";

export default function SetEquipmentPage() {
  const router = useRouter();

  return (
    <div className={styles.relativeWrapper}>
      <div className={styles.headerTitleButtonWrapper}>
        <div className={formStyles.rightAlignButtonWrapper}>
          <Button
            style={{ width: "150px" }}
            size="Medium"
            onClick={() => router.push("/equipments/sets/create")}
          >
            풀세트 만들기
          </Button>
        </div>
      </div>

      <Margin top={40} />

      <GroupEquipmentList />
      <Margin top={120} />
      <AddToCartFooter />
    </div>
  );
}
