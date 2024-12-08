"use client";

import { ListButton } from "@/app/components/Button/ListButton";
import { EditableField } from "@/app/components/EditableField";
import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { Label } from "@/app/components/Form/Label";
import { Margin } from "@/app/components/Margin";
import { useParams, useRouter } from "next/navigation";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { useUserDetail } from "../hooks/useUserDetail";
import { useReservationList } from "@/app/reservations/hooks/useReservationList";
import { useEffect } from "react";
import { isEmpty, isNil } from "lodash";
import styles from "../index.module.scss";
import { formatDateTime } from "@/app/utils/timeUtils";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { PaymentStatusText } from "@/app/reservations/modules/PaymentStatusText";
import { ReservationStatusText } from "@/app/reservations/modules/ReservationStatusText";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReservationType } from "@/app/types/reservationType";
import { HeaderName } from "@/app/components/DataTable/HeaderName";
import { formatPhoneNumber } from "@/app/utils/textUtils";

const column: GridColDef<ReservationType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
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

const UserDetailPage = () => {
  const params = useParams();
  const userId = Number(params.id);
  const router = useRouter();

  const { detail } = useUserDetail(userId);
  const { list: reservationHistoryList, fetchReservationList } =
    useReservationList();

  useEffect(() => {
    if (!userId) return;

    fetchReservationList({ userId });
  }, [userId]);

  if (!detail) return null;
  return (
    <>
      <ListButton
        title="목록 보기"
        onClick={() => router.push("/equipments")}
        style={{
          marginBottom: "20px",
        }}
      />
      <FormWrapper title="회원 정보 상세">
        <div className={formStyles.sectionWrapper}>
          <Label title="이름" />
          <EditableField isEditable={false} value={detail.name} />
        </div>
        <Margin top={20} />

        <div className={formStyles.sectionWrapper}>
          <Label title="전화번호" />
          <EditableField
            isEditable={false}
            fullWidth
            multiline
            value={
              !isNil(detail.phoneNumber)
                ? formatPhoneNumber(detail.phoneNumber)
                : "-"
            }
          />
        </div>
        <Margin top={20} />
        <div className={formStyles.sectionWrapper}>
          <Label title="이메일" />
          <EditableField
            isEditable={false}
            fullWidth
            multiline
            value={detail.email || "-"}
          />
        </div>

        <div className={formStyles.sectionWrapper}>
          <Label title="예약 내역" />
          <Margin bottom={16} />
          {isEmpty(reservationHistoryList) ? (
            <div className={styles.emptyReservationList}>
              예약 내역이 없습니다.
            </div>
          ) : (
            <div className={styles.reservationHistoryListWrapper}>
              <DataGrid<ReservationType>
                columns={column}
                rows={reservationHistoryList}
                onCellClick={({ row }) => {
                  const url = `/reservations/${row.id}?quoteId=${row.quoteId}`;
                  window.open(url, "_blank");
                }}
                sx={{
                  background: "white",
                  minHeight: "400px",
                  flex: 1,
                  height: "600px",
                  borderRadius: "16px",
                }}
              />
            </div>
          )}
        </div>

        <div className={formStyles.rightAlignButtonWrapper}>
          <Button
            size="Medium"
            style={{ width: "150px" }}
            onClick={() => router.push(`/users/${userId}/edit`)}
          >
            수정
          </Button>
        </div>
      </FormWrapper>
    </>
  );
};

export default UserDetailPage;
