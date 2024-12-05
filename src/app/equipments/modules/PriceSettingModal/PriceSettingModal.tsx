import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import styles from "./priceSettingModal.module.scss";
import { useEffect, useState } from "react";
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
import { formatLocaleString } from "@/app/utils/priceUtils";

export type PriceItemStateType = {
  id?: number;
  day: number;
  price: number;
};

type Props = {
  mode: "group" | "item";
  id?: EquipmentListItemType["id"] | SetEquipmentType["id"];
  priceList: PriceItemStateType[];
  onClose: () => void;
  onConfirm: (list: PriceItemStateType[]) => void;
};

const defaultPriceItem = {
  day: 1,
  price: 0,
};

const buttonList = [{ day: 1 }, { day: 10 }, { day: 30 }];

const convertPriceStateToPriceList = (list: PriceItemStateType[]) => {
  return list.map((item, index) => ({ ...item, day: index + 1 }));
};

export const PriceSettingModal = ({ priceList, onClose, onConfirm }: Props) => {
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
    const convertedList = convertPriceStateToPriceList(list);
    onConfirm(convertedList);
  };

  return (
    <Modal
      onCloseModal={onClose}
      ButtonListWrapperStyle={{
        width: "400px",
        placeSelf: "flex-end",
        marginTop: "12px",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onClose,
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
          {buttonList.map(({ day }) => {
            return (
              <Button
                key={day}
                variant="outlined"
                size="Small"
                onClick={() => handleAddCell(day)}
              >
                {day}일 추가
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
