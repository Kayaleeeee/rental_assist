import { Margin } from "@/app/components/Margin";
import styles from "./setEquipmentAccordion.module.scss";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { GroupEquipmentItem } from "./GroupEquipmentItem";
import { EquipmentListItemType } from "@/app/types/equipmentType";
import { formatLocaleString } from "@/app/utils/priceUtils";

type Props = {
  title: string;
  price: number;
  totalPrice: number;
  equipmentList: EquipmentListItemType[];
};

export const GroupEquipment = ({
  title,
  price,
  totalPrice,
  equipmentList,
}: Props) => {
  return (
    <Accordion expanded className={styles.customAccordion}>
      <AccordionSummary>
        <div className={styles.titleWrapper}>
          <div>{title}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.equipmentListWrapper}>
          {equipmentList.map((item) => (
            <GroupEquipmentItem
              key={`item.equipmentId_${item.id}`}
              item={item}
              isSelectable={false}
            />
          ))}
        </div>
        <Margin top={8} />
        {price && (
          <div className={styles.priceWrapper}>
            총 {formatLocaleString(totalPrice)}원
          </div>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
