"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import formStyle from "@components/Form/index.module.scss";
import { useQuoteList } from "./hooks/useQuoteList";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { QuoteType } from "../types/quoteType";
import { HeaderName } from "../components/DataTable/HeaderName";
import { formatLocaleString } from "../utils/priceUtils";
import { formatDateTime } from "../utils/timeUtils";

const columns: GridColDef<QuoteType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  { field: "guestName", flex: 1, renderHeader: () => HeaderName("고객명") },

  {
    field: "startDate",
    renderHeader: () => HeaderName("대여 기간"),
    renderCell: ({ row }) => (
      <div>{`${formatDateTime(row.startDate)} - ${formatDateTime(
        row.endDate
      )}`}</div>
    ),
    flex: 2,
  },
  {
    field: "totalPrice",
    flex: 1,
    renderHeader: () => HeaderName("총금액"),
    renderCell: ({ row }) => formatLocaleString(row.totalPrice),
  },
  {
    field: "createdAt",
    flex: 1,
    renderHeader: () => HeaderName("생성일"),
    renderCell: ({ row }) => formatDateTime(row.createdAt),
  },
];

const QuoteListPage = () => {
  const router = useRouter();

  const { list } = useQuoteList();

  return (
    <div>
      <div className={formStyle.rightAlignButtonWrapper}>
        <Button
          style={{ width: "200px" }}
          size="Medium"
          onClick={() => router.push("/quotes/create")}
        >
          견적서 만들기
        </Button>
      </div>
      <DataGrid<QuoteType>
        columns={columns}
        rows={list}
        getRowId={(row) => row.id}
        onCellClick={(cell) => router.push(`/quotes/${cell.row.id}`)}
        sx={{
          background: "white",
          width: "100%",
          flex: 1,
          minHeight: "400px",
          borderRadius: "16px",
          marginTop: "24px",
        }}
      />
    </div>
  );
};

export default QuoteListPage;
