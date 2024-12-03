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
  rentalDays: number;
};

export const GroupEquipment = ({
  title,
  price,
  totalPrice,
  equipmentList,
  rentalDays,
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
        <Margin top={20}>
          <div className={styles.inlineWrapper}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div className={styles.priceWrapper}>
                단가: {formatLocaleString(price)}원
              </div>
              <div className={styles.priceWrapper}>* 1 개</div>

              {rentalDays > 0 && (
                <div className={styles.days}> * {rentalDays}일</div>
              )}
            </div>
            <div
              className={styles.priceWrapper}
              style={{
                fontWeight: "bold",
              }}
            >
              총 {formatLocaleString(totalPrice)}원
            </div>
          </div>
        </Margin>
      </AccordionDetails>
    </Accordion>
  );
};
