"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useReservationList } from "./\bhooks/useReservationList";
import { ReservationStatus, ReservationType } from "../types/reservationType";
import { HeaderName } from "../components/DataTable/HeaderName";
import { Button } from "../components/Button";
import Link from "next/link";
import { PaymentStatusText } from "./modules/PaymentStatusText";
import { ReservationStatusText } from "./modules/ReservationStatusText";

const columns: GridColDef<ReservationType>[] = [
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
    flex: 1,
  },
  {
    field: "endDate",
    renderHeader: () => HeaderName("대여 종료일"),
    flex: 1,
  },
  {
    field: "totalPrice",
    flex: 1,
    renderHeader: () => HeaderName("총 금액"),
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
  {
    field: "quoteId",
    flex: 1,
    renderHeader: () => HeaderName(""),
    renderCell: ({ row }) => (
      <Link href={`/quotes/${row.quoteId}`} target="blank">
        <Button variant="outlined" size="Small" style={{ width: "100%" }}>
          견적서 보기
        </Button>
      </Link>
    ),
  },
];

export default function ReservationListPage() {
  const { list } = useReservationList();

  return (
    <div>
      <DataGrid<ReservationType>
        columns={columns}
        rows={list}
        sx={{
          background: "white",
          width: "100%",
          height: "600px",
          borderRadius: "16px",
          marginTop: "24px",
        }}
      />
    </div>
  );
}
