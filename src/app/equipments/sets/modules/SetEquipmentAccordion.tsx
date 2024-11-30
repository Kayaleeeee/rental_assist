import {
  EquipmentListItemType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./setEquipmentAccordion.module.scss";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import { GroupEquipmentItem } from "./GroupEquipmentItem";
import Link from "next/link";

type Props = {
  title: string;
  price: number;
  setId: SetEquipmentType["id"];
  equipmentList: EquipmentListItemType[];
  selectedEquipmentList: EquipmentListItemType[];
  isAllSelected: boolean;
  toggleSelectAll: () => void;
  toggleEquipmentItem: (item: EquipmentListItemType) => void;
  hideDetailButton?: boolean;
};

export const SetEquipmentAccordion = ({
  title,
  price,
  hideDetailButton = false,
  equipmentList = [],
  isAllSelected = false,
  selectedEquipmentList,
  toggleSelectAll,
  toggleEquipmentItem,
  setId,
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
            <GroupEquipmentItem
              key={item.id}
              item={item}
              isSelectable
              toggleItem={() => toggleEquipmentItem?.(item)}
              isSelected={selectedEquipmentList.some(
                (selectedItem) => selectedItem.id === item.id
              )}
            />
          ))}
        </div>
        <Margin top={16} />
        <div className={styles.accordionFooter}>
          <div className={styles.price}>{formatLocaleString(price)}원</div>
          {!hideDetailButton && (
            <Link href={`/equipments/sets/${setId}`}>
              <Button variant="outlined" size="Small">
                상세보기
              </Button>
            </Link>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
