import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { SearchBar } from "@/app/components/SearchBar";

import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { PageModelType } from "@/app/types/listType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import Link from "next/link";
import styles from "./equipmentListTable.module.scss";

const getColumns = (
  isRowClickable: boolean
): GridColDef<EquipmentListItemType>[] => [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
    renderCell: ({ row }) =>
      isRowClickable ? (
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
      ) : (
        row.title
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
  selectedList: EquipmentListItemType[];
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
  height?: number;
  isRowClickable?: boolean;
};

export const EquipmentListTable = ({
  list,
  selectedList,
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
  height,
  isRowClickable = true,
}: Props) => {
  const columns = getColumns(isRowClickable);
  return (
    <>
      <div className={styles.searchBarWrapper}>
        <SearchBar
          menuList={searchMenu}
          onChangeKeyword={onChangeKeyword}
          onChangeSearchKey={onChangeSearchKey}
          keyword={keyword}
          selectedKey={selectedSearchKey}
          onSearch={onSearch}
        />
      </div>

      <GridTable<EquipmentListItemType>
        height={height}
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
        rowSelectionModel={selectedList.map((item) => item.id)}
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
