import { Margin } from "@/app/components/Margin";
import { SearchBar } from "@/app/components/SearchBar";
import styles from "./groupEquipmentList.module.scss";
import {
  SetEquipmentType,
  EquipmentListItemType,
} from "@/app/types/equipmentType";

import { useCallback, useEffect } from "react";
import { useGroupEquipmentList } from "../hooks/useGroupEquipmentList";
import { GroupEquipmentAccordion } from "./GroupEquipmentAccordion";
import { isEmpty } from "lodash";

type Props = {
  disabledSetIdList?: SetEquipmentType["id"][];
  disabledEquipmentIdList?: EquipmentListItemType["id"][];
};

export const GroupEquipmentList = ({
  disabledSetIdList = [],
  disabledEquipmentIdList = [],
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
  } = useGroupEquipmentList();

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
            return (
              <GroupEquipmentAccordion
                key={item.id}
                groupEquipment={item}
                disabledGroup={
                  disabledSetIdList.includes(item.id) || item.disabled
                }
                disabledEquipmentIdList={getDisabledGroupEquipmentItemList(
                  item
                )}
                hideDetailButton={false}
              />
            );
          })}
        </div>
      )}
    </>
  );
};
