import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { useCallback, useState } from "react";

export const useGroupEquipmentState = () => {
  const [equipmentGroupList, setEquipmentGroupList] = useState<
    SetEquipmentStateType[]
  >([]);

  const handleAddEquipmentGroup = useCallback(
    (groupList: SetEquipmentStateType[]) => {
      setEquipmentGroupList((prev) => [...prev, ...groupList]);
    },
    []
  );

  const handleSetEquipmentGroup = useCallback(
    (setList: SetEquipmentStateType[]) => {
      setEquipmentGroupList(setList);
    },
    []
  );

  const handleDeleteGroupEquipment = useCallback(
    (setId: SetEquipmentStateType["setId"]) => {
      setEquipmentGroupList((prev) =>
        prev.filter((set) => set.setId !== setId)
      );
    },
    []
  );

  const handleChangeGroupEquipment = (setEquipment: SetEquipmentStateType) => {
    setEquipmentGroupList((prev) =>
      prev.map((set) => (set.setId === setEquipment.setId ? setEquipment : set))
    );
  };

  const handleDeleteGroupEquipmentItem = (
    setEquipment: SetEquipmentStateType,
    equipmentItemId: EquipmentListItemState["equipmentId"]
  ) => {
    setEquipmentGroupList((prev) =>
      prev.map((prevSet) =>
        prevSet.setId === setEquipment.setId
          ? {
              ...prevSet,
              equipmentList: prevSet.equipmentList.filter(
                (item) => item.equipmentId !== equipmentItemId
              ),
            }
          : prevSet
      )
    );
  };

  return {
    equipmentGroupList,
    handleDeleteGroupEquipment,
    handleDeleteGroupEquipmentItem,
    handleChangeGroupEquipment,
    handleAddEquipmentGroup,
    handleSetEquipmentGroup,
  };
};
