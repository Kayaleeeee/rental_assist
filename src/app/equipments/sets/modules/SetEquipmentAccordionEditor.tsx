import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import styles from "./setEquipmentAccordion.module.scss";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import { SetEquipmentItemEditor } from "./SetEquipmentItemEditor";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { SetEquipmentStateType } from "@/app/store/useCartStore";
import { getAvailableStatus } from "@/app/components/Cart";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useState } from "react";
import { QuoteEquipmentMoreMenu } from "@/app/reservations/modules/form/QuoteEquipmentMenu";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { convertStateToEquipmentItem } from "@/app/types/mapper/convertStateToEquipmentItem";
import { convertEquipmentItemToState } from "@/app/types/mapper/convertEquipmentItemToState";

type Props = {
  equipmentSet: SetEquipmentStateType;
  isChecked: boolean;
  rentalDays?: number;
  onClickAddEquipment: () => void;
  deleteSetEquipment: () => void;
  changeSetEquipment: (set: SetEquipmentStateType) => void;
  showPrice?: boolean;
};

export const SetEquipmentAccordionEditor = ({
  isChecked,
  equipmentSet,
  onClickAddEquipment,
  deleteSetEquipment,
  changeSetEquipment,
  showPrice,
  rentalDays,
}: Props) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  return (
    <Accordion expanded className={styles.customAccordion}>
      <AccordionSummary>
        <div className={styles.titleWrapper}>
          <div>{equipmentSet.title}</div>
        </div>
        <div className={styles.moreIconWrapper}>
          <MoreVertOutlinedIcon
            onClick={() => setIsOpenMenu(true)}
            className={styles.iconButton}
          />

          <QuoteEquipmentMoreMenu
            menuOpen={isOpenMenu}
            closeMenu={() => setIsOpenMenu(false)}
            totalPrice={equipmentSet.totalPrice || 0}
            onChangeTotalPrice={(changedPrice) =>
              changeSetEquipment({ ...equipmentSet, totalPrice: changedPrice })
            }
            onConfirm={(menu) => {
              if (!menu) return;

              if (menu.key === "delete") {
                deleteSetEquipment();
                return;
              }
            }}
          />
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.equipmentListWrapper}>
          {equipmentSet.equipmentList.map((item) => (
            <SetEquipmentItemEditor
              key={`item.equipmentId_${item.equipmentId}`}
              item={convertStateToEquipmentItem(item)}
              availableStatus={getAvailableStatus(isChecked, item.isAvailable)}
              onChangeField={(item) => {
                const convertedItem = convertEquipmentItemToState(item);
                changeSetEquipment({
                  ...equipmentSet,
                  equipmentList: equipmentSet.equipmentList.map((prev) =>
                    prev.equipmentId === item.id ? convertedItem : prev
                  ),
                });
              }}
              onDeleteEquipment={() => {
                changeSetEquipment({
                  ...equipmentSet,
                  equipmentList: equipmentSet.equipmentList.filter(
                    (prev) => prev.equipmentId !== item.equipmentId
                  ),
                });
              }}
            />
          ))}
          <Button
            variant="outlined"
            size="Small"
            onClick={() => onClickAddEquipment()}
            style={{
              borderColor: "var(--grey-1)",
            }}
          >
            {`${equipmentSet.title}에 장비 추가하기`}
            <AddOutlinedIcon
              style={{
                fontSize: "14px",
                marginLeft: "8px",
              }}
            />
          </Button>
        </div>
        <Margin top={8} />
        {showPrice && (
          <Margin top={20}>
            <div className={styles.inlineWrapper}>
              {rentalDays && <div className={styles.days}>{rentalDays}일</div>}
              <div className={styles.priceWrapper}>
                총 {formatLocaleString(equipmentSet.totalPrice)}원
              </div>
            </div>
          </Margin>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
