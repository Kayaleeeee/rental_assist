import { EquipmentCategory } from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import styles from "./setEquipmentAccordion.module.scss";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import { SetEquipmentItemEditor } from "./SetEquipmentItemEditor";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { getAvailableStatus } from "@/app/components/Cart";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useState } from "react";
import { QuoteEquipmentMoreMenu } from "@/app/reservations/modules/form/QuoteEquipmentMenu";
import { formatLocaleString } from "@/app/utils/priceUtils";

type Props = {
  title: string;
  equipmentList: EquipmentListItemState[];
  addEquipmentItem: () => void;
  deleteSetEquipment: () => void;
  deleteEquipmentItem: (id: EquipmentListItemState["equipmentId"]) => void;
  changeQuantity?: (quantity: number) => void;
  isChecked: boolean;
  price?: number;
  changePrice?: (price: number) => void;
};

export const SetEquipmentAccordionEditor = ({
  title,
  isChecked,
  equipmentList = [],
  price,
  addEquipmentItem,
  deleteEquipmentItem,
  deleteSetEquipment,
  changeQuantity,
  changePrice,
}: Props) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  return (
    <Accordion expanded className={styles.customAccordion}>
      <AccordionSummary>
        <div className={styles.titleWrapper}>
          <div>{title}</div>
        </div>
        <div className={styles.moreIconWrapper}>
          <MoreVertOutlinedIcon
            onClick={() => setIsOpenMenu(true)}
            className={styles.iconButton}
          />

          <QuoteEquipmentMoreMenu
            menuOpen={isOpenMenu}
            closeMenu={() => setIsOpenMenu(false)}
            totalPrice={price || 0}
            onChangeTotalPrice={(changedPrice) => changePrice?.(changedPrice)}
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
          {equipmentList.map((item) => (
            <SetEquipmentItemEditor
              key={`item.equipmentId_${item.equipmentId}`}
              item={{
                id: item.equipmentId,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                detail: "",
                category: EquipmentCategory.others,
                disabled: false,
              }}
              availableStatus={getAvailableStatus(isChecked, item.isAvailable)}
              onChangeField={(item) => changeQuantity?.(item.quantity)}
              onDeleteEquipment={() => {
                deleteEquipmentItem(item.equipmentId);
              }}
            />
          ))}
          <Button
            variant="outlined"
            size="Small"
            onClick={() => addEquipmentItem()}
            style={{
              borderColor: "var(--grey-1)",
            }}
          >
            {`${title}에 장비 추가하기`}
            <AddOutlinedIcon
              style={{
                fontSize: "14px",
                marginLeft: "8px",
              }}
            />
          </Button>
        </div>
        <Margin top={8} />
        {price && (
          <div className={styles.priceWrapper}>
            총 {formatLocaleString(price)}원
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
