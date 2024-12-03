import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { SetEquipmentStateType } from "@/app/store/useCartStore";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef } from "@mui/x-data-grid";

const getColumns = (
  rentalDays: number
): GridColDef<SetEquipmentStateType>[] => [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
    renderCell: ({ row }) => row.title,
    flex: 1,
  },
  {
    field: "price",
    renderHeader: () => HeaderName("단가"),
    renderCell: ({ row }) => formatLocaleString(row.price),
  },
  {
    field: "rentalDays",
    renderHeader: () => HeaderName("대여기간"),
    renderCell: () => <>{rentalDays}일</>,
  },
  {
    field: "totalPrice",
    flex: 1,
    renderHeader: () => HeaderName("총 금액"),
    renderCell: ({ row }) => <>{formatLocaleString(row.totalPrice)}일</>,
  },
];

type Props = {
  rentalDays: number;
};

export const ReservationGroupTable = ({ rentalDays }: Props) => {
  return (
    <GridTable<SetEquipmentStateType>
      apiRef={apiRef}
      rows={treeDataRows}
      columns={getColumns(rentalDays)}
      treeData
      groupingColDef={{
        headerName: "Group",
        width: 150,
      }}
      // getTreeDataPath={(row) => [row.category]} // Group by category
      // experimentalFeatures={{ rowGrouping: true }}
      // initialState={{
      //   rowGrouping: {
      //     model: ["category"], // Default grouping column
      //   },
      // }}
    />
  );
};
