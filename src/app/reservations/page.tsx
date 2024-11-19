"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useReservationList } from "./\bhooks/useReservationList";
import { ReservationType } from "../types/reservationType";
import { HeaderName } from "../components/DataTable/HeaderName";
import { PaymentStatusText } from "./modules/PaymentStatusText";
import { ReservationStatusText } from "./modules/ReservationStatusText";
import { Margin } from "../components/Margin";
import { useEffect } from "react";
import { getReservationStatusCount } from "../api/reservation";
import { formatLocaleString } from "../utils/priceUtils";

import { CategoryList } from "../components/Category/CategoryList";
import { formatDateTime } from "../utils/timeUtils";
import { useRouter } from "next/navigation";

const getColumns = (): GridColDef<ReservationType>[] => [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "userName",
    renderHeader: () => HeaderName("예약자 명"),
    flex: 1,
  },
  {
    field: "startDate",
    renderHeader: () => HeaderName("대여 시작일"),
    renderCell: ({ row }) => <>{formatDateTime(row.startDate)}</>,
    flex: 1,
  },
  {
    field: "endDate",
    renderCell: ({ row }) => <>{formatDateTime(row.endDate)}</>,
    renderHeader: () => HeaderName("대여 종료일"),
    flex: 1,
  },
  {
    field: "totalPrice",
    flex: 1,
    renderHeader: () => HeaderName("총 금액"),
    renderCell: ({ row }) => <>{formatLocaleString(row.totalPrice)}</>,
  },
  {
    field: "status",
    flex: 1,
    renderHeader: () => HeaderName("상태"),
    renderCell: ({ row }) => <ReservationStatusText status={row.status} />,
  },
  {
    field: "paymentStatus",
    flex: 1,
    renderCell: ({ row }) => <PaymentStatusText status={row.paymentStatus} />,
    renderHeader: () => HeaderName("결제 상태"),
  },
];

export default function ReservationListPage() {
  const router = useRouter();
  const { list, categoryList, selectedCategory, onChangeCategory } =
    useReservationList();

  useEffect(() => {
    getReservationStatusCount();
  }, []);

  const columns = getColumns();

  return (
    <div>
      <Margin top={24} />
      <CategoryList
        categoryList={categoryList}
        selectedCategory={selectedCategory}
        onChangeCategory={onChangeCategory}
      />
      <Margin top={24} />
      <DataGrid<ReservationType>
        columns={columns}
        rows={list}
        onCellClick={({ row }) =>
          router.push(`/reservations/${row.id}?quoteId=${row.quoteId}`)
        }
        sx={{
          background: "white",
          width: "100%",
          height: "600px",
          borderRadius: "16px",
        }}
      />
    </div>
  );
}
