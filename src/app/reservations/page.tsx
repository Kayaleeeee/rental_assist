"use client";

import { GridColDef } from "@mui/x-data-grid";
import { useReservationList } from "./hooks/useReservationList";
import { ReservationType } from "../types/reservationType";
import { HeaderName } from "../components/DataTable/HeaderName";
import { PaymentStatusText } from "./modules/PaymentStatusText";
import { ReservationStatusText } from "./modules/ReservationStatusText";
import { Margin } from "../components/Margin";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatLocaleString } from "../utils/priceUtils";
import { CategoryList } from "../components/Category/CategoryList";
import { formatDateTime } from "../utils/timeUtils";
import { useRouter } from "next/navigation";
import { SearchBar } from "../components/SearchBar";
import { GridTable } from "../components/Table/GridTable";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import formStyle from "@components/Form/index.module.scss";
import { Button } from "../components/Button";
import { DateTimeSelector } from "../components/DateTimeSelector";
import styles from "./reservationPage.module.scss";
import dayjs from "dayjs";
import { isEmpty } from "lodash";

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
  const [showFilters, setShowFilters] = useState<boolean>(false);
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
    dateRange,
    setDateRange,
  } = useReservationList();

  const onSearch = useCallback(() => {
    const params = getSearchParams();
    fetchReservationList(params);
  }, [getSearchParams]);

  useEffect(() => {
    const params = getSearchParams();
    fetchReservationList(params);
  }, []);

  const hasFiltered = useMemo(() => {
    return !isEmpty(keyword) || (dateRange.startDate && dateRange.endDate);
  }, [dateRange, keyword]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
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
      <div
        style={{
          display: "inline-flex",
          alignItems: "centers",
        }}
      >
        <CategoryList
          categoryList={categoryList}
          selectedCategory={selectedCategory}
          onChangeCategory={onChangeCategory}
        />
        <div
          className={styles.filterIconWrapper}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <TuneOutlinedIcon
            sx={{
              color: hasFiltered ? undefined : "var(--grey)",
            }}
          />
        </div>
      </div>
      <Margin top={20} />

      {showFilters && (
        <div className={styles.filterWrapper}>
          <div className={styles.dateRangeSearchWrapper}>
            <DateTimeSelector
              label="대여 시작일"
              value={dateRange.startDate}
              size="small"
              views={["year", "month", "day"]}
              onChange={(value) => {
                if (!value) return;
                setDateRange((prev) => ({ ...prev, startDate: value }));
              }}
            />
            <div className={styles.separator}>~</div>
            <DateTimeSelector
              label="반납일"
              disabled={!dateRange.startDate}
              value={dateRange.endDate}
              minDateTime={dayjs(dateRange.startDate)}
              size="small"
              views={["year", "month", "day"]}
              onChange={(value) => {
                if (!value) return;
                setDateRange((prev) => ({ ...prev, endDate: value }));
              }}
            />
          </div>
          <Margin
            top={20}
            bottom={16}
            style={{
              maxWidth: "600px",
            }}
          >
            <SearchBar
              menuList={searchMenu}
              keyword={keyword}
              selectedKey={selectedSearchKey}
              onChangeKeyword={onChangeKeyword}
              onChangeSearchKey={onChangeSearchKey}
              onSearch={onSearch}
              hideButton
            />
          </Margin>

          <Button
            variant="outlined"
            size="Small"
            style={{
              width: "150px",
              placeSelf: "flex-end",
            }}
            onClick={onSearch}
          >
            검색
          </Button>
        </div>
      )}

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
