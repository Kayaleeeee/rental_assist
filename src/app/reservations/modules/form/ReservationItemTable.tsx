import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { GridTable } from "@/app/components/Table/GridTable";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { GridColDef } from "@mui/x-data-grid";
import { getEquipmentTotalPrice } from "../../utils/reservationUtils";
import { isEmpty, isNil } from "lodash";

const getColumns = (
  rentalDays: number
): GridColDef<EquipmentListItemState>[] => [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
    renderCell: ({ row }) => row.equipmentId,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
    renderCell: ({ row }) => row.title,
    flex: 1,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "quantity",
    renderHeader: () => HeaderName("수량"),
    renderCell: ({ row }) => <>{row.quantity}개</>,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "rentalDays",
    renderHeader: () => HeaderName("대여기간"),
    renderCell: () => <>{rentalDays}일</>,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },

  {
    field: "discountPrice",
    renderHeader: () => HeaderName("조정 금액"),
    renderCell: ({ row }) =>
      isNil(row.discountPrice) || row.discountPrice === 0
        ? "없음"
        : `${row.discountPrice > 0 ? "-" : "+"}${formatLocaleString(
            row.discountPrice
          )}원`,
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "totalPrice",
    renderHeader: () => HeaderName("총 금액"),
    renderCell: ({ row }) =>
      HeaderName(
        `${formatLocaleString(getEquipmentTotalPrice(row, rentalDays))}원`
      ),
    filterable: false,
    disableColumnMenu: true,
    sortable: false,
  },
];

type Props = {
  rows: EquipmentListItemState[];
  rentalDays: number;
};
export const ReservationItemTable = ({ rows, rentalDays }: Props) => {
  return (
    <GridTable<EquipmentListItemState>
      hideFooter
      rows={rows}
      columns={getColumns(rentalDays)}
      height={isEmpty(rows) ? "150px" : undefined}
      emptyHeight="100px"
    />
  );
};
