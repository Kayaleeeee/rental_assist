"use client";

import { ListButton } from "@/app/components/Button/ListButton";
import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { useParams, useRouter } from "next/navigation";
import formStyles from "@components/Form/index.module.scss";
import { Label } from "@/app/components/Form/Label";
import { EditableField } from "@/app/components/EditableField";
import { Margin } from "@/app/components/Margin";
import { formatDateTime, getDiffDays } from "@/app/utils/timeUtils";

import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import styles from "../reservationPage.module.scss";

import { useReservationDetail } from "../hooks/useReservationDetail";
import { PaymentStatusText } from "../modules/PaymentStatusText";
import {
  PaymentMethod,
  PaymentStatus,
  ReservationStatus,
} from "@/app/types/reservationType";
import { HTMLAttributes, useCallback, useMemo, useState } from "react";
import { showToast } from "@/app/utils/toastUtils";
import { updateReservation } from "@/app/api/reservation";
import { Button } from "@/app/components/Button";
import { ReservationStatusChangeModal } from "../modules/list/StatusChangeModal";
import { ReservationStatusText } from "../modules/ReservationStatusText";
import { PaymentStatusChangeModal } from "../modules/list/PaymentStatusChangeModal";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { RentalDateChangeModal } from "../modules/list/RentalDateChangeModal";
import { isEmpty, isNil } from "lodash";
import { ReservationItemTable } from "../modules/form/ReservationItemTable";
import { ReservationGroupTable } from "@/app/reservations/modules/form/ReservationGroupTable";
import { formatPhoneNumber } from "@/app/utils/textUtils";

const defaultString = "-";

const ReservationDetailPage = () => {
  const [isOpenStatusModal, setIsOpenStatusModal] = useState<boolean>(false);
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState<boolean>(false);
  const [isOpenRentalDateModal, setIsOpenRentalDateModal] =
    useState<boolean>(false);

  const router = useRouter();
  const params = useParams();

  const reservationId = Number(params.id);

  const { detail: reservationDetail, setDetail: setReservationDetail } =
    useReservationDetail(reservationId);

  const rentalDays = useMemo(() => {
    if (!reservationDetail) return 0;
    return getDiffDays(reservationDetail.startDate, reservationDetail.endDate);
  }, [reservationDetail]);

  const formWrapperStyle = {
    width: "200px",
  } as HTMLAttributes<HTMLDivElement["style"]>;

  const onChangeReservationStatus = useCallback(
    async (status: ReservationStatus) => {
      if (!reservationDetail) return;

      try {
        await updateReservation(reservationDetail.id, { status });
        showToast({
          message: "상태를 변경했습니다.",
          type: "success",
        });

        setReservationDetail((prev) => {
          if (!prev) return;
          return { ...prev, status };
        });

        setIsOpenStatusModal(false);
      } catch {
        showToast({
          message: "상태 변경에 실패했습니다.",
          type: "error",
        });
      }
    },
    [reservationDetail]
  );

  const onChangePaymentStatus = useCallback(
    async (status: PaymentStatus, paymentMethod?: PaymentMethod) => {
      if (!reservationDetail) return;

      const payload = {
        paymentStatus: status,
        ...(paymentMethod && status === PaymentStatus.paid
          ? { paymentMethod }
          : {}),
      };

      try {
        await updateReservation(reservationDetail.id, payload);

        showToast({
          message: "결제 상태를 변경했습니다.",
          type: "success",
        });

        setReservationDetail((prev) => {
          if (!prev) return;
          return { ...prev, paymentStatus: status };
        });

        setIsOpenPaymentModal(false);
      } catch {
        showToast({
          message: "상태 변경에 실패했습니다.",
          type: "error",
        });
      }
    },
    [reservationDetail]
  );

  const itemDiscount = useMemo(() => {
    if (!reservationDetail) return 0;
    return (
      reservationDetail.supplyPrice -
      (reservationDetail.totalPrice + (reservationDetail.discountPrice || 0))
    );
  }, [reservationDetail]);

  const formDiscountPrice = useMemo(() => {
    if (!reservationDetail) return 0;

    return reservationDetail.discountPrice || 0;
  }, [reservationDetail]);

  if (!reservationDetail) return null;

  return (
    <div>
      <ListButton
        title="목록 보기"
        onClick={() => router.push("/reservations")}
        style={{
          marginBottom: "20px",
        }}
      />

      <FormWrapper>
        <div className={styles.headerWrapper}>
          <h4>예약 상세</h4>
          {reservationDetail.status !== ReservationStatus.canceled && (
            <div className={styles.headerButtonWrapper}>
              <Button
                size="Small"
                variant="outlined"
                style={{ width: "100px" }}
                onClick={() =>
                  router.push(`/reservations/${reservationId}/quote`)
                }
              >
                견적서 확인
              </Button>
              <Margin right={4} />
              <Button
                size="Small"
                style={{ width: "120px" }}
                onClick={() =>
                  router.push(`/reservations/${reservationId}/edit`)
                }
              >
                예약 수정
              </Button>
            </div>
          )}
        </div>
        <Margin bottom={20} />
        <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
          <Label title="예약 생성일" />
          <EditableField
            isEditable={false}
            value={formatDateTime(reservationDetail.createdAt)}
          />
        </div>

        <div className={styles.inlineFlexStartWrapper}>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <div
              className={styles.clickableLabelWrapper}
              onClick={() => setIsOpenStatusModal(true)}
            >
              <Label title="예약 상태" />
              <ArrowDropDownOutlinedIcon />
            </div>
            <div>
              <ReservationStatusText status={reservationDetail.status} />
            </div>
          </div>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <div
              className={styles.clickableLabelWrapper}
              onClick={() => setIsOpenPaymentModal(true)}
            >
              <Label title="결제 상태" />
              <ArrowDropDownOutlinedIcon />
            </div>
            <div>
              <PaymentStatusText status={reservationDetail.paymentStatus} />
            </div>
          </div>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <Label title={`회차 정보`} />

            <div className={styles.roundRow}>
              {reservationDetail.rounds} 회차
            </div>
          </div>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <div
              className={styles.clickableLabelWrapper}
              onClick={() => setIsOpenRentalDateModal(true)}
            >
              <Label title={`대여 기간 (총 ${rentalDays}일)`} />
              <ArrowDropDownOutlinedIcon />
            </div>
            <span
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <EditableField
                isEditable={false}
                value={`${formatDateTime(reservationDetail.startDate)} ~ `}
              />
              <EditableField
                isEditable={false}
                value={formatDateTime(reservationDetail.endDate)}
              />
            </span>
          </div>
        </div>

        <Label title="고객 정보" />
        <div className={styles.inlineFlexStartWrapper}>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <Label title="이름" />
            <EditableField
              isEditable={false}
              value={reservationDetail.userName || defaultString}
            />
          </div>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <Label title="전화번호" />
            <EditableField
              isEditable={false}
              value={
                !isNil(reservationDetail.phoneNumber)
                  ? formatPhoneNumber(reservationDetail.phoneNumber)
                  : defaultString
              }
            />
          </div>
        </div>
        <Label title="메모" />
        <div>{reservationDetail.memo || "-"}</div>

        <div className={formStyles.sectionWrapper}>
          <Margin top={20} />

          <div className={formStyles.sectionWrapper}>
            <Label title="대여 장비 목록" />
            <ReservationItemTable
              rounds={reservationDetail.rounds}
              rows={reservationDetail.equipmentList}
            />
          </div>

          {!isEmpty(reservationDetail.setList) && (
            <Margin>
              <Label title="풀세트 리스트" />
              <div className={styles.equipmentListWrapper}>
                {reservationDetail.setList.map((item) => {
                  return (
                    <ReservationGroupTable
                      key={item.setId}
                      rounds={reservationDetail.rounds}
                      groupEquipment={item}
                    />
                  );
                })}
              </div>
            </Margin>
          )}
          <Margin top={40} />

          <div className={styles.priceSection}>
            <div className={styles.priceRowWrapper}>
              <b className={styles.label}>정가</b>
              <div className={styles.value}>
                {formatLocaleString(reservationDetail.supplyPrice)}원
              </div>
            </div>
            {itemDiscount !== 0 && (
              <Margin top={8}>
                <div className={styles.priceRowWrapper}>
                  <b className={styles.label}>항목 할인 금액</b>
                  <div className={styles.value}>
                    -{formatLocaleString(itemDiscount)}원
                  </div>
                </div>
              </Margin>
            )}
            <Margin top={8} />
            {formDiscountPrice !== 0 && (
              <div className={styles.priceRowWrapper}>
                <b className={styles.label} style={{ cursor: "pointer" }}>
                  <Margin right={2} />
                  견적서 할인 금액
                </b>

                <div className={styles.value}>
                  -{formatLocaleString(formDiscountPrice)}원
                </div>
              </div>
            )}
            <Margin top={8} />
            <div className={styles.priceRowWrapper}>
              <b className={styles.label}>총 금액</b>
              <div className={styles.value}>
                <b>{formatLocaleString(reservationDetail.totalPrice)}원</b>
              </div>
            </div>
            ({formatKoreanCurrency(reservationDetail.totalPrice)})
          </div>
        </div>
      </FormWrapper>
      {isOpenStatusModal && reservationDetail && (
        <ReservationStatusChangeModal
          currentStatus={reservationDetail.status}
          onCloseModal={() => setIsOpenStatusModal(false)}
          onChangeStatus={onChangeReservationStatus}
        />
      )}
      {isOpenPaymentModal && reservationDetail && (
        <PaymentStatusChangeModal
          currentStatus={reservationDetail.paymentStatus}
          onCloseModal={() => setIsOpenPaymentModal(false)}
          onChangeStatus={onChangePaymentStatus}
        />
      )}
      {isOpenRentalDateModal && (
        <RentalDateChangeModal
          onCloseModal={() => setIsOpenRentalDateModal(false)}
          dateRange={{
            startDate: reservationDetail.startDate,
            endDate: reservationDetail.endDate,
          }}
          onChangeDate={(dateRange) =>
            setReservationDetail({
              ...reservationDetail,
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            })
          }
          quoteId={reservationDetail.quoteId}
        />
      )}
    </div>
  );
};

export default ReservationDetailPage;
