"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../../reservationPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";

import { Margin } from "@/app/components/Margin";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EquipmentSearchModal } from "../../modules/form/EquipmentSearchModal";
import { QuotationItemEditor } from "../../modules/form/QuotationItemEditor";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import { EditableField } from "@/app/components/EditableField";
import { showToast } from "@/app/utils/toastUtils";
import { UserSearchModal } from "../../../users/modules/UserSearchModal";
import { UserType } from "@/app/types/userType";
import dayjs from "dayjs";
// import { useEquipmentListWithRentedDates } from "@/app/equipments/hooks/useEquipmentListWithRentedDates";
import { useUnmount } from "usehooks-ts";
import { useReservationForm } from "../../hooks/useReservationForm";
import { useParams } from "next/navigation";
import { useReservationDetail } from "../../hooks/useReservationDetail";
import { isNil } from "lodash";
import { EquipmentListItemState } from "@/app/store/useCartStore";

const ReservationEditPage = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
  const [discountPriceState, setDiscountPriceState] = useState<number>(0);
  const { id } = useParams();
  const reservationId = Number(id);
  const isFirstRender = useRef(true);
  const quoteItemListStateRef = useRef<EquipmentListItemState[]>([]);

  const {
    form,
    setForm,
    onChangeForm,
    quoteItemListState,
    setDateRange,
    setQuoteItemListState,
    onChangeQuoteItem,
    onDeleteQuoteItem,
    onAddQuoteItemList,
    rentalDays,
    totalPrice,
    totalSupplyPrice,
    onChangeDate,
    onEditQuote,
    dateRange,
  } = useReservationForm();

  const { detail } = useReservationDetail(reservationId);

  // const { list: rentedEquipmentList, fetchList: fetchEquipmentRentedDateList } =
  //   useEquipmentListWithRentedDates({
  //     startDate: dateRange.startDate,
  //     endDate: dateRange.endDate,
  //   });

  // useEffect(() => {
  //   if (isOpenSearchModal) {
  //     fetchEquipmentRentedDateList();
  //   }
  // }, [isOpenSearchModal]);

  useEffect(() => {
    if (!reservationId || !detail) return;

    setForm({
      userId: detail.userId,
      guestName: detail.userName,
      guestPhoneNumber: detail.phoneNumber || "",
      discountPrice: detail.discountPrice ?? 0,
    });
    setDateRange({ startDate: detail.startDate, endDate: detail.endDate });

    setDiscountPriceState(detail.discountPrice ?? 0);
    setIsDiscounted(!isNil(detail.discountPrice) && detail.discountPrice > 0);
    const quoteItemList = detail.quoteItems.map((item) => ({
      equipmentId: item.equipmentId,
      price: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity * rentalDays,
      title: item.equipmentName,
      id: item.id,
    }));
    setQuoteItemListState(quoteItemList);
    quoteItemListStateRef.current = quoteItemList;
  }, [detail, reservationId, rentalDays]);

  useUnmount(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  });

  const onClickEquipmentModal = () => {
    if (rentalDays === 0) {
      showToast({ message: "기간을 설정해주세요.", type: "error" });
      return;
    }

    setIsOpenSearchModal(true);
  };

  const handleSelectUser = (user: UserType) => {
    setForm((prev) => ({
      ...prev,
      userId: user.id,
      guestName: user.name,
      guestPhoneNumber: user.phoneNumber ?? "",
    }));
  };

  const handleSaveForm = useCallback(() => {
    if (!detail?.quoteId) return;

    onEditQuote(detail.quoteId, reservationId, [
      ...quoteItemListStateRef.current,
    ]);
  }, [detail?.quoteId, reservationId, onEditQuote]);

  const existIdList = useMemo(() => {
    return quoteItemListState.map((item) => item.equipmentId);
  }, [quoteItemListState]);

  return (
    <div>
      <FormWrapper title="예약 수정">
        <div className={formStyles.sectionWrapper}>
          <Label title="고객 정보" />

          <Button
            variant="outlined"
            size="Small"
            onClick={() => setIsOpenUserModal(true)}
            style={{
              width: "200px",
            }}
          >
            {form.userId ? "회원 변경" : "회원 찾기"}
          </Button>
          {form.userId && (
            <div className={formStyles.sectionWrapper}>
              <Label title="이름" />
              <EditableField aria-readonly value={form.guestName} />
              <Margin top={10} />
              <Label title="전화번호" />
              <EditableField value={form.guestPhoneNumber || ""} />
            </div>
          )}
        </div>
        <div className={formStyles.sectionWrapper}>
          <Label title={`기간 설정 (총 ${rentalDays}일)`} />
          <Margin top={10} />
          <div className={styles.inlineWrapper}>
            <DateTimeSelector
              label="대여 시작 시간"
              value={dateRange.startDate}
              onChange={(value) => {
                if (!value) return;
                onChangeDate("startDate", value);
              }}
            />
            <div className={styles.separator}>~</div>
            <DateTimeSelector
              label="반납 시간"
              disabled={!dateRange.startDate}
              value={dateRange.endDate}
              minDateTime={dayjs(dateRange.startDate)}
              onChange={(value) => {
                if (!value) return;
                onChangeDate("endDate", value);
              }}
            />
          </div>
          <Margin top={20} />

          {rentalDays > 0 && (
            <div className={formStyles.sectionWrapper}>
              <Label title="대여 장비 목록" />

              <Margin top={10} bottom={20}>
                <Button
                  size="Small"
                  variant="outlined"
                  onClick={onClickEquipmentModal}
                  style={{
                    width: "200px",
                  }}
                >
                  장비 추가
                </Button>
              </Margin>

              <div className={styles.equipmentListWrapper}>
                {quoteItemListState.map((quote) => {
                  return (
                    <QuotationItemEditor
                      key={quote.equipmentId}
                      rentalDays={rentalDays}
                      quoteState={quote}
                      availableStatus="unknown"
                      onChangeField={(state) =>
                        onChangeQuoteItem(quote.equipmentId, state)
                      }
                      onDeleteEquipment={() =>
                        onDeleteQuoteItem(quote.equipmentId)
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}
          {quoteItemListState.length > 0 && (
            <div className={styles.priceSection}>
              <div className={styles.discountPriceWrapper}>
                <Label title="정가" />
                <div>{formatLocaleString(totalSupplyPrice)}원</div>
              </div>
              {isDiscounted ? (
                <div className={styles.discountPriceWrapper}>
                  <Label title="할인 금액" />
                  <EditableField
                    value={discountPriceState}
                    size="small"
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (isNaN(value)) return;
                      setDiscountPriceState(value);
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="Small"
                    onClick={() => {
                      onChangeForm("discountPrice", discountPriceState);
                      setIsDiscounted(false);
                    }}
                  >
                    적용
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outlined"
                  size="Small"
                  onClick={() => setIsDiscounted(true)}
                >
                  할인추가
                </Button>
              )}

              <div className={styles.totalPriceWrapper}>
                <div className={styles.totalPrice}>
                  총 {formatLocaleString(totalPrice)}원 (
                </div>
                <div> {formatKoreanCurrency(totalPrice)})</div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.buttonWrapper}>
          <Button
            size="Medium"
            style={{ width: "250px" }}
            onClick={handleSaveForm}
          >
            저장하기
          </Button>
        </div>
      </FormWrapper>
      {isOpenSearchModal && dateRange.startDate && dateRange.endDate && (
        <EquipmentSearchModal
          disabledIdList={existIdList}
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={onAddQuoteItemList}
        />
      )}
      {isOpenUserModal && (
        <UserSearchModal
          onCloseModal={() => setIsOpenUserModal(false)}
          onConfirm={handleSelectUser}
        />
      )}
    </div>
  );
};

export default ReservationEditPage;
