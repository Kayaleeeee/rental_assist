import { EquipmentListItemState } from "@/app/store/useCartStore";
import { useCallback, useState } from "react";

export const useEquipmentItemState = () => {
  const [equipmentItemList, setEquipmentItemList] = useState<
    EquipmentListItemState[]
  >([]);

  const handleAddEquipmentList = useCallback(
    (equipmentList: EquipmentListItemState[]) => {
      setEquipmentItemList((prev) => [...prev, ...equipmentList]);
    },
    []
  );

  const handleSetEquipmentList = useCallback(
    (equipmentList: EquipmentListItemState[]) => {
      setEquipmentItemList(equipmentList);
    },
    []
  );

  const handleDeleteEquipmentItem = useCallback(
    (itemId: EquipmentListItemState["equipmentId"]) => {
      setEquipmentItemList((prev) =>
        prev.filter((item) => item.equipmentId !== itemId)
      );
    },
    []
  );

  const handleChangeEquipmentItem = (equipmentItem: EquipmentListItemState) => {
    setEquipmentItemList((prev) =>
      prev.map((prevItem) =>
        prevItem.equipmentId === equipmentItem.equipmentId
          ? equipmentItem
          : prevItem
      )
    );
  };

  return {
    equipmentItemList,
    handleAddEquipmentList,
    handleDeleteEquipmentItem,
    handleChangeEquipmentItem,
    handleSetEquipmentList,
  };
};
