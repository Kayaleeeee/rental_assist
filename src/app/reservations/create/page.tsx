"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../reservationPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";

import { Margin } from "@/app/components/Margin";
import { useEffect, useMemo, useRef, useState } from "react";
import { EquipmentSearchModal } from "../modules/form/EquipmentSearchModal";
import { QuotationItemEditor } from "../modules/form/QuotationItemEditor";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import { EditableField } from "@/app/components/EditableField";
import { showToast } from "@/app/utils/toastUtils";
import { UserSearchModal } from "../../users/modules/UserSearchModal";
import { UserType } from "@/app/types/userType";
import dayjs from "dayjs";
import { useEquipmentListWithRentedDates } from "@/app/equipments/hooks/useEquipmentListWithRentedDates";
import { useUnmount } from "usehooks-ts";
import { useQuoteForm } from "../hooks/useQuoteForm";

const ReservationCreatePage = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
  const [discountPriceState, setDiscountPriceState] = useState<number>(0);

  const {
    form,
    setForm,
    onChangeForm,
    quoteItemListState,
    onChangeQuoteItem,
    onDeleteQuoteItem,
    onAddQuoteItemList,
    rentalDays,
    onCreateQuote,
    totalPrice,
    totalSupplyPrice,
    resetCart,
    onChangeDate,
    dateRange,
  } = useQuoteForm();

  const { list: rentedEquipmentList, fetchList: fetchEquipmentRentedDateList } =
    useEquipmentListWithRentedDates({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });

  const isFirstRender = useRef(true);

  useEffect(() => {
    setIsDiscounted(form.discountPrice > 0);
  }, [form]);

  useEffect(() => {
    if (isOpenSearchModal) {
      fetchEquipmentRentedDateList();
    }
  }, [isOpenSearchModal]);

  useUnmount(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    resetCart();
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

  const rentedEquipmentIdList = useMemo(() => {
    return rentedEquipmentList.map((item) => item.equipmentId);
  }, [rentedEquipmentList]);

  const existIdList = useMemo(() => {
    return quoteItemListState.map((item) => item.equipmentId);
  }, [quoteItemListState]);

  return (
    <div>
      <FormWrapper title="예약 생성">
        <div className={formStyles.sectionWrapper}>
          <Label title="고객 정보" />

          <Button
            variant="outlined"
            size="Medium"
            onClick={() => setIsOpenUserModal(true)}
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
            onClick={onCreateQuote}
          >
            생성하기
          </Button>
        </div>
      </FormWrapper>
      {isOpenSearchModal && dateRange.startDate && dateRange.endDate && (
        <EquipmentSearchModal
          existIdList={existIdList}
          occupiedIdList={rentedEquipmentIdList}
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

export default ReservationCreatePage;
