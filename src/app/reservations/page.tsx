"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useReservationList } from "./\bhooks/useReservationList";
import { ReservationStatus, ReservationType } from "../types/reservationType";
import { HeaderName } from "../components/DataTable/HeaderName";
import { Button } from "../components/Button";
import Link from "next/link";
import { PaymentStatusText } from "./modules/PaymentStatusText";
import { ReservationStatusText } from "./modules/ReservationStatusText";
import { ReservationCategoryList } from "./modules/ReservationCategoryList";
import { Margin } from "../components/Margin";
import { useCallback, useEffect, useState } from "react";
import {
  getReservationStatusCount,
  updateReservation,
} from "../api/reservation";
import { ReservationStatusChangeModal } from "./modules/StatusChangeModal";
import { formatLocaleString } from "../utils/priceUtils";
import { showToast } from "../utils/toastUtils";

const getColumns = (
  onClickStatusButton: (reservation: ReservationType) => void
): GridColDef<ReservationType>[] => [
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
    field: "quoteId",
    flex: 1,
    renderHeader: () => HeaderName("견적서"),
    align: "center",
    renderCell: ({ row }) => (
      <Link href={`/quotes/${row.quoteId}`} target="blank">
        <Button
          variant="outlined"
          size="Small"
          style={{ width: "100%" }}
          color="#6f6f6f"
        >
          견적서 보기
        </Button>
      </Link>
    ),
  },
  {
    field: "quoteTitle",
    renderHeader: () => HeaderName("상태 변경"),
    flex: 1,
    align: "center",
    renderCell: ({ row }) => (
      <Button
        variant="outlined"
        size="Small"
        style={{ width: "100%" }}
        onClick={() => onClickStatusButton(row)}
      >
        상태 변경
      </Button>
    ),
  },
];

export default function ReservationListPage() {
  const [isOpenStatusModal, setIsOpenStatusModal] = useState<boolean>(false);
  const { list, setList, categoryList, selectedCategory, onChangeCategory } =
    useReservationList();
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationType | null>(null);

  useEffect(() => {
    getReservationStatusCount();
  }, []);

  const onClickStatusButton = (reservation: ReservationType) => {
    setIsOpenStatusModal(true);
    setSelectedReservation(reservation);
  };

  const onCloseStatusModal = () => {
    setIsOpenStatusModal(false);
    setSelectedReservation(null);
  };

  const onChangeStatus = useCallback(
    async (status: ReservationStatus) => {
      if (!selectedReservation) return;

      try {
        await updateReservation(selectedReservation.id, { status });
        showToast({
          message: "상태를 변경했습니다.",
          type: "success",
        });

        setList((prev) =>
          prev.map((item) =>
            item.id === selectedReservation.id ? { ...item, status } : item
          )
        );
        setIsOpenStatusModal(false);
      } catch {
        showToast({
          message: "상태 변경에 실패했습니다.",
          type: "error",
        });
      }
    },
    [selectedReservation]
  );

  const columns = getColumns(onClickStatusButton);

  return (
    <div>
      <Margin top={24} />
      <ReservationCategoryList
        categoryList={categoryList}
        selectedCategory={selectedCategory}
        onChangeCategory={onChangeCategory}
      />
      <Margin top={24} />
      <DataGrid<ReservationType>
        columns={columns}
        rows={list}
        sx={{
          background: "white",
          width: "100%",
          height: "600px",
          borderRadius: "16px",
        }}
      />
      {isOpenStatusModal && selectedReservation && (
        <ReservationStatusChangeModal
          currentStatus={selectedReservation.status}
          onCloseModal={onCloseStatusModal}
          onChangeStatus={onChangeStatus}
        />
      )}
    </div>
  );
}
