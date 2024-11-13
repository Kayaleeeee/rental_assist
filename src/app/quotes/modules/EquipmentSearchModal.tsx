import { Label } from "@/app/components/Form/Label";
import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { useEquipmentList } from "@/app/equipments/hooks/useEquipmentList";
import {
  EquipmentCategory,
  EquipmentCategoryList,
  EquipmentListItemType,
} from "@/app/types/equipmentType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";

const allString = "all";
const HeaderName = (name: string) => {
  return (
    <div
      style={{
        fontWeight: 900,
      }}
    >
      {name}
    </div>
  );
};

const columns: GridColDef<EquipmentListItemType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
    flex: 1,
  },
  {
    field: "price",
    renderHeader: () => HeaderName("단가"),
    renderCell: ({ row }) => formatLocaleString(row.price),
  },
  { field: "detail", flex: 1, renderHeader: () => HeaderName("상세설명") },
];

type Props = {
  onCloseModal: () => void;
  onConfirm: (list: EquipmentListItemType[]) => void;
};

export const EquipmentSearchModal = ({ onCloseModal, onConfirm }: Props) => {
  const [selectedEquipmentList, setSelectedEquipmentList] = useState<
    EquipmentListItemType[]
  >([]);

  const { list, selectedCategory, toggleEquipmentCategory } =
    useEquipmentList();

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
          width: "900px",
          maxHeight: "80vh",
        }}
      >
        <Label title="카테고리" />
        <Select<EquipmentCategory | string>
          value={selectedCategory || allString}
          onChange={(event) => {
            const value =
              event.target.value === allString
                ? undefined
                : (event.target.value as EquipmentCategory | undefined);

            toggleEquipmentCategory(value);
          }}
          sx={{
            width: "400px",
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
        <DataGrid<EquipmentListItemType>
          checkboxSelection
          columns={columns}
          onCellClick={({ row }) =>
            setSelectedEquipmentList((prev) => [...prev, row])
          }
          rows={list}
          getRowId={(cell) => cell.id}
          sx={{
            background: "white",
            width: "100%",
            minHeight: "400px",
            borderRadius: "16px",
            marginTop: "24px",
          }}
        />
        <Margin bottom={20} />
      </div>
    </Modal>
  );
};
