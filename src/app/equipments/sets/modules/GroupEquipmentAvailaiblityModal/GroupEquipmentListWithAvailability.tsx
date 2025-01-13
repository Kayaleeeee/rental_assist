import { Margin } from "@/app/components/Margin";
import { SearchBar } from "@/app/components/SearchBar";
import styles from "./groupEquipmentList.module.scss";
import {
  SetEquipmentType,
  EquipmentListItemType,
  SetEquipmentWithAvailabilityType,
  EquipmentWithAvailabilityType,
} from "@/app/types/equipmentType";

import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { isEmpty, isEqual } from "lodash";
import { GroupEquipmentAccordionWithAvailability } from "./GroupEquipmentAccordionWithAvailability";
import { useGroupEquipmentListWithAvailability } from "../../hooks/useGroupEquipmentListWithAvailability";

type Props = {
  selectedEquipmentSetList: SetEquipmentWithAvailabilityType[];
  setSelectedEquipmentSetList: Dispatch<
    SetStateAction<SetEquipmentWithAvailabilityType[]>
  >;
  disabledSetIdList?: SetEquipmentWithAvailabilityType["id"][];
  disabledEquipmentIdList?: EquipmentListItemType["id"][];
  dateRange: { startDate: string; endDate: string };
  excludeReservationId?: number;
};

export const GroupEquipmentListWithAvailability = ({
  selectedEquipmentSetList,
  setSelectedEquipmentSetList,
  disabledSetIdList = [],
  disabledEquipmentIdList = [],
  dateRange,
  excludeReservationId,
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
  } = useGroupEquipmentListWithAvailability({
    ...dateRange,
    excludeReservationId,
  });

  const toggleEquipmentSet = useCallback(
    (equipmentSet: SetEquipmentWithAvailabilityType) => {
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
    },
    []
  );

  const addEquipmentToSet = useCallback(
    (equipment: EquipmentWithAvailabilityType, targetSet: SetEquipmentType) => {
      setSelectedEquipmentSetList((prev) => {
        const setIndex = prev.findIndex((set) => set.id === targetSet.id);

        if (setIndex === -1) {
          return prev.concat({ ...targetSet, equipmentList: [equipment] });
        }

        const changedSet = [...prev];
        changedSet[setIndex] = {
          ...changedSet[setIndex],
          equipmentList: [...changedSet[setIndex].equipmentList, equipment],
        };

        return changedSet;
      });
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

  const getDisabledGroupEquipmentItemList = useCallback(
    (item: SetEquipmentType) => {
      const list = [...disabledEquipmentIdList];

      if (!item.disabled) return list;

      item.equipmentList.forEach((equipment) => {
        if (list.includes(equipment.id)) return;
        list.push(equipment.id);
      });

      return list;
    },
    [disabledEquipmentIdList]
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

      {isEmpty(list) ? (
        <div className={styles.emptyListWrapper}>등록된 세트가 없습니다.</div>
      ) : (
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
              <GroupEquipmentAccordionWithAvailability
                key={item.id}
                isDisabled={item.disabled}
                disabledGroup={
                  disabledSetIdList.includes(item.id) || item.disabled
                }
                disabledEquipmentIdList={getDisabledGroupEquipmentItemList(
                  item
                )}
                setId={item.id}
                title={item.title}
                price={item.price}
                hideDetailButton={false}
                equipmentList={item.equipmentList || []}
                selectedEquipmentList={selectedEquipmentItemList}
                isAllSelected={isAllSelected}
                toggleSelectAll={() => toggleEquipmentSet(item)}
                toggleEquipmentItem={(
                  equipment: EquipmentWithAvailabilityType
                ) => {
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
      )}
    </>
  );
};
