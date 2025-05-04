"use client";

import { useRouter } from "next/navigation";
import { Button } from "@components/Button";
import { Margin } from "@components/Margin";
import { useCallback } from "react";
import styles from "./page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { useEquipmentCart } from "../hooks/useEquipmentCart";
import { convertGroupEquipmentToState } from "@/app/types/mapper/convertGroupEquipmentToState";
import { showToast } from "@/app/utils/toastUtils";
import { GroupEquipmentList } from "./modules/GroupEquipmentList";
import { convertEquipmentItemToState } from "@/app/types/mapper/convertEquipmentItemToState";
import { useGroupEquipmentStore } from "./store/useGroupEquipmentStore";

export default function SetEquipmentPage() {
  const router = useRouter();
  const setSelectedGroupEquipmentMap = useGroupEquipmentStore(
    (state) => state.setSelectedGroupEquipmentMap
  );
  const selectedGroupEquipmentMap = useGroupEquipmentStore(
    (state) => state.selectedGroupEquipmentMap
  );

  const { equipmentGroupList, handleSetEquipmentGroup } = useEquipmentCart();

  const handleAddToCart = useCallback(async () => {
    if (selectedGroupEquipmentMap.size === 0) return;

    const combinedGroupList = [...equipmentGroupList];

    selectedGroupEquipmentMap.forEach((selectedGroup) => {
      const existedIndex = combinedGroupList.findIndex(
        (group) => group.setId === selectedGroup.id
      );

      if (existedIndex === -1) {
        combinedGroupList.push(convertGroupEquipmentToState(selectedGroup));
      } else {
        const notIncludedEquipmentList = selectedGroup.equipmentList.filter(
          (item) => {
            return !combinedGroupList[existedIndex].equipmentList.some(
              (groupItem) => groupItem.equipmentId === item.id
            );
          }
        );

        combinedGroupList[existedIndex].equipmentList = [
          ...combinedGroupList[existedIndex].equipmentList,
          ...notIncludedEquipmentList.map(convertEquipmentItemToState),
        ];
      }
    });

    handleSetEquipmentGroup(combinedGroupList);

    showToast({
      message: "장바구니에 추가되었습니다.",
      type: "info",
    });

    setSelectedGroupEquipmentMap(new Map([]));
  }, [
    handleSetEquipmentGroup,
    selectedGroupEquipmentMap,
    equipmentGroupList,
    equipmentGroupList,
  ]);

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

      {selectedGroupEquipmentMap.size !== 0 && (
        <div className={styles.fixedFooter}>
          <Button
            size="Medium"
            style={{
              width: "250px",
            }}
            onClick={handleAddToCart}
          >
            장바구니 추가
          </Button>
        </div>
      )}
    </div>
  );
}
