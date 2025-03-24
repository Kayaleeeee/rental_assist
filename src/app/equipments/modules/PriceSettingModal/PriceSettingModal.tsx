import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import styles from "./priceSettingModal.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/app/components/Button";
import { EditableField } from "@/app/components/EditableField";
import { isEmpty } from "lodash";
import {
  EquipmentListItemType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import CloseIcon from "@mui/icons-material/Close";
import {
  EquipmentPriceItem,
  EquipmentGroupPriceItem,
} from "@/app/types/equipmentPriceType";
import { calculatePrices, formatLocaleString } from "@/app/utils/priceUtils";
import { showToast } from "@/app/utils/toastUtils";
import { ModalBasicProps } from "@/app/components/Modal/useModal";

export type PriceItemStateType = {
  id?: number;
  day: number;
  price: number;
};

export interface PriceSettingModalProps extends ModalBasicProps {
  mode: "group" | "item";
  id?: EquipmentListItemType["id"] | SetEquipmentType["id"];
  priceList: PriceItemStateType[];
  onConfirm: (list: PriceItemStateType[]) => void;
}

const defaultPriceItem = {
  day: 1,
  price: 0,
};

const convertPriceStateToPriceList = (list: PriceItemStateType[]) => {
  return list.map((item, index) => ({ ...item, day: index + 1 }));
};

export const PriceSettingModal = ({
  priceList,
  onCloseModal,
  onConfirm,
}: PriceSettingModalProps) => {
  const [priceListState, setPriceListState] =
    useState<PriceItemStateType[]>(priceList);

  useEffect(() => {
    if (isEmpty(priceList)) {
      setPriceListState([defaultPriceItem]);
    }
  }, [priceList]);

  const handleAddCell = (day: number) => {
    const lastItem = priceListState[priceListState.length - 1];
    const newArray = new Array(day)
      .fill(defaultPriceItem)
      .map((item, index) => ({
        ...item,
        day: priceList.length + 1 + index,
        price: lastItem["price"],
      }));

    setPriceListState([...priceListState, ...newArray]);
  };

  const handleDeleteCell = (targetIndex: number) => {
    const newArray = priceListState
      .filter((_, i) => i !== targetIndex)
      .map((item, index) => ({ ...item, day: index + 1 }));

    setPriceListState(newArray);
  };

  const handleChangePrice = (newPrice: number, index: number) => {
    setPriceListState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, price: newPrice } : item))
    );
  };

  const handleConfirmList = (list: PriceItemStateType[]) => {
    if (isEmpty(list)) {
      showToast({
        message: "가격을 입력해주세요.",
        type: "error",
      });
      return;
    }

    const convertedList = convertPriceStateToPriceList(list);
    onConfirm(convertedList);
  };

  const handleFillOut30Days = useCallback(() => {
    if (isEmpty(priceListState) || priceListState[0].price < 1) {
      showToast({ message: "기본 가격을 입력해주세요", type: "error" });
      return;
    }

    const priceList: PriceItemStateType[] = calculatePrices(
      priceListState[0].price,
      30
    );

    setPriceListState(priceList);
  }, [priceListState]);

  const handleDeleteAllPrice = useCallback(() => {
    if (!confirm("전체 가격을 삭제하시겠습니까?")) return;

    setPriceListState([defaultPriceItem]);
  }, []);

  const buttonList = useMemo(
    () => [
      { title: "30일 가격 만들기", onClick: handleFillOut30Days },
      { day: 10, title: "1일 추가", onClick: () => handleAddCell(1) },
      { day: 30, title: "전체 삭제", onClick: handleDeleteAllPrice },
    ],
    [handleFillOut30Days, handleAddCell]
  );

  return (
    <Modal
      onCloseModal={onCloseModal}
      ButtonListWrapperStyle={{
        width: "400px",
        placeSelf: "flex-end",
        marginTop: "12px",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onCloseModal,
        },
        {
          title: "저장하기",
          onClick: () => handleConfirmList(priceListState),
        },
      ]}
    >
      <div>
        <h3 className={styles.modalTitle}>가격 설정</h3>
        <div className={styles.buttonListWrapper}>
          {buttonList.map(({ onClick, title }) => {
            return (
              <Button
                key={title}
                variant="outlined"
                size="Small"
                onClick={onClick}
              >
                {title}
              </Button>
            );
          })}
        </div>
        <div
          style={{
            width: "80vw",
            maxWidth: "900px",
            maxHeight: "60vh",
            overflowY: "scroll",
          }}
        >
          <div className={styles.listWrapper}>
            {priceListState.map((item, index) => {
              return (
                <div key={index} className={styles.cellItem}>
                  <div className={styles.label}>
                    {index + 1}일
                    {index !== 0 && (
                      <div
                        className={styles.closeIconWrapper}
                        onClick={() => handleDeleteCell(index)}
                      >
                        <CloseIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.value}>
                    <EditableField
                      value={item.price}
                      size="small"
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (isNaN(value)) return;
                        handleChangePrice(value, index);
                      }}
                    />
                    원
                  </div>
                </div>
              );
            })}
          </div>
          <Margin bottom={50} />
        </div>
      </div>
    </Modal>
  );
};

export const PriceListTable = ({
  priceList,
}: {
  priceList:
    | EquipmentPriceItem[]
    | EquipmentGroupPriceItem[]
    | PriceItemStateType[];
}) => {
  return (
    <div>
      {isEmpty(priceList) ? (
        <div className={styles.emptyList}>설정된 가격이 없습니다.</div>
      ) : (
        <div className={styles.listWrapper}>
          {priceList.map((item, index) => {
            return (
              <div key={index} className={styles.nonEditableCellItem}>
                <div className={styles.label}>{item.day}일</div>
                <div className={styles.value}>
                  {formatLocaleString(item.price)}원
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
