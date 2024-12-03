import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { QuoteItemType } from "@/app/types/quoteType";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef } from "@mui/x-data-grid";

const getColumns = (rentalDays: number): GridColDef<QuoteItemType>[] => [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
    renderCell: ({ row }) => row.equipmentName,
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
  rows: QuoteItemType[];
  rentalDays: number;
};
export const ReservationItemTable = ({ rows, rentalDays }: Props) => {
  return (
    <GridTable<QuoteItemType>
      hideFooter
      rows={rows}
      columns={getColumns(rentalDays)}
    />
  );
};
