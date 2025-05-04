import { Button } from "@/app/components/Button";
import { useGroupEquipmentStore } from "../../store/useGroupEquipmentStore";
import { useEquipmentCart } from "@/app/equipments/hooks/useEquipmentCart";
import { useCallback } from "react";
import { convertGroupEquipmentToState } from "@/app/types/mapper/convertGroupEquipmentToState";
import { convertEquipmentItemToState } from "@/app/types/mapper/convertEquipmentItemToState";
import { showToast } from "@/app/utils/toastUtils";
import styles from "./addToCartFooter.module.scss";

export const AddToCartFooter = () => {
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

  if (selectedGroupEquipmentMap.size === 0) return null;

  return (
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
  );
};
