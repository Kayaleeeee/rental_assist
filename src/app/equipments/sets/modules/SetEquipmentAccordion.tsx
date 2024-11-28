import { EquipmentListItemType } from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./setEquipmentAccordion.module.scss";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import { SetEquipmentItem } from "./SetEquipmentItem";

type Props = {
  title: string;
  price: number;
  equipmentList: EquipmentListItemType[];
  selectedEquipmentList: EquipmentListItemType[];
  isAllSelected: boolean;
  toggleSelectAll: () => void;
  toggleEquipmentItem: (item: EquipmentListItemType) => void;
};

export const SetEquipmentAccordion = ({
  title,
  price,
  equipmentList = [],
  isAllSelected = false,
  selectedEquipmentList,
  toggleSelectAll,
  toggleEquipmentItem,
}: Props) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <div
          className={styles.titleWrapper}
          onClick={(e) => {
            e.stopPropagation();
            toggleSelectAll();
          }}
        >
          <div>{isAllSelected ? <CheckBox /> : <CheckBoxOutlineBlank />}</div>
          <div>{title}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={styles.equipmentListWrapper}>
          {equipmentList.map((item) => (
            <SetEquipmentItem
              key={item.id}
              item={item}
              toggleItem={() => toggleEquipmentItem(item)}
              isSelected={selectedEquipmentList.some(
                (selectedItem) => selectedItem.id === item.id
              )}
            />
          ))}
        </div>
        <Margin top={16} />
        <div className={styles.accordionFooter}>
          <div className={styles.price}>{formatLocaleString(price)}원</div>
          <Button variant="outlined" size="Small">
            상세보기
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
