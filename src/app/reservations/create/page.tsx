"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../reservationPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";

import { Margin } from "@/app/components/Margin";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EquipmentSearchModal } from "../../equipments/modules/EquipmentSearchModal";
import { EditableField } from "@/app/components/EditableField";
import { showToast } from "@/app/utils/toastUtils";
import { UserSearchModal } from "../../users/modules/UserSearchModal";
import { UserType } from "@/app/types/userType";
import dayjs from "dayjs";
import { useUnmount } from "usehooks-ts";
import { useReservationForm } from "../hooks/useReservationForm";
import { useEquipmentCart } from "@/app/equipments/hooks/useEquipmentCart";
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

const ReservationCreatePage = () => {
  const router = useRouter();
  const [isOpenGroupSearchModal, setIsOpenGroupSearchModal] = useState(false);
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const [isOpenRoundChangeModal, setIsOpenRoundChangeModal] = useState(false);

  const [isDiscounted, setIsDiscounted] = useState<boolean>(false);
  const [discountPriceState, setDiscountPriceState] = useState<number>(0);
  const [changingStatus, setChangingStatus] = useState<
    { mode: "item" } | { mode: "group"; groupId: SetEquipmentType["id"] } | null
  >(null);

  const {
    // hasUnavailableItem,

    handleChangeDate,
    dateRange,
    // handleCheckAvailability,
    // isChecked,
    rentalDays,
    resetCart,
    equipmentItemList,
    handleDeleteEquipmentItem,
    handleChangeEquipmentItem,
    handleAddEquipmentListWithPrice,

    equipmentGroupList,
    handleDeleteGroupEquipment,
    handleChangeGroupEquipment,
    handleAddEquipmentGroupWithPrice,
  } = useEquipmentCart();

  const { form, setForm, onChangeForm } = useReservationForm();

  const isFirstRender = useRef(true);

  useEffect(() => {
    setIsDiscounted(form.discountPrice > 0);
  }, [form]);

  useEffect(() => {
    onChangeForm("rounds", rentalDays);
    // change equipment price
  }, [rentalDays]);

  useUnmount(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    resetCart();
  });

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
        handleAddEquipmentListWithPrice(convertedList, form.rounds);
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
    [changingStatus, equipmentGroupList, equipmentItemList, form.rounds]
  );

  const { total: reservationTotalPrice, supply: reservationSupplyPrice } =
    useMemo(() => {
      const listTotalPrice = getAllEquipmentTotalPrice(equipmentItemList);
      const groupTotalPrice =
        getAllEquipmentGroupTotalPrice(equipmentGroupList);

      const listSupply = getAllEquipmentSupplyPrice(equipmentItemList);
      const groupSupply = getAllEquipmentGroupSupplyPrice(equipmentGroupList);

      return {
        total: listTotalPrice + groupTotalPrice,
        supply: listSupply + groupSupply,
      };
    }, [equipmentGroupList, equipmentItemList]);

  const existIdList = useMemo(() => {
    return equipmentItemList.map((item) => item.equipmentId);
  }, [equipmentItemList]);

  const handleChangeRounds = useCallback((rounds: number) => {
    onChangeForm("rounds", rounds);
  }, []);

  const handleCreateReservation = useCallback(async () => {
    try {
      await onCreateReservation({
        form,
        dateRange,
        equipmentItemList,
        groupEquipmentList: equipmentGroupList,
      });

      showToast({
        message: "예약이 생성되었습니다.",
        type: "success",
      });
      router.push("/reservations");
    } catch {
      showToast({
        message: "예약 생성에 오류가 발생했습니다.",
        type: "error",
      });
    }
  }, [
    form,
    dateRange,
    equipmentGroupList,
    equipmentGroupList,
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
        {!isEmpty(equipmentItemList) && (
          <div className={styles.priceSection}>
            <div className={styles.discountPriceWrapper}>
              <Label title="정가" />
              <div>{formatLocaleString(reservationSupplyPrice)}원</div>
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
                총 {formatLocaleString(reservationTotalPrice)}원 (
              </div>
              <div> {formatKoreanCurrency(reservationTotalPrice)})</div>
            </div>
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
            handleAddEquipmentGroupWithPrice(
              list.map(convertGroupEquipmentToState),
              form.rounds
            )
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
    </div>
  );
};

export default ReservationCreatePage;
