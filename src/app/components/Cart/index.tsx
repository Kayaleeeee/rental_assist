"use client";

import { Button } from "../Button";
import styles from "./index.module.scss";
import { Label } from "../Form/Label";
import { Margin } from "../Margin";
import { DateTimeSelector } from "../DateTimeSelector";
import { useEquipmentCart } from "@/app/equipments/hooks/useEquipmentCart";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { EquipmentSearchModal } from "@/app/equipments/modules/EquipmentSearchModal";
import { SetEquipmentType } from "@/app/types/equipmentType";
import { convertEquipmentItemToState } from "@/app/types/mapper/convertEquipmentItemToState";
import { EquipmentAvailableItem } from "@/app/types/reservationType";
import {
  checkEquipmentAvailability,
  initialAvailability,
} from "@/app/reservations/utils/reservationUtils";
import { CartGroupTableEditor } from "./CartGroupTableEditor";
import { CartItemTableEditor } from "./CartItemTableEditor";
import { showToast } from "@/app/utils/toastUtils";
import CloseIcon from "@mui/icons-material/Close";

export const getAvailableStatus = (
  isChecked: boolean,
  isAvailable?: boolean
) => {
  if (!isChecked) return "unknown";
  if (isAvailable) return "available";
  return "unavailable";
};

export const Cart = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [searchingSetId, setSearchingSetId] = useState<
    SetEquipmentType["id"] | null
  >(null);
  const [availabilityState, setAvailabilityState] = useState<{
    checkedList: EquipmentAvailableItem[];
  }>(initialAvailability);

  const router = useRouter();

  const {
    handleChangeDate,
    dateRange,

    rentalDays,
    setIsCartOpen,
    isCartOpen,
    handleChangeEquipmentItem,
    handleChangeGroupEquipment,
    handleDeleteGroupEquipment,
    handleDeleteEquipmentItem,
    handleAddEquipmentList,
    equipmentItemList,
    equipmentGroupList,
  } = useEquipmentCart();

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  useEffect(() => {
    const mainWrapper = document.getElementsByClassName("mainWrapper")[0];

    if (isCartOpen) {
      mainWrapper.setAttribute("style", "overflow: hidden");
      mainWrapper.setAttribute("style", "height: 100vh");
    } else {
      mainWrapper.setAttribute("style", "overflow: scroll");
      mainWrapper.setAttribute("style", "height: auto");
    }
  }, [isCartOpen]);

  const handleCheckEquipmentAvailability = useCallback(async () => {
    return await checkEquipmentAvailability({
      dateRange: {
        startDate: dateRange.startDate!,
        endDate: dateRange.endDate!,
      },
      equipmentItemList,
      groupEquipmentList: equipmentGroupList,
    });
  }, [dateRange, equipmentGroupList, equipmentItemList]);

  const onClickButton = useCallback(async () => {
    if (!dateRange.endDate || !dateRange.startDate) {
      showToast({
        message: "예약 날짜를 지정해주세요.",
        type: "error",
      });
      return;
    }

    setAvailabilityState(initialAvailability);

    try {
      const { isAvailable, checkedList } =
        await handleCheckEquipmentAvailability();

      if (!isAvailable && !isEmpty(checkedList)) {
        showToast({
          message: "예약 불가한 항목이 있습니다.",
          type: "error",
        });

        setAvailabilityState({
          checkedList,
        });
        return;
      }
      showToast({
        message: "해당 날짜에 모든 장비 예약 가능합니다.",
        type: "success",
      });
    } catch (e) {
      console.log(e);
    }
  }, [
    handleAddEquipmentList,
    handleCheckEquipmentAvailability,
    router,
    rentalDays,
    dateRange,
  ]);

  const disabledEquipmentIdList = useMemo(() => {
    const equipmentIdList = equipmentItemList.map((item) => item.equipmentId);

    const setItemList = equipmentGroupList
      .flatMap((item) => item.equipmentList)
      .map((item) => item.equipmentId);

    return [...equipmentIdList, ...setItemList];
  }, [equipmentItemList, equipmentGroupList]);

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleCloseCart} />
      <div className={styles.cartContainer}>
        <section className={styles.main}>
          <div className={styles.header}>
            <h3>장비 장바구니</h3>
            <div className={styles.closeIconWrapper} onClick={handleCloseCart}>
              <CloseIcon
                sx={{
                  fontSize: "30px",
                }}
              />
            </div>
          </div>
          <Margin bottom={16} />
          <div className={styles.dateWrapper}>
            <Label title="대여 시작일" />
            <DateTimeSelector
              value={dateRange.startDate}
              onChange={(value) => {
                if (!value) return;
                handleChangeDate({ ...dateRange, startDate: value });
              }}
            />
            <Margin bottom={10} />

            <Label title="반납일" />
            <DateTimeSelector
              disabled={!dateRange.startDate}
              minDateTime={dayjs(dateRange.startDate)}
              value={dateRange.endDate}
              onChange={(value) => {
                if (!value) return;
                handleChangeDate({ ...dateRange, endDate: value });
              }}
            />
          </div>

          {!isEmpty(equipmentItemList) && (
            <Margin bottom={40}>
              <Label title="단품 장비 리스트" />
              <div className={styles.equipmentListWrapper}>
                <CartItemTableEditor
                  rows={equipmentItemList}
                  onDeleteEquipment={handleDeleteEquipmentItem}
                  onChangeField={handleChangeEquipmentItem}
                  availabilityCheckedList={availabilityState.checkedList}
                />
              </div>
            </Margin>
          )}

          {!isEmpty(equipmentGroupList) && (
            <Margin>
              <Label title="풀세트 리스트" />
              <Margin bottom={30} />
              <div className={styles.equipmentListWrapper}>
                {equipmentGroupList.map((item) => {
                  return (
                    <CartGroupTableEditor
                      key={item.setId}
                      groupEquipment={item}
                      availabilityCheckedList={availabilityState.checkedList}
                      changeSetEquipment={handleChangeGroupEquipment}
                      onClickAddEquipment={() => {
                        setIsOpenSearchModal(true);
                        setSearchingSetId(item.setId);
                      }}
                      deleteSetEquipment={() =>
                        handleDeleteGroupEquipment(item.setId)
                      }
                    />
                  );
                })}
              </div>
            </Margin>
          )}
        </section>
        <section className={styles.footer}>
          <Button
            size="Medium"
            onClick={onClickButton}
            style={{
              flex: 1,
              width: "100%",
            }}
          >
            예약 가능 여부 조회하기
          </Button>
        </section>
      </div>
      {isOpenSearchModal && (
        <EquipmentSearchModal
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={(newList) => {
            if (searchingSetId) {
              const changedSet = equipmentGroupList.find(
                (set) => set.setId === searchingSetId
              );

              if (!changedSet) return;
              const convertedList = newList.map(convertEquipmentItemToState);

              handleChangeGroupEquipment({
                ...changedSet,
                equipmentList: [...changedSet.equipmentList, ...convertedList],
              });
            }
          }}
          disabledIdList={disabledEquipmentIdList}
        />
      )}
    </>
  );
};
