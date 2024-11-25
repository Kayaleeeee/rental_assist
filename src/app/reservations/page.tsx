"use client";

import { GridColDef } from "@mui/x-data-grid";
import { useReservationList } from "./hooks/useReservationList";
import { ReservationType } from "../types/reservationType";
import { HeaderName } from "../components/DataTable/HeaderName";
import { PaymentStatusText } from "./modules/PaymentStatusText";
import { ReservationStatusText } from "./modules/ReservationStatusText";
import { Margin } from "../components/Margin";
import { useEffect } from "react";
import { formatLocaleString } from "../utils/priceUtils";

import { CategoryList } from "../components/Category/CategoryList";
import { formatDateTime } from "../utils/timeUtils";
import { useRouter } from "next/navigation";
import { SearchBar } from "../components/SearchBar";
import { GridTable } from "../components/Table/GridTable";

import formStyle from "@components/Form/index.module.scss";
import { Button } from "../components/Button";

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
  const {
    list,
    categoryList,
    selectedCategory,
    onChangeCategory,
    fetchReservationList,
    getSearchParams,
    onChangeKeyword,
    onChangeSearchKey,
    keyword,
    selectedSearchKey,
    searchMenu,
  } = useReservationList();

  useEffect(() => {
    fetchReservationList();
  }, []);

  const onSearch = () => {
    const params = getSearchParams();
    fetchReservationList(params);
  };

  const columns = getColumns();

  return (
    <div>
      <div className={formStyle.rightAlignButtonWrapper}>
        <Button
          style={{ width: "200px" }}
          size="Medium"
          onClick={() => router.push("/reservations/create")}
        >
          예약 만들기
        </Button>
      </div>
      <Margin top={45} />
      <CategoryList
        categoryList={categoryList}
        selectedCategory={selectedCategory}
        onChangeCategory={onChangeCategory}
      />
      <Margin
        top={24}
        bottom={24}
        style={{
          maxWidth: "800px",
        }}
      >
        <SearchBar
          menuList={searchMenu}
          keyword={keyword}
          selectedKey={selectedSearchKey}
          onChangeKeyword={onChangeKeyword}
          onChangeSearchKey={onChangeSearchKey}
          onSearch={onSearch}
        />
      </Margin>
      <GridTable<ReservationType>
        columns={columns}
        rows={list}
        onCellClick={({ row }) =>
          router.push(`/reservations/${row.id}?quoteId=${row.quoteId}`)
        }
      />
    </div>
  );
}
