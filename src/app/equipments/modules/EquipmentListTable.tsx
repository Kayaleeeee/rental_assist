import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { Margin } from "@/app/components/Margin";
import { SearchBar } from "@/app/components/SearchBar";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
  onSelectCell: (row: EquipmentListItemType) => void;
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

      <DataGrid<EquipmentListItemType>
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
