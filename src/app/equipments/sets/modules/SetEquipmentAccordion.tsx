import {
  EquipmentListItemType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./setEquipmentAccordion.module.scss";
import { formatLocaleString } from "@/app/utils/priceUtils";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";
import { GroupEquipmentListTable } from "./GroupEquipmentListTable";

type Props = {
  title: string;
  price: number;
  disabledGroup?: boolean;
  disabledEquipmentIdList?: number[];
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
  disabledGroup = false,
  disabledEquipmentIdList = [],
}: Props) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
        <div
          className={styles.titleWrapper}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CustomCheckbox
            onChange={toggleSelectAll}
            disabled={disabledGroup}
            checked={isAllSelected}
          />
          <div>{title}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <GroupEquipmentListTable
          isAllSelected={isAllSelected}
          equipmentList={equipmentList}
          disabledEquipmentIdList={disabledEquipmentIdList}
          selectedEquipmentList={selectedEquipmentList}
          toggleEquipmentItem={toggleEquipmentItem}
        />
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
