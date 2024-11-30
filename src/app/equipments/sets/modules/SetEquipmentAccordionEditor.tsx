import { EquipmentCategory } from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

import styles from "./setEquipmentAccordion.module.scss";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import { SetEquipmentItemEditor } from "./SetEquipmentItemEditor";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { EquipmentListItemState } from "@/app/store/useCartStore";
import { getAvailableStatus } from "@/app/components/Cart";

type Props = {
  title: string;
  equipmentList: EquipmentListItemState[];
  addEquipmentItem: () => void;
  deleteSetEquipment: () => void;
  deleteEquipmentItem: (id: EquipmentListItemState["equipmentId"]) => void;
  changeQuantity: (quantity: number) => void;
  changePrice: (price: number) => void;
  isChecked: boolean;
};

export const SetEquipmentAccordionEditor = ({
  title,
  isChecked,
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
