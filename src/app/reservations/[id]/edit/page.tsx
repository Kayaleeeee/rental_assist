"use client";

import { FormWrapper } from "@/app/components/Form/FormWrapper";
import styles from "../../reservationPage.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { Button } from "@/app/components/Button";
import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";

import { Margin } from "@/app/components/Margin";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EquipmentSearchModal } from "../../../equipments/modules/EquipmentSearchModal";
import { EditableField } from "@/app/components/EditableField";
import { showToast } from "@/app/utils/toastUtils";
import { UserSearchModal } from "../../../users/modules/UserSearchModal";
import { UserType } from "@/app/types/userType";
import dayjs from "dayjs";
import { useUnmount } from "usehooks-ts";
import { useReservationForm } from "../../hooks/useReservationForm";
import { useParams, useRouter } from "next/navigation";
import { useReservationDetail } from "../../hooks/useReservationDetail";
import { isEmpty, isNil } from "lodash";
import {
  EquipmentListItemState,
  SetEquipmentStateType,
} from "@/app/store/useCartStore";
import { useEquipmentCart } from "@/app/equipments/hooks/useEquipmentCart";
import { onUpdateReservation } from "../../actions/updateReservation";
import { ReservationDetailStateType } from "@/app/types/reservationType";
import { convertEquipmentItemToState } from "@/app/types/mapper/convertEquipmentItemToState";
import {
  EquipmentListItemType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { GroupEquipmentSearchModal } from "../../modules/form/GroupEquipmentSearchModal";

import {
  formatKoreanCurrency,
  formatLocaleString,
} from "@/app/utils/priceUtils";
import {
  getAllEquipmentGroupSupplyPrice,
  getAllEquipmentGroupTotalPrice,
  getAllEquipmentSupplyPrice,
  getAllEquipmentTotalPrice,
} from "../../utils/reservationUtils";
import { convertGroupEquipmentToState } from "@/app/types/mapper/convertGropEquipmentToState";
import { ReservationGroupTableEditor } from "@/app/reservations/modules/form/ReservationGroupTableEditor";
import { ReservationItemTableEditor } from "../../modules/form/ReservationItemTableEditor";

const ReservationEditPage = () => {
  const router = useRouter();
  const [isOpenUserModal, setIsOpenUserModal] = useState(false);
  const { id } = useParams();
  const reservationId = Number(id);
  const isFirstRender = useRef(true);
  const quoteItemListStateRef = useRef<EquipmentListItemState[]>([]);
  const setListStateRef = useRef<SetEquipmentStateType[]>([]);

  const { form, setForm } = useReservationForm();
  const { detail, isLoading } = useReservationDetail(reservationId);
  const [changingStatus, setChangingStatus] = useState<
    { mode: "item" } | { mode: "group"; groupId: SetEquipmentType["id"] } | null
  >(null);
  const [isOpenGroupSearchModal, setIsOpenGroupSearchModal] = useState(false);

  const {
    // hasUnavailableItem,
    handleChangeDate,
    dateRange,
    // handleCheckAvailability,
    // isChecked,
    rentalDays,
    equipmentItemList,
    handleAddEquipmentList,
    handleDeleteEquipmentItem,
    handleChangeEquipmentItem,
    handleSetEquipmentList,

    equipmentGroupList,
    handleDeleteGroupEquipment,
    handleAddEquipmentGroup,
    handleChangeGroupEquipment,
    handleSetEquipmentGroup,
  } = useEquipmentCart();

  const initializeForm = useCallback((detail: ReservationDetailStateType) => {
    setForm({
      userId: detail.userId,
      guestName: detail.userName,
      guestPhoneNumber: detail.phoneNumber || "",
      discountPrice: detail.discountPrice ?? 0,
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

  useUnmount(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  });

  const handleSelectUser = (user: UserType) => {
    setForm((prev) => ({
      ...prev,
      userId: user.id,
      guestName: user.name,
      guestPhoneNumber: user.phoneNumber ?? "",
    }));
  };

  const handleSaveForm = useCallback(async () => {
    if (!detail?.quoteId) return;

    try {
      await onUpdateReservation({
        quoteId: detail.quoteId,
        reservationId,
        form,
        dateRange,
        originQuoteItemList: quoteItemListStateRef.current,
        originSetList: setListStateRef.current,
        equipmentItemList,
        groupEquipmentList: equipmentGroupList,
        rentalDays,
      });

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

  const handleOpenEquipmentModal = (
    status:
      | { mode: "item" }
      | { mode: "group"; groupId: SetEquipmentType["id"] }
  ) => {
    if (rentalDays === 0) {
      showToast({ message: "기간을 설정해주세요.", type: "error" });
      return;
    }

    setChangingStatus(status);
  };

  const handleConfirmEquipmentModal = useCallback(
    (list: EquipmentListItemType[]) => {
      if (!changingStatus) return;

      const convertedList = list.map(convertEquipmentItemToState);

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

  const onClickGroupEquipmentModal = () => {
    if (rentalDays === 0) {
      showToast({ message: "기간을 설정해주세요.", type: "error" });
      return;
    }

    setIsOpenGroupSearchModal(true);
  };

  const existIdList = useMemo(() => {
    const equipmentIdList = equipmentItemList.map((item) => item.equipmentId);
    const groupEquipmentItemIdList = equipmentGroupList
      .flatMap((item) => item.equipmentList)
      .map((item) => item.equipmentId);

    return [...equipmentIdList, ...groupEquipmentItemIdList];
  }, [equipmentItemList, equipmentGroupList]);

  const { total: reservationTotalPrice, supply: reservationSupplyPrice } =
    useMemo(() => {
      const listTotalPrice = getAllEquipmentTotalPrice(
        equipmentItemList,
        rentalDays
      );
      const groupTotalPrice = getAllEquipmentGroupTotalPrice(
        equipmentGroupList,
        rentalDays
      );

      const listSupply = getAllEquipmentSupplyPrice(
        equipmentItemList,
        rentalDays
      );
      const groupSupply = getAllEquipmentGroupSupplyPrice(
        equipmentGroupList,
        rentalDays
      );

      return {
        total: listTotalPrice + groupTotalPrice,
        supply: listSupply + groupSupply,
      };
    }, [equipmentGroupList, equipmentItemList, rentalDays]);

  return (
    <div>
      <FormWrapper title="예약 수정" isLoading={isLoading}>
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

          {rentalDays > 0 && (
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
                    onClick={() => handleOpenEquipmentModal({ mode: "item" })}
                  >
                    단품 장비 추가
                  </Button>
                </div>
                <ReservationItemTableEditor
                  rows={equipmentItemList}
                  rentalDays={rentalDays}
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
                        rentalDays={rentalDays}
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
              <div className={styles.totalPriceWrapper}>
                <div className={styles.totalPrice}>
                  총 {formatLocaleString(reservationTotalPrice)}원
                </div>
                <Margin left={4}>
                  ({formatKoreanCurrency(reservationTotalPrice)})
                </Margin>
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
    </div>
  );
};

export default ReservationEditPage;
