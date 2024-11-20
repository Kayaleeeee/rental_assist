"use client";

import { ListButton } from "@/app/components/Button/ListButton";
import { FormWrapper } from "@/app/components/Form/FormWrapper";
import { useParams, useRouter } from "next/navigation";
import formStyles from "@components/Form/index.module.scss";
import { Label } from "@/app/components/Form/Label";
import { EditableField } from "@/app/components/EditableField";
import { Margin } from "@/app/components/Margin";
import { formatDateTime } from "@/app/utils/timeUtils";
import { QuotationItem } from "@/app/quotes/modules/QuotationItem";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import styles from "../reservationPage.module.scss";
import { useQuoteDetail } from "@/app/quotes/hooks/useQuoteDetail";
import { isNaN } from "lodash";
import { useReservationDetail } from "../\bhooks/useReservationDetail";
import { PaymentStatusText } from "../modules/PaymentStatusText";
import {
  PaymentMethod,
  PaymentStatus,
  ReservationStatus,
} from "@/app/types/reservationType";
import { HTMLAttributes, useCallback, useState } from "react";
import { showToast } from "@/app/utils/toastUtils";
import { updateReservation } from "@/app/api/reservation";
import { Button } from "@/app/components/Button";
import { ReservationStatusChangeModal } from "../modules/StatusChangeModal";
import { ReservationStatusText } from "../modules/ReservationStatusText";
import { PaymentStatusChangeModal } from "../modules/PaymentStatusChangeModal";

const defaultString = "-";

const ReservationDetailPage = () => {
  const [isOpenStatusModal, setIsOpenStatusModal] = useState<boolean>(false);
  const [isOpenPaymentModal, setIsOpenPaymentModal] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();

  const reservationId = Number(params.id);

  const { detail: reservationDetail, setDetail: setReservationDetail } =
    useReservationDetail(reservationId);

  const quoteId = Number(reservationDetail?.quoteId);

  const {
    detail: quoteDetail,
    quoteItemList,
    rentalDays,
  } = useQuoteDetail(isNaN(quoteId) ? undefined : quoteId);

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
  if (!quoteDetail || !reservationDetail) return null;

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
                variant="outlined"
                size="Small"
                onClick={() => setIsOpenPaymentModal(true)}
              >
                결제 상태 변경
              </Button>
              <Button
                variant="outlined"
                size="Small"
                onClick={() => setIsOpenStatusModal(true)}
              >
                예약 상태 변경
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

        <div className={styles.inlineWrapper}>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <Label title="예약 상태" />
            <div>
              <ReservationStatusText status={reservationDetail.status} />
            </div>
          </div>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <Label title="결제 상태" />
            <div>
              <PaymentStatusText status={reservationDetail.paymentStatus} />
            </div>
          </div>
          <div className={formStyles.sectionWrapper}>
            <Label title={`대여 기간 (총 ${rentalDays}일)`} />
            <span
              style={{
                display: "inline-flex",
              }}
            >
              <EditableField
                isEditable={false}
                value={formatDateTime(quoteDetail.startDate)}
              />
              <div className={styles.separator}>~</div>
              <EditableField
                isEditable={false}
                value={formatDateTime(quoteDetail.endDate)}
              />
            </span>
          </div>
        </div>

        <Label title="고객 정보" />
        <div className={styles.inlineWrapper}>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <Label title="이름" />
            <EditableField
              isEditable={false}
              value={quoteDetail.userName || defaultString}
            />
          </div>
          <div className={formStyles.sectionWrapper} style={formWrapperStyle}>
            <Label title="전화번호" />
            <EditableField
              isEditable={false}
              value={quoteDetail.guestPhoneNumber || defaultString}
            />
          </div>
        </div>

        <div className={formStyles.sectionWrapper}>
          <Margin top={20} />

          {rentalDays > 0 && (
            <div className={formStyles.sectionWrapper}>
              <Label title="대여 장비 목록" />

              <div className={styles.equipmentListWrapper}>
                {quoteItemList.map((quote) => {
                  return (
                    <QuotationItem
                      key={quote.id}
                      quoteItem={quote}
                      rentalDays={rentalDays}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {quoteItemList.length > 0 && (
            <div className={styles.priceSection}>
              <div className={styles.discountPriceWrapper}>
                <Label title="정가" />
                <div>{formatLocaleString(quoteDetail.supplyPrice)}원</div>
              </div>

              {!!quoteDetail.discountPrice && quoteDetail.discountPrice > 0 && (
                <div className={styles.discountPriceWrapper}>
                  <Label title="할인 금액" />
                  <EditableField
                    isEditable={false}
                    value={`-${formatLocaleString(
                      quoteDetail.discountPrice
                    )}원`}
                  />
                </div>
              )}
              <div className={styles.totalPriceWrapper}>
                <div className={styles.totalPrice}>
                  총 {formatLocaleString(quoteDetail.totalPrice)}원 (
                </div>
                <div> {formatKoreanCurrency(quoteDetail.totalPrice)})</div>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default ReservationDetailPage;
