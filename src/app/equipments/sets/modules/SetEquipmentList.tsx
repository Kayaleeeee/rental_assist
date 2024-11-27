import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { Margin } from "@/app/components/Margin";
import { SearchBar } from "@/app/components/SearchBar";
import { GridTable } from "@/app/components/Table/GridTable";
import { SetEquipmentListItemType } from "@/app/types/equipmentType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Link from "next/link";

import { useCallback, useState } from "react";
import { useSetEquipmentList } from "../hooks/useSetEquipmentList";

const columns: GridColDef<SetEquipmentListItemType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("풀세트 이름"),
    renderCell: ({ row }) => (
      <Link
        href={`/equipments/${row.id}`}
        style={{
          flex: 1,
          fontWeight: 700,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {row.title}
      </Link>
    ),
    flex: 1,
  },
  {
    field: "price",
    renderHeader: () => HeaderName("가격"),
    renderCell: ({ row }) => formatLocaleString(row.price),
  },
  { field: "detail", flex: 1, renderHeader: () => HeaderName("상세설명") },
];

export const SetEquipmentList = () => {
  const [, setSelectedEquipmentList] = useState<SetEquipmentListItemType[]>([]);

  const {
    list,
    searchMenu,
    onChangeKeyword,
    onChangeSearchKey,
    keyword,
    selectedSearchKey,
    onSearch,
    setPageModel,
    pageModel,
    totalElements,
  } = useSetEquipmentList();

  const toggleEquipmentList = useCallback(
    (itemList: SetEquipmentListItemType[]) => {
      setSelectedEquipmentList(itemList);
    },
    []
  );

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

      <GridTable<SetEquipmentListItemType>
        checkboxSelection
        onRowSelectionModelChange={(selected, details) => {
          const valueList = Array.from(
            details.api.getRowModels().values()
          ) as SetEquipmentListItemType[];
          const selectedList = valueList.filter((item) =>
            selected.includes(item.id)
          );

          toggleEquipmentList(selectedList);
        }}
        columns={columns}
        rows={list}
        getRowId={(cell) => cell.id}
        paginationModel={{
          pageSize: pageModel.limit,
          page: pageModel.offset,
        }}
        pagination
        paginationMode="server"
        rowCount={totalElements}
        onPaginationModelChange={(model: GridPaginationModel) => {
          setPageModel({
            offset: model.page,
            limit: model.pageSize,
          });
        }}
      />
    </>
  );
};
