"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../../reservationPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";

import { Margin } from "@/app/components/Margin";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditableField } from "@/app/components/EditableField";
import { showToast } from "@/app/utils/toastUtils";
import { UserType } from "@/app/types/userType";
import dayjs from "dayjs";
import { useUnmount } from "usehooks-ts";
import { useParams, useRouter } from "next/navigation";
import { useReservationDetail } from "../../hooks/useReservationDetail";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { onUpdateReservation } from "../../actions/updateReservation";
import {
  EquipmentAvailableItem,
  ReservationDetailStateType,
} from "@/app/types/reservationType";
import { convertEquipmentItemToState } from "@/app/types/mapper/convertEquipmentItemToState";
import { SetEquipmentType } from "@/app/types/equipmentType";

import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import {
  getAllEquipmentGroupSupplyPrice,
  getAllEquipmentGroupTotalPrice,
  getAllEquipmentSupplyPrice,
  getAllEquipmentTotalPrice,
  initialAvailability,
} from "../../utils/reservationUtils";
import { convertGroupEquipmentToState } from "@/app/types/mapper/convertGroupEquipmentToState";
import { ReservationGroupTableEditor } from "@/app/reservations/modules/form/ReservationGroupTable/ReservationGroupTableEditor";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useReservationForms } from "../../hooks/useReservationForms";
import { useModal } from "@/app/components/Modal/useModal";
import { ReservationItemTableEditor } from "../../modules/form/ReservationItemTable/ReservationItemTableEditor";

const ReservationEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const reservationId = Number(id);
  const isFirstRender = useRef(true);
  const quoteItemListStateRef = useRef<EquipmentListItemState[]>([]);
  const setListStateRef = useRef<SetEquipmentStateType[]>([]);
  const { detail, isLoading } = useReservationDetail(reservationId);

  const { openModal } = useModal();

  const [availabilityState, setAvailabilityState] = useState<{
    checkedList: EquipmentAvailableItem[];
  }>(initialAvailability);

  const {
    form,
    setForm,
    onChangeForm,
    handleChangeDate,
    dateRange,
    rentalDays,

    equipmentItemControl: {
      equipmentItemList,
      handleAddEquipmentList,
      handleDeleteEquipmentItem,
      handleChangeEquipmentItem,
      handleSetEquipmentList,
      handleChangeItemPriceByRounds,
    },
    groupEquipmentControl: {
      equipmentGroupList,
      handleDeleteGroupEquipment,
      handleAddEquipmentGroup,
      handleChangeGroupEquipment,
      handleSetEquipmentGroup,
      handleChangeGroupPriceByRounds,
    },
  } = useReservationForms();

  const initializeForm = useCallback((detail: ReservationDetailStateType) => {
    setForm({
      userId: detail.userId,
      guestName: detail.userName,
      guestPhoneNumber: detail.phoneNumber || "",
      discountPrice: detail.discountPrice ?? 0,
      rounds: detail.rounds,
    });

    handleChangeDate({
      startDate: detail.startDate,
      endDate: detail.endDate,
    });

    const quoteItemList = detail.equipmentList;
    handleSetEquipmentList(quoteItemList);
    quoteItemListStateRef.current = quoteItemList;

    const setList = detail.setList;
    handleSetEquipmentGroup(setList);
    setListStateRef.current = setList;
  }, []);

  useEffect(() => {
    if (!reservationId || !detail) return;

    initializeForm(detail);
  }, [detail, reservationId]);

  useEffect(() => {
    if (form.rounds < 1) return;

    handleChangeItemPriceByRounds({
      equipmentItemList,
      rounds: form.rounds,
    });
  }, [form.rounds, equipmentItemList]);

  useEffect(() => {
    if (form.rounds < 1) return;

    handleChangeGroupPriceByRounds({
      groupEquipmentList: equipmentGroupList,
      rounds: form.rounds,
    });
  }, [form.rounds, equipmentGroupList]);

  useUnmount(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  });

  const handleSaveForm = useCallback(async () => {
    if (!detail?.quoteId) return;

    try {
      const result = await onUpdateReservation({
        quoteId: detail.quoteId,
        reservationId,
        form,
        dateRange,
        originQuoteItemList: quoteItemListStateRef.current,
        originSetList: setListStateRef.current,
        equipmentItemList,
        groupEquipmentList: equipmentGroupList,
      });

      if ("checkedList" in result) {
        showToast({
          message: "예약 불가한 항목이 있습니다.",
          type: "error",
        });
        setAvailabilityState({ checkedList: result.checkedList });
        return;
      }

      showToast({
        message: "예약이 수정되었습니다.",
        type: "success",
      });
      router.push(`/reservations/${reservationId}`);
    } catch {
      showToast({
        message: "예약 변경에 실패했습니다.",
        type: "error",
      });
    }
  }, [
    detail?.quoteId,
    form,
    dateRange,
    equipmentItemList,
    equipmentGroupList,
    reservationId,
    router,
    rentalDays,
  ]);

  const openEquipmentModal = (
    status:
      | { mode: "item" }
      | { mode: "group"; groupId: SetEquipmentType["id"] }
  ) => {
    if (!dateRange.endDate || !dateRange.startDate) return;

    if (form.rounds === 0) {
      showToast({ message: "기간을 설정해주세요.", type: "error" });
      return;
    }

    if (form.rounds < 1) {
      showToast({
        message: "회차는 1회보다 작을 수 없습니다.",
        type: "error",
      });
      return;
    }

    openModal({
      name: "equipmentSearch",
      props: {
        dateRange: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
        excludeReservationId: reservationId,
        disabledIdList: existIdList,
        onConfirm: (list) => {
          const convertedList = list.map(convertEquipmentItemToState);

          if (status.mode === "group") {
            const targetSet = equipmentGroupList.find(
              (set) => set.setId === status.groupId
            );

            if (targetSet) {
              handleChangeGroupEquipment({
                ...targetSet,
                equipmentList: targetSet.equipmentList.concat(convertedList),
              });
            }
          } else {
            handleAddEquipmentList(convertedList);
          }
        },
      },
    });
  };

  const openGroupEquipmentModal = () => {
    if (form.rounds === 0) {
      showToast({ message: "기간을 설정해주세요.", type: "error" });
      return;
    }

    if (form.rounds < 1) {
      showToast({
        message: "회차는 1회보다 작을 수 없습니다.",
        type: "error",
      });
      return;
    }

    if (dateRange.startDate && dateRange.endDate) {
      openModal({
        name: "groupEquipmentSearch",
        props: {
          dateRange: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
          onConfirm: (list) =>
            handleAddEquipmentGroup(list.map(convertGroupEquipmentToState)),
          disabledGroupIdList: equipmentGroupList.map((group) => group.setId),
          disabledEquipmentIdList: existIdList,
          excludeReservationId: reservationId,
        },
      });
    }
  };

  const openUserSearchModal = () => {
    openModal({
      name: "userSearch",
      props: {
        onConfirm: (user: UserType) => {
          setForm((prev) => ({
            ...prev,
            userId: user.id,
            guestName: user.name,
            guestPhoneNumber: user.phoneNumber ?? "",
          }));
        },
      },
    });
  };

  const openRoundChangeModal = () => {
    openModal({
      name: "round",
      props: {
        currentValue: form.rounds,
        onConfirm: (rounds: number) => onChangeForm("rounds", rounds),
      },
    });
  };

  const openDiscountModal = () => {
    openModal({
      name: "reservationDiscount",
      props: {
        supplyPrice: reservationSupplyPrice + itemDiscount,
        discountPrice: form.discountPrice,
        onConfirm: (discountPrice: number) =>
          onChangeForm("discountPrice", discountPrice),
      },
    });
  };

  const existIdList = useMemo(() => {
    const equipmentIdList = equipmentItemList.map((item) => item.equipmentId);
    const groupEquipmentItemIdList = equipmentGroupList
      .flatMap((item) => item.equipmentList)
      .map((item) => item.equipmentId);

    return [...equipmentIdList, ...groupEquipmentItemIdList];
  }, [equipmentItemList, equipmentGroupList]);

  const {
    total: reservationTotalPrice,
    supply: reservationSupplyPrice,
    itemDiscount,
  } = useMemo(() => {
    const listTotalPrice = getAllEquipmentTotalPrice(equipmentItemList);
    const groupTotalPrice = getAllEquipmentGroupTotalPrice(equipmentGroupList);

    const listSupply = getAllEquipmentSupplyPrice(equipmentItemList);
    const groupSupply = getAllEquipmentGroupSupplyPrice(equipmentGroupList);

    const listDiscount = listTotalPrice - listSupply;
    const groupDiscount = groupTotalPrice - groupSupply;

    return {
      itemDiscount: listDiscount + groupDiscount,
      total: listTotalPrice + groupTotalPrice - form.discountPrice,
      supply: listSupply + groupSupply,
    };
  }, [equipmentGroupList, equipmentItemList, form.discountPrice]);

  return (
    <div>
      <FormWrapper title="예약 수정" isLoading={isLoading}>
        <div className={formStyles.sectionWrapper}>
          <Label title="고객 정보" />

          <Button
            variant="outlined"
            size="Small"
            onClick={openUserSearchModal}
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
                handleChangeDate({ ...dateRange, startDate: value });
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
                handleChangeDate({ ...dateRange, endDate: value });
              }}
            />
          </div>
          <Margin top={20} />
        </div>

        {rentalDays > 0 && (
          <div className={formStyles.sectionWrapper}>
            <Label title={`회차 정보`} />

            <div className={styles.roundRow} onClick={openRoundChangeModal}>
              {form.rounds} 회차
              <EditOutlinedIcon sx={{ color: "var(--grey)" }} />
            </div>
            <Margin top={20} />
          </div>
        )}

        {form.rounds > 0 && (
          <div className={formStyles.sectionWrapper}>
            <Label title="대여 장비 목록" />
            <Margin top={10} />

            <Margin bottom={20}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Label title="단품 장비 리스트" />
                <Button
                  size="Small"
                  variant="outlined"
                  onClick={() => openEquipmentModal({ mode: "item" })}
                >
                  단품 장비 추가
                </Button>
              </div>
              <ReservationItemTableEditor
                rows={equipmentItemList}
                rounds={form.rounds}
                availabilityCheckedList={availabilityState.checkedList}
                onDeleteEquipment={handleDeleteEquipmentItem}
                onChangeField={handleChangeEquipmentItem}
              />
            </Margin>

            <Margin>
              <Label title="풀세트 리스트" />
              <Margin top={20} />
              <div className={styles.equipmentListWrapper}>
                {equipmentGroupList.map((item) => {
                  return (
                    <ReservationGroupTableEditor
                      key={item.setId}
                      groupEquipment={item}
                      rounds={form.rounds}
                      availabilityCheckedList={availabilityState.checkedList}
                      changeSetEquipment={handleChangeGroupEquipment}
                      onClickAddEquipment={() =>
                        openEquipmentModal({
                          mode: "group",
                          groupId: item.setId,
                        })
                      }
                      deleteSetEquipment={() =>
                        handleDeleteGroupEquipment(item.setId)
                      }
                    />
                  );
                })}
                <Button
                  size="Small"
                  variant="outlined"
                  onClick={openGroupEquipmentModal}
                >
                  풀세트 추가
                </Button>
              </div>
            </Margin>
          </div>
        )}

        <div className={styles.priceSection}>
          <div className={styles.priceRowWrapper}>
            <b className={styles.label}>정가</b>
            <div className={styles.value}>
              {formatLocaleString(reservationSupplyPrice)}원
            </div>
          </div>
          {itemDiscount !== 0 && (
            <Margin top={8}>
              <div className={styles.priceRowWrapper}>
                <b className={styles.label}>항목 할인 금액</b>
                <div className={styles.value}>
                  {formatLocaleString(itemDiscount)}원
                </div>
              </div>
            </Margin>
          )}
          <Margin top={8} />
          <div className={styles.priceRowWrapper}>
            <b
              className={styles.label}
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={openDiscountModal}
            >
              견적서 할인
            </b>

            <div className={styles.value}>
              -{formatLocaleString(form.discountPrice)}원
            </div>
          </div>
          <Margin top={8} />
          <div className={styles.priceRowWrapper}>
            <b className={styles.label}>총 금액</b>
            <div className={styles.value}>
              <b>{formatLocaleString(reservationTotalPrice)}원</b>
            </div>
          </div>
          ({formatKoreanCurrency(reservationTotalPrice)})
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
    </div>
  );
};

export default ReservationEditPage;
