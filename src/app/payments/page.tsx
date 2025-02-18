"use client";

import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { PaymentStatus, ReservationType } from "../types/reservationType";
import { HeaderName } from "../components/DataTable/HeaderName";

import { Margin } from "../components/Margin";
import { useCallback, useEffect, useMemo } from "react";
import { formatLocaleString } from "../utils/priceUtils";
import { CategoryList } from "../components/Category/CategoryList";
import { formatDateTime } from "../utils/timeUtils";
import { useRouter } from "next/navigation";
import { GridTable } from "../components/Table/GridTable";
import { PaymentStatusText } from "../reservations/modules/PaymentStatusText";
import { ReservationStatusText } from "../reservations/modules/ReservationStatusText";
import { usePaymentList } from "./hooks/usePaymentsList";
import styles from "./paymentPage.module.scss";
import { SearchBar } from "../components/SearchBar";
import { isNil } from "lodash";

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
  {
    field: "paymentMethod",
    flex: 1,
    renderCell: ({ row }) =>
      isNil(row.paymentMethod) ? "-" : row.paymentMethod,
    renderHeader: () => HeaderName("결제 수단"),
  },
];

export default function PaymentsListPage() {
  const router = useRouter();
  const {
    list,
    sumUpState,
    paymentStatusCategoryList,
    selectedPaymentCategory,
    selectedPeriod,
    periodCategoryList,
    totalElements,
    pageModel,
    searchMenu,
    keyword,
    selectedSearchKey,
    onChangeSearchKey,
    onChangeStatusCategory,
    onChangePeriodCategory,
    fetchPaymentList,
    getSearchParams,
    getSumUpParams,
    getDateRangeByPeriod,
    fetchPaymentSumUp,
    onChangePage,
    onChangeKeyword,
  } = usePaymentList();

  useEffect(() => {
    fetchPaymentList(getSearchParams());
    fetchPaymentSumUp(getSumUpParams());
  }, []);

  const columns = getColumns();
  const dateRange = useMemo(() => {
    return getDateRangeByPeriod(selectedPeriod);
  }, [getDateRangeByPeriod, selectedPeriod]);

  const sumUpList = useMemo(() => {
    const totalPaymentSumUpList = Object.entries(sumUpState);
    if (selectedPaymentCategory === "all") {
      return totalPaymentSumUpList;
    } else {
      return totalPaymentSumUpList.filter(
        ([key]) => key === selectedPaymentCategory
      );
    }
  }, [sumUpState, selectedPaymentCategory]);

  const onSearch = useCallback(() => {
    fetchPaymentList(getSearchParams());
  }, [keyword, getSearchParams, fetch]);

  return (
    <div>
      <Margin top={45} />
      <CategoryList<string>
        categoryList={paymentStatusCategoryList}
        selectedCategory={selectedPaymentCategory}
        onChangeCategory={onChangeStatusCategory}
      />
      <Margin top={20} />

      <CategoryList<number>
        type="borderless"
        categoryList={periodCategoryList}
        selectedCategory={selectedPeriod}
        onChangeCategory={onChangePeriodCategory}
      />
      <Margin top={30} />

      <div className={styles.sumUpWrapper}>
        <div>{`기간 : ${formatDateTime(
          dateRange.startDate,
          "YYYY.MM.DD"
        )} - ${formatDateTime(dateRange.endDate, "YYYY.MM.DD")}`}</div>
        <Margin top={5} />
        {sumUpList.map(([key, value]) => {
          return (
            <div key={key} className={styles.paymentSumUpRow}>
              <PaymentStatusText status={key as PaymentStatus} />
              <div> {formatLocaleString(value)} 원</div>
            </div>
          );
        })}
      </div>

      <Margin top={30} />

      <Margin
        bottom={16}
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "inline-flex",
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
        paginationModel={{
          pageSize: pageModel.limit,
          page: pageModel.offset / pageModel.limit,
        }}
        pageSizeOptions={[5, 10, 50]}
        paginationMode="server"
        rowCount={totalElements}
        onPaginationModelChange={(model: GridPaginationModel) => {
          onChangePage({
            offset: model.page * model.pageSize,
            limit: model.pageSize,
          });
        }}
        onCellClick={({ row }) =>
          router.push(`/reservations/${row.id}?quoteId=${row.quoteId}`)
        }
      />
    </div>
  );
}
