import { Label } from "@/app/components/Form/Label";
import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { useEquipmentList } from "@/app/equipments/hooks/useEquipmentList";
import { EquipmentListTable } from "@/app/equipments/modules/EquipmentListTable";

import {
  EquipmentCategory,
  EquipmentCategoryList,
  EquipmentListItemType,
} from "@/app/types/equipmentType";
import { showToast } from "@/app/utils/toastUtils";

import { MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const allString = "all";

type Props = {
  onCloseModal: () => void;
  onConfirm: (list: EquipmentListItemType[]) => void;
  disabledIdList: number[];
};

export const EquipmentSearchModal = ({
  onCloseModal,
  onConfirm,
  disabledIdList,
}: Props) => {
  const [selectedEquipmentList, setSelectedEquipmentList] = useState<
    EquipmentListItemType[]
  >([]);

  const {
    list,
    selectedCategory,
    searchMenu,
    selectedSearchKey,
    keyword,
    toggleEquipmentCategory,
    onChangeKeyword,
    onChangeSearchKey,
    onSearch,
    fetchList,
    setPageModel,
    pageModel,
    searchParams,
    totalElements,
  } = useEquipmentList();

  useEffect(() => {
    fetchList(searchParams);
  }, [searchParams]);

  const toggleEquipmentList = useCallback(
    (itemList: EquipmentListItemType[]) => {
      if (itemList.some((item) => disabledIdList.includes(item.id))) {
        showToast({
          message: "이미 추가된 장비는 중복으로 추가할 수 없습니다.",
          type: "error",
        });
        return;
      }

      setSelectedEquipmentList(itemList);
    },
    [disabledIdList]
  );

  return (
    <Modal
      onCloseModal={onCloseModal}
      ButtonListWrapperStyle={{
        width: "400px",
        placeSelf: "flex-end",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onCloseModal,
        },
        {
          title: "추가하기",
          onClick: () => {
            onConfirm(selectedEquipmentList);
            onCloseModal();
          },
        },
      ]}
    >
      <div
        style={{
          width: "80vw",
          maxWidth: "900px",
          maxHeight: "80vh",
        }}
      >
        <Label title="카테고리" />
        <Select<EquipmentCategory | string>
          size="small"
          value={selectedCategory || allString}
          onChange={(event) => {
            const value =
              event.target.value === allString
                ? undefined
                : (event.target.value as EquipmentCategory | undefined);

            toggleEquipmentCategory(value);
          }}
          sx={{
            width: "200px",
            marginBottom: "10px",
          }}
        >
          <MenuItem value={allString}>전체</MenuItem>
          {EquipmentCategoryList.map((category) => {
            return (
              <MenuItem value={category.key} key={category.key}>
                {category.title}
              </MenuItem>
            );
          })}
        </Select>

        <EquipmentListTable
          list={list}
          selectedList={selectedEquipmentList}
          searchMenu={searchMenu}
          selectedSearchKey={selectedSearchKey}
          keyword={keyword}
          onChangeKeyword={onChangeKeyword}
          onChangeSearchKey={onChangeSearchKey}
          onSearch={onSearch}
          onSelectCell={toggleEquipmentList}
          setPageModel={setPageModel}
          pageModel={pageModel}
          totalElements={totalElements}
          height={"50vh"}
          isRowClickable={false}
          margin={0}
        />

        <Margin bottom={50} />
      </div>
    </Modal>
  );
};
