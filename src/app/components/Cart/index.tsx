"use client";

import { Button } from "../Button";
import styles from "./index.module.scss";
import { Label } from "../Form/Label";
import { Margin } from "../Margin";
import { DateTimeSelector } from "../DateTimeSelector";
import {
  EquipmentAvailabilityType,
  EquipmentSetAvailabilityType,
  useEquipmentCart,
} from "@/app/equipments/hooks/useEquipmentCart";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { QuotationItemEditor } from "@/app/reservations/modules/form/QuotationItemEditor";
import { SetEquipmentAccordionEditor } from "@/app/equipments/sets/modules/SetEquipmentAccordionEditor";
import { isEmpty } from "lodash";
import { EquipmentSearchModal } from "@/app/reservations/modules/form/EquipmentSearchModal";
import { SetEquipmentType } from "@/app/types/equipmentType";

export const Cart = () => {
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [searchingSetId, setSearchingSetId] = useState<
    SetEquipmentType["id"] | null
  >(null);

  const router = useRouter();

  const {
    hasUnavailableItem,
    onChangeDate,
    dateRange,
    checkAvailability,
    availableListState,
    availableSetListState,
    isChecked,
    removeItem,
    setList,
    rentalDays,
    setIsCartOpen,
    isCartOpen,
    changeEquipmentSet,
    removeSet,
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

  const isOkToMakeReservation = !hasUnavailableItem && isChecked;

  const onClickButton = useCallback(() => {
    if (!isOkToMakeReservation) {
      checkAvailability();
    } else {
      setList(
        availableListState.map((item) => ({
          equipmentId: item.equipmentId,
          title: item.title,
          price: item.price,
          quantity: 1,
          totalPrice: item.price * rentalDays,
        }))
      );
      router.push("/reservations/create");
    }
  }, [
    isOkToMakeReservation,
    availableListState,
    checkAvailability,
    setList,
    router,
    rentalDays,
  ]);

  const handleDeleteSetEquipment = (
    setEquipment: EquipmentSetAvailabilityType,
    equipmentItemId: EquipmentAvailabilityType["equipmentId"]
  ) => {
    changeEquipmentSet({
      ...setEquipment,
      equipmentList: setEquipment.equipmentList.filter(
        (item) => item.equipmentId !== equipmentItemId
      ),
    });
  };

  const disabledEquipmentIdList = useMemo(() => {
    const equipmentIdList = availableListState.map((item) => item.equipmentId);
    const setItemList = availableSetListState
      .flatMap((item) => item.equipmentList)
      .map((item) => item.equipmentId);

    return [...equipmentIdList, ...setItemList];
  }, [availableListState, availableSetListState]);

  if (!isCartOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleCloseCart} />
      <div className={styles.cartContainer}>
        <section className={styles.main}>
          <h3>장비 장바구니</h3>
          <Margin bottom={16} />
          <div className={styles.dateWrapper}>
            <Label title="대여 시작일" />
            <DateTimeSelector
              value={dateRange.startDate}
              onChange={(value) => {
                if (!value) return;
                onChangeDate("startDate", value);
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
                onChangeDate("endDate", value);
              }}
            />
          </div>

          {!isEmpty(availableListState) && (
            <Margin bottom={20}>
              <Label title="단품 장비 리스트" />
              <div className={styles.equipmentListWrapper}>
                {/* {availableListState.map((item) => {
              const isAvailable = isChecked && item.isAvailable;
              const unavailable = isChecked && !item.isAvailable;
              const color = !isChecked
                ? "black"
                : isAvailable
                ? "var(--green)"
                : "var(--error)";

              const className = !isChecked
                ? styles.equipmentItem
                : item.isAvailable
                ? styles.availableItem
                : styles.unavailableItem;

              return (
                <div
                  key={item.equipmentId}
                  className={className}
                  onClick={
                    unavailable
                      ? () => {
                          window.open(
                            `/reservations/${item.reservationId}`,
                            "_blank"
                          );
                        }
                      : undefined
                  }
                >
                  {isAvailable && <CheckCircleOutlineIcon style={{ color }} />}
                  {unavailable && <CancelIcon style={{ color }} />}
                  <div
                    className={styles.title}
                    style={{
                      color,
                    }}
                  >
                    {item.title}
                  </div>
                  <div> {formatLocaleString(item.price)}원 / day</div>
                  <div
                    className={styles.closeButtonWrapper}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.equipmentId);
                    }}
                  >
                    <CloseOutlinedIcon className={styles.closeButton} />
                  </div>
                </div>
              );
            })} */}

                {availableListState.map((item) => {
                  return (
                    <QuotationItemEditor
                      key={item.equipmentId}
                      quoteState={item}
                      rentalDays={rentalDays}
                      onChangeField={() => {}}
                      onDeleteEquipment={() => removeItem(item.equipmentId)}
                      availableStatus={
                        item.isAvailable
                          ? "available"
                          : isChecked
                          ? "unavailable"
                          : "unknown"
                      }
                    />
                  );
                })}
              </div>
            </Margin>
          )}

          {!isEmpty(availableSetListState) && (
            <Margin>
              <Label title="풀세트 리스트" />
              <div>
                {availableSetListState.map((item) => {
                  return (
                    <SetEquipmentAccordionEditor
                      key={item.id}
                      title={item.title}
                      price={item.price}
                      equipmentList={item.equipmentList}
                      changeQuantity={() => {}}
                      changePrice={() => {}}
                      addEquipmentItem={() => {
                        setIsOpenSearchModal(true);
                        setSearchingSetId(item.id);
                      }}
                      deleteEquipmentItem={(equipmentId) =>
                        handleDeleteSetEquipment(item, equipmentId)
                      }
                      deleteSetEquipment={() => removeSet(item.id)}
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
            {isOkToMakeReservation
              ? "이 리스트로 예약만들기"
              : "예약 가능 여부 확인하기"}
          </Button>
        </section>
      </div>
      {isOpenSearchModal && (
        <EquipmentSearchModal
          onCloseModal={() => setIsOpenSearchModal(false)}
          onConfirm={(newList) => {
            if (searchingSetId) {
              const changedSet = availableSetListState.find(
                (set) => set.id === searchingSetId
              );

              if (!changedSet) return;

              changeEquipmentSet({
                ...changedSet,
                equipmentList: [...changedSet.equipmentList, ...newList],
              });
              return;
            }
          }}
          disabledIdList={disabledEquipmentIdList}
        />
      )}
    </>
  );
};
