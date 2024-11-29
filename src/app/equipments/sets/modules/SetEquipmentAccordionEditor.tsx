import { EquipmentCategory } from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import styles from "./setEquipmentAccordion.module.scss";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import { SetEquipmentItemEditor } from "./SetEquipmentItemEditor";
import { EquipmentAvailabilityType } from "../../hooks/useEquipmentCart";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState } from "react";
import { EditableField } from "@/app/components/EditableField";

type Props = {
  title: string;
  price: number;
  equipmentList: EquipmentAvailabilityType[];
  addEquipmentItem: () => void;
  deleteSetEquipment: () => void;
  deleteEquipmentItem: (id: EquipmentAvailabilityType["equipmentId"]) => void;
  changeQuantity: (quantity: number) => void;
  changePrice: (price: number) => void;
};

export const SetEquipmentAccordionEditor = ({
  title,
  price,
  equipmentList = [],
  addEquipmentItem,
  deleteEquipmentItem,
  deleteSetEquipment,
  changeQuantity,
}: Props) => {
  return (
    <Accordion expanded className={styles.customAccordion}>
      <AccordionSummary
        expandIcon={
          <div onClick={deleteSetEquipment}>
            <CloseOutlinedIcon />
          </div>
        }
      >
        <div className={styles.titleWrapper}>
          <div>{title}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.equipmentListWrapper}>
          {equipmentList.map((item) => (
            <SetEquipmentItemEditor
              key={item.equipmentId}
              item={{
                id: item.equipmentId,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                detail: "",
                category: EquipmentCategory.others,
                disabled: false,
              }}
              onChangeField={(item) => changeQuantity(item.quantity)}
              onDeleteEquipment={() => {
                deleteEquipmentItem(item.equipmentId);
              }}
            />
          ))}
          <Button
            variant="outlined"
            size="Small"
            onClick={() => addEquipmentItem()}
          >
            {`${title}에 장비 추가하기`}
          </Button>
        </div>
        <Margin top={8} />
      </AccordionDetails>
    </Accordion>
  );
};
