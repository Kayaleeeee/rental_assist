import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { Margin } from "@/app/components/Margin";
import { SearchBar } from "@/app/components/SearchBar";
import { SetEquipmentListItemType } from "@/app/types/equipmentType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";

const columns: GridColDef<SetEquipmentListItemType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("세트"),
    renderCell: ({ row }) => (
      <Link
        href={`/equipments/full_sets/${row.id}`}
        style={{
          fontWeight: 700,
        }}
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
  list: SetEquipmentListItemType[];
  searchMenu: { title: string; key: string }[];
  onChangeKeyword: (value: string) => void;
  onChangeSearchKey: (value: string) => void;
  keyword: string;
  selectedSearchKey: string;
  onSearch: () => void;
  onSelectCell: (row: SetEquipmentListItemType) => void;
};

export const FullSetListTable = ({
  list,
  searchMenu,
  onChangeKeyword,
  onChangeSearchKey,
  keyword,
  selectedSearchKey,
  onSearch,
  onSelectCell,
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

      <DataGrid<SetEquipmentListItemType>
        checkboxSelection
        onCellClick={({ row }) => onSelectCell(row)}
        columns={columns}
        rows={list}
        getRowId={(cell) => cell.id}
        sx={{
          background: "white",
          width: "100%",
          flex: 1,
          minHeight: "400px",
          borderRadius: "16px",
          marginTop: "24px",
        }}
      />
    </>
  );
};
