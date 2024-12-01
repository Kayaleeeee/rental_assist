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
import { QuotationItemEditor } from "@/app/reservations/modules/form/QuotationItemEditor";
import { SetEquipmentAccordionEditor } from "@/app/equipments/sets/modules/SetEquipmentAccordionEditor";
import { isEmpty } from "lodash";
import { EquipmentSearchModal } from "@/app/reservations/modules/form/EquipmentSearchModal";
import { SetEquipmentType } from "@/app/types/equipmentType";
import { convertEquipmentItemToState } from "@/app/types/mapper/convertEquipmentItemToState";

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

  const router = useRouter();

  const {
    hasUnavailableItem,
    onChangeDate,
    dateRange,
    handleCheckAvailability,
    isChecked,
    setEquipmentItemList,
    rentalDays,
    setIsCartOpen,
    isCartOpen,
    setIsChecked,
    handleChangeGroupEquipment,
    handleDeleteGroupEquipment,
    handleDeleteEquipmentItem,
    equipmentItemList,
    equipmentGroupList,
  } = useEquipmentCart();

  const handleCloseCart = () => {
    setIsCartOpen(false);
    setIsChecked(false);
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
      handleCheckAvailability();
    } else {
      setEquipmentItemList(
        equipmentItemList.map((item) => ({
          equipmentId: item.equipmentId,
          title: item.title,
          price: item.price,
          quantity: 1,
          totalPrice: item.price * rentalDays,
        }))
      );
      handleCloseCart();
      router.push("/reservations/create");
    }
  }, [
    isOkToMakeReservation,
    equipmentItemList,
    handleCheckAvailability,
    setEquipmentItemList,
    router,
    rentalDays,
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

          {!isEmpty(equipmentItemList) && (
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
              </div>
            </Margin>
          )}

          {!isEmpty(equipmentGroupList) && (
            <Margin>
              <Label title="풀세트 리스트" />
              <div>
                {equipmentGroupList.map((item) => {
                  return (
                    <SetEquipmentAccordionEditor
                      key={item.id}
                      equipmentSet={item}
                      isChecked={isChecked}
                      showPrice={false}
                      changeSetEquipment={handleChangeGroupEquipment}
                      onClickAddEquipment={() => {
                        setIsOpenSearchModal(true);
                        setSearchingSetId(item.id);
                      }}
                      deleteSetEquipment={() =>
                        handleDeleteGroupEquipment(item.id)
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
              const changedSet = equipmentGroupList.find(
                (set) => set.id === searchingSetId
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
