"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../reservationPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";

import { Margin } from "@/app/components/Margin";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EquipmentSearchModal } from "../../equipments/modules/EquipmentSearchModal";
import { EditableField } from "@/app/components/EditableField";
import { showToast } from "@/app/utils/toastUtils";
import { UserSearchModal } from "../../users/modules/UserSearchModal";
import { UserType } from "@/app/types/userType";
import dayjs from "dayjs";
import { GroupEquipmentSearchModal } from "../modules/form/GroupEquipmentSearchModal";
import {
  EquipmentListItemType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { isEmpty, isNil } from "lodash";
import { onCreateReservation } from "../actions/createReservation";
import { useRouter } from "next/navigation";
import { convertEquipmentItemToStateWithOption } from "@/app/types/mapper/convertEquipmentItemToState";
import {
  getAllEquipmentGroupSupplyPrice,
  getAllEquipmentGroupTotalPrice,
  getAllEquipmentSupplyPrice,
  getAllEquipmentTotalPrice,
  initialAvailability,
} from "../utils/reservationUtils";
import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import { convertGroupEquipmentToState } from "@/app/types/mapper/convertGroupEquipmentToState";
import { ReservationItemTableEditor } from "../modules/form/ReservationItemTableEditor";
import { ReservationGroupTableEditor } from "@/app/reservations/modules/form/ReservationGroupTableEditor";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { RoundChangeModal } from "../modules/form/RoundChangeModal";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import { useReservationForms } from "../hooks/useReservationForms";
import { DiscountModal } from "../modules/DiscountModal";

const ReservationCreatePage = () => {
  const router = useRouter();
  const [isOpenGroupSearchModal, setIsOpenGroupSearchModal] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isOpenRoundChangeModal, setIsOpenRoundChangeModal] = useState(false);
  const [isOpenDiscountModal, setIsOpenDiscountModal] = useState(false);
  const [changingStatus, setChangingStatus] = useState<
    { mode: "item" } | { mode: "group"; groupId: SetEquipmentType["id"] } | null
  >(null);

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
    equipmentItemList,
    handleDeleteEquipmentItem,
    handleChangeEquipmentItem,
    handleAddEquipmentList,
    handleChangeItemPriceByRounds,

    equipmentGroupList,
    handleDeleteGroupEquipment,
    handleChangeGroupEquipment,
    handleAddEquipmentGroup,
    handleChangeGroupPriceByRounds,
  } = useReservationForms();

  useEffect(() => {
    onChangeForm("rounds", rentalDays);
  }, [rentalDays]);

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

  const handleOpenEquipmentModal = (
    status:
      | { mode: "item" }
      | { mode: "group"; groupId: SetEquipmentType["id"] }
  ) => {
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

    setChangingStatus(status);
  };

  const onClickGroupEquipmentModal = () => {
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

    setIsOpenGroupSearchModal(true);
  };

  const handleSelectUser = (user: UserType) => {
    setForm((prev) => ({
      ...prev,
      userId: user.id,
      guestName: user.name,
      guestPhoneNumber: user.phoneNumber ?? "",
    }));
  };

  const handleConfirmEquipmentModal = useCallback(
    async (list: EquipmentListItemType[]) => {
      if (!changingStatus) return;

      const convertedList = list.map((item) =>
        convertEquipmentItemToStateWithOption(item, { quantity: 1 })
      );

      if (changingStatus.mode === "item") {
        handleAddEquipmentList(convertedList);
        return;
      }

      if (changingStatus.mode === "group") {
        const targetSet = equipmentGroupList.find(
          (set) => set.setId === changingStatus.groupId
        );

        if (targetSet) {
          handleChangeGroupEquipment({
            ...targetSet,
            equipmentList: targetSet.equipmentList.concat(convertedList),
          });
        }
      }
    },
    [changingStatus, equipmentGroupList, equipmentItemList]
  );

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

  const existIdList = useMemo(() => {
    const equipmentIdList = equipmentItemList.map((item) => item.equipmentId);
    const groupEquipmentItemIdList = equipmentGroupList
      .flatMap((item) => item.equipmentList)
      .map((item) => item.equipmentId);

    return [...equipmentIdList, ...groupEquipmentItemIdList];
  }, [equipmentItemList, equipmentGroupList]);

  const handleChangeRounds = useCallback((rounds: number) => {
    onChangeForm("rounds", rounds);
  }, []);

  const handleCreateReservation = useCallback(async () => {
    setAvailabilityState(initialAvailability);

    try {
      const result = await onCreateReservation({
        form,
        dateRange,
        equipmentItemList,
        groupEquipmentList: equipmentGroupList,
      });

      if (!result.reservationId && "checkedList" in result) {
        showToast({
          message: "예약 불가한 항목이 있습니다.",
          type: "error",
        });
        setAvailabilityState({
          checkedList: result.checkedList,
        });
        return;
      }

      showToast({
        message: "예약이 생성되었습니다.",
        type: "success",
      });

      router.push("/reservations");
    } catch (e) {
      console.log(e);
      showToast({
        message: "예약 생성에 오류가 발생했습니다.",
        type: "error",
      });
    }
  }, [
    form,
    dateRange,
    equipmentGroupList,
    equipmentItemList,
    router,
    rentalDays,
  ]);

  return (
    <div>
      <FormWrapper title="예약 생성">
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

            <div
              className={styles.roundRow}
              onClick={() => setIsOpenRoundChangeModal(true)}
            >
              {form.rounds} 회차
              <EditOutlinedIcon sx={{ color: "var(--grey)" }} />
            </div>
            <Margin top={20} />
          </div>
        )}

        {form.rounds > 0 && (
          <div className={formStyles.sectionWrapper}>
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
                  onClick={() => handleOpenEquipmentModal({ mode: "item" })}
                >
                  단품 장비 추가
                </Button>
              </div>
              <ReservationItemTableEditor
                rows={equipmentItemList}
                rounds={form.rounds}
                onDeleteEquipment={handleDeleteEquipmentItem}
                onChangeField={handleChangeEquipmentItem}
                availabilityCheckedList={availabilityState.checkedList}
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
                        handleOpenEquipmentModal({
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
                  onClick={onClickGroupEquipmentModal}
                >
                  풀세트 추가
                </Button>
              </div>
            </Margin>
          </div>
        )}

        {!isEmpty([...equipmentGroupList, ...equipmentItemList]) && (
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
                onClick={() => setIsOpenDiscountModal(true)}
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
        )}

        <div className={styles.buttonWrapper}>
          <Button
            size="Medium"
            style={{ width: "250px" }}
            onClick={handleCreateReservation}
          >
            생성하기
          </Button>
        </div>
      </FormWrapper>
      {!isNil(changingStatus) && dateRange.startDate && dateRange.endDate && (
        <EquipmentSearchModal
          onCloseModal={() => setChangingStatus(null)}
          onConfirm={handleConfirmEquipmentModal}
          disabledIdList={existIdList}
        />
      )}
      {isOpenGroupSearchModal && dateRange.startDate && dateRange.endDate && (
        <GroupEquipmentSearchModal
          onCloseModal={() => setIsOpenGroupSearchModal(false)}
          onConfirm={(list) =>
            handleAddEquipmentGroup(list.map(convertGroupEquipmentToState))
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
      {isOpenRoundChangeModal && (
        <RoundChangeModal
          currentValue={form.rounds}
          onConfirm={handleChangeRounds}
          onClose={() => setIsOpenRoundChangeModal(false)}
        />
      )}
      {isOpenDiscountModal && (
        <DiscountModal
          supplyPrice={reservationSupplyPrice + itemDiscount}
          discountPrice={form.discountPrice}
          onClose={() => setIsOpenDiscountModal(false)}
          onConfirm={(discountPrice) =>
            onChangeForm("discountPrice", discountPrice)
          }
        />
      )}
    </div>
  );
};

export default ReservationCreatePage;
