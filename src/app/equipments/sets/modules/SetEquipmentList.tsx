import { Margin } from "@/app/components/Margin";
import { SearchBar } from "@/app/components/SearchBar";
import styles from "./setEquipmentList.module.scss";
import {
  SetEquipmentType,
  EquipmentListItemType,
} from "@/app/types/equipmentType";

import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { useSetEquipmentList } from "../hooks/useSetEquipmentList";
import { SetEquipmentAccordion } from "./SetEquipmentAccordion";
import { isEqual } from "lodash";

type Props = {
  selectedEquipmentSetList: SetEquipmentType[];
  setSelectedEquipmentSetList: Dispatch<SetStateAction<SetEquipmentType[]>>;
};

export const SetEquipmentList = ({
  selectedEquipmentSetList,
  setSelectedEquipmentSetList,
}: Props) => {
  const {
    list = [],
    searchMenu,
    onChangeKeyword,
    onChangeSearchKey,
    keyword,
    selectedSearchKey,
    onSearch,
    fetchList,
  } = useSetEquipmentList();

  const toggleEquipmentSet = useCallback((equipmentSet: SetEquipmentType) => {
    setSelectedEquipmentSetList((prev) => {
      const selectedSetIndex = prev.findIndex(
        (set) => set.id === equipmentSet.id
      );
      if (selectedSetIndex === -1) {
        return [...prev, equipmentSet];
      } else {
        return prev.filter((set) => set.id !== equipmentSet.id);
      }
    });
  }, []);

  const addEquipmentToSet = useCallback(
    (equipment: EquipmentListItemType, targetSet: SetEquipmentType) => {
      setSelectedEquipmentSetList((prev) =>
        prev.concat({
          ...targetSet,
          equipmentList: [...targetSet.equipmentList, equipment],
        })
      );
    },
    []
  );

  const removeEquipmentFromSet = useCallback(
    (equipment: EquipmentListItemType, targetSet: SetEquipmentType) => {
      if (
        targetSet.equipmentList.length === 1 &&
        targetSet.equipmentList[0].id === equipment.id
      ) {
        setSelectedEquipmentSetList((prev) =>
          prev.filter((set) => set.id !== targetSet.id)
        );
      } else {
        setSelectedEquipmentSetList((prev) =>
          prev.map((set) =>
            set.id === targetSet.id
              ? {
                  ...set,
                  equipmentList: set.equipmentList.filter(
                    (prevEquipment) => prevEquipment.id !== equipment.id
                  ),
                }
              : set
          )
        );
      }
    },
    []
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <Margin
        top={40}
        bottom={20}
        style={{
          maxWidth: "800px",
        }}
      >
        <SearchBar
          menuList={searchMenu}
          onChangeKeyword={onChangeKeyword}
          onChangeSearchKey={onChangeSearchKey}
          keyword={keyword}
          selectedKey={selectedSearchKey}
          onSearch={onSearch}
        />
      </Margin>

      <div className={styles.equipmentListWrapper}>
        {list.map((item) => {
          const selectedSetIndex = selectedEquipmentSetList.findIndex(
            (set) => set.id === item.id
          );
          const isIncludedSet = selectedSetIndex !== -1;

          const selectedEquipmentItemList = isIncludedSet
            ? selectedEquipmentSetList[selectedSetIndex].equipmentList
            : [];

          const isAllSelected =
            isIncludedSet &&
            isEqual(selectedEquipmentItemList, item.equipmentList);

          return (
            <SetEquipmentAccordion
              key={item.id}
              hideDetailButton
              setId={item.id}
              title={item.title}
              price={item.price}
              equipmentList={item.equipmentList || []}
              selectedEquipmentList={selectedEquipmentItemList}
              isAllSelected={isAllSelected}
              toggleSelectAll={() => toggleEquipmentSet(item)}
              toggleEquipmentItem={(equipment: EquipmentListItemType) => {
                const targetSet = isIncludedSet
                  ? selectedEquipmentSetList[selectedSetIndex]
                  : { ...item, equipmentList: [] };

                const isIncludedEquipment = targetSet.equipmentList.some(
                  (selectedEquipment) => selectedEquipment.id === equipment.id
                );

                if (isIncludedEquipment) {
                  removeEquipmentFromSet(equipment, targetSet);
                } else {
                  addEquipmentToSet(equipment, targetSet);
                }
              }}
            />
          );
        })}
      </div>
    </>
  );
};
