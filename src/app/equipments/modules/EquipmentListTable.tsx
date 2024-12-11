import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { SearchBar } from "@/app/components/SearchBar";
import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { PageModelType } from "@/app/types/listType";
import {
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import styles from "./equipmentListTable.module.scss";
import { Margin } from "@/app/components/Margin";
import { isEqual } from "lodash";
import { useCallback } from "react";
import { EquipmentStatusBadge } from "./EquipmentStatusBadge";

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
  { field: "quantity", width: 70, renderHeader: () => HeaderName("수량") },
  {
    field: "status",
    width: 80,
    renderHeader: () => HeaderName("장비 상태"),
    align: "center",
    renderCell: ({ row }) => (
      <div className="centered-cell">
        <EquipmentStatusBadge isDisabled={row.disabled || false} width="60px" />
      </div>
    ),
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
  height?: string;
  margin?: number;
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
  margin = 10,
}: Props) => {
  const columns = getColumns(isRowClickable);

  return (
    <div className={styles.wrapper}>
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

      <Margin top={margin} />

      <GridTable<EquipmentListItemType>
        height={height}
        checkboxSelection
        onRowSelectionModelChange={useCallback(
          (selected: GridRowSelectionModel, details: GridCallbackDetails) => {
            const valueList = Array.from(
              details.api.getRowModels().values()
            ) as EquipmentListItemType[];

            // 현재 페이지에서 선택된 항목
            const currentPageSelected = valueList.filter((item) =>
              selected.includes(item.id)
            );

            // 이전 상태와 병합
            const updatedSelectedList = [
              ...selectedList.filter(
                (item) => !list.some((row) => row.id === item.id)
              ),
              ...currentPageSelected,
            ];

            // 기존 상태와 비교
            const hasChanged = !isEqual(updatedSelectedList, selectedList);

            if (hasChanged) {
              onSelectCell(updatedSelectedList);
            }
          },
          [selectedList, list, onSelectCell]
        )}
        rowSelectionModel={selectedList.map((item) => item.id)}
        columns={columns}
        rows={list}
        getRowId={(cell) => cell.id}
        paginationModel={{
          pageSize: pageModel.limit,
          page: pageModel.offset / pageModel.limit,
        }}
        pagination
        paginationMode="server"
        rowCount={totalElements}
        onPaginationModelChange={(model: GridPaginationModel) => {
          setPageModel({
            offset: model.page * model.pageSize,
            limit: model.pageSize,
          });
        }}
      />
    </div>
  );
};
