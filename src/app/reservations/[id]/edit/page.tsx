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
// import {
//   formatKoreanCurrency,
//   formatLocaleString,
// } from "@/app/utils/priceUtils";
import { EditableField } from "@/app/components/EditableField";
import { showToast } from "@/app/utils/toastUtils";
import { UserSearchModal } from "../../../users/modules/UserSearchModal";
import { UserType } from "@/app/types/userType";
import dayjs from "dayjs";
import { useUnmount } from "usehooks-ts";
import { useReservationForm } from "../../hooks/useReservationForm";
import { useParams } from "next/navigation";
import { useReservationDetail } from "../../hooks/useReservationDetail";
import { isEmpty, isNil } from "lodash";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import {
  convertEquipmentItemToState,
  useEquipmentCart,
} from "@/app/equipments/hooks/useEquipmentCart";
import { onUpdateReservation } from "../../actions/updateReservation";
import { QuoteItemType } from "@/app/types/quoteType";
import { SetEquipmentAccordionEditor } from "@/app/equipments/sets/modules/SetEquipmentAccordionEditor";
import { getAvailableStatus } from "@/app/components/Cart";
import {
  ReservationDetailType,
  ReservationType,
} from "@/app/types/reservationType";

const convertQuoteItemToEquipmentState = (
  item: QuoteItemType
): EquipmentListItemState => {
  return {
    equipmentId: item.equipmentId,
    title: item.equipmentName,
    quantity: item.quantity,
    price: item.price,
    totalPrice: item.totalPrice,
  };
};

const ReservationEditPage = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
  const [discountPriceState, setDiscountPriceState] = useState<number>(0);
  const { id } = useParams();
  const reservationId = Number(id);
  const isFirstRender = useRef(true);
  const quoteItemListStateRef = useRef<EquipmentListItemState[]>([]);

  const { form, setForm, onChangeForm } = useReservationForm();
  const { detail } = useReservationDetail(reservationId);

  const {
    // hasUnavailableItem,
    onChangeDate,
    setDateRange,
    dateRange,
    // handleCheckAvailability,
    isChecked,
    rentalDays,

    // resetCart,
    // handleChangeGroupEquipment,
    handleDeleteGroupEquipment,
    handleDeleteEquipmentItem,
    handleDeleteGroupEquipmentItem,
    handleChangeEquipmentItem,
    handleAddEquipmentList,

    equipmentItemList,
    setEquipmentItemList,

    equipmentGroupList,
    setEquipmentGroupList,
  } = useEquipmentCart();

  const initializeForm = useCallback((detail: ReservationDetailType) => {
    setForm({
      userId: detail.userId,
      guestName: detail.userName,
      guestPhoneNumber: detail.phoneNumber || "",
      discountPrice: detail.discountPrice ?? 0,
    });
    setDateRange({ startDate: detail.startDate, endDate: detail.endDate });

    setDiscountPriceState(detail.discountPrice ?? 0);
    setIsDiscounted(!isNil(detail.discountPrice) && detail.discountPrice > 0);
    const quoteItemList = detail.equipmnetList.map(
      convertQuoteItemToEquipmentState
    );
    setEquipmentItemList(quoteItemList);
    setEquipmentGroupList(
      detail.setList.map((set) => ({
        ...set,
        equipmentList: set.equipmentList.map(convertQuoteItemToEquipmentState),
      }))
    );

    quoteItemListStateRef.current = quoteItemList;
  }, []);

  useEffect(() => {
    if (!reservationId || !detail) return;

    initializeForm(detail);
  }, [detail, reservationId]);

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

    onUpdateReservation({
      quoteId: detail.quoteId,
      reservationId,
      form,
      dateRange,
      originQuoteItemList: [...quoteItemListStateRef.current],
      equipmentItemList,
      groupEquipmentList: equipmentGroupList,
    });
  }, [detail?.quoteId, reservationId, setEquipmentItemList]);

  const existIdList = useMemo(() => {
    const equipmentIdList = equipmentItemList.map((item) => item.equipmentId);
    const groupEquipmentItemIdList = equipmentGroupList
      .flatMap((item) => item.equipmentList)
      .map((item) => item.equipmentId);

    return [...equipmentIdList, ...groupEquipmentItemIdList];
  }, [equipmentItemList, equipmentGroupList]);

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

              <Margin top={10} />

              <Margin bottom={20}>
                <Label title="단품 장비 리스트" />
                <div className={styles.equipmentListWrapper}>
                  {equipmentItemList.map((item) => {
                    return (
                      <QuotationItemEditor
                        key={item.equipmentId}
                        quoteState={item}
                        rentalDays={rentalDays}
                        onChangeField={() => {}}
                        quantityOnly
                        onDeleteEquipment={() =>
                          handleDeleteEquipmentItem(item.equipmentId)
                        }
                        availableStatus={getAvailableStatus(
                          isChecked,
                          item.isAvailable
                        )}
                      />
                    );
                  })}
                  <Button
                    size="Small"
                    variant="outlined"
                    onClick={onClickEquipmentModal}
                  >
                    단품 장비 추가
                  </Button>
                </div>
              </Margin>

              <Margin>
                <Label title="풀세트 리스트" />
                <div className={styles.equipmentListWrapper}>
                  {equipmentGroupList.map((item) => {
                    return (
                      <SetEquipmentAccordionEditor
                        key={item.id}
                        title={item.title}
                        isChecked={isChecked}
                        equipmentList={item.equipmentList}
                        changeQuantity={() => {}}
                        changePrice={() => {}}
                        addEquipmentItem={() => {
                          setIsOpenSearchModal(true);
                          // setSearchingSetId(item.id);
                        }}
                        deleteEquipmentItem={(equipmentId) =>
                          handleDeleteGroupEquipmentItem(item, equipmentId)
                        }
                        deleteSetEquipment={() =>
                          handleDeleteGroupEquipment(item.id)
                        }
                      />
                    );
                  })}
                  <Button
                    size="Small"
                    variant="outlined"
                    onClick={onClickEquipmentModal}
                  >
                    풀세트 추가
                  </Button>
                </div>
              </Margin>
            </div>
          )}
          {equipmentItemList.length > 0 && (
            <div className={styles.priceSection}>
              <div className={styles.discountPriceWrapper}>
                <Label title="정가" />
                {/* <div>{formatLocaleString(totalSupplyPrice)}원</div> */}
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
                  {/* 총 {formatLocaleString(totalPrice)}원 ( */}
                </div>
                {/* <div> {formatKoreanCurrency(totalPrice)})</div> */}
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
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={(list) =>
            handleAddEquipmentList(list.map(convertEquipmentItemToState))
          }
          disabledIdList={existIdList}
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
