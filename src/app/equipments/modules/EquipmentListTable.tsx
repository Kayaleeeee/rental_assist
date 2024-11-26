import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { Margin } from "@/app/components/Margin";
import { SearchBar } from "@/app/components/SearchBar";

import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { PageModelType } from "@/app/types/listType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Link from "next/link";

const columns: GridColDef<EquipmentListItemType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
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
    renderHeader: () => HeaderName("단가"),
    renderCell: ({ row }) => formatLocaleString(row.price),
  },
  { field: "detail", flex: 1, renderHeader: () => HeaderName("상세설명") },
];

type Props = {
  list: EquipmentListItemType[];
  searchMenu: { title: string; key: string }[];
  onChangeKeyword: (value: string) => void;
  onChangeSearchKey: (value: string) => void;
  keyword: string;
  selectedSearchKey: string;
  onSearch: () => void;
  onSelectCell: (idList: EquipmentListItemType[]) => void;
  setPageModel: (model: PageModelType) => void;
  pageModel: PageModelType;
  totalElements: number;
};

export const EquipmentListTable = ({
  list,
  searchMenu,
  onChangeKeyword,
  onChangeSearchKey,
  keyword,
  selectedSearchKey,
  onSearch,
  onSelectCell,
  setPageModel,
  pageModel,
  totalElements,
}: Props) => {
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

      <GridTable<EquipmentListItemType>
        checkboxSelection
        onRowSelectionModelChange={(selected, details) => {
          const valueList = Array.from(
            details.api.getRowModels().values()
          ) as EquipmentListItemType[];
          const selectedList = valueList.filter((item) =>
            selected.includes(item.id)
          );

          onSelectCell(selectedList);
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
