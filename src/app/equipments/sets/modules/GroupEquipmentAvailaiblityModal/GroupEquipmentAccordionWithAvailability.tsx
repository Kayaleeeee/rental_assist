import {
  EquipmentWithAvailabilityType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./groupEquipmentAccordion.module.scss";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";
import { EquipmentStatusBadge } from "../../../modules/EquipmentStatusBadge";
import { GroupEquipmentWithAvailabilityTable } from "./GroupEquipmentWithAvailabilityTable";

type Props = {
  title: string;
  price: number;
  disabledGroup?: boolean;
  disabledEquipmentIdList?: number[];
  setId: SetEquipmentType["id"];
  equipmentList: EquipmentWithAvailabilityType[];
  selectedEquipmentList: EquipmentWithAvailabilityType[];
  isAllSelected: boolean;
  toggleSelectAll: () => void;
  toggleEquipmentItem: (item: EquipmentWithAvailabilityType) => void;
  hideDetailButton?: boolean;
  isDisabled?: boolean;
};

export const GroupEquipmentAccordionWithAvailability = ({
  title,
  hideDetailButton = false,
  equipmentList = [],
  isAllSelected = false,
  selectedEquipmentList,
  toggleSelectAll,
  toggleEquipmentItem,
  setId,
  disabledGroup = false,
  disabledEquipmentIdList = [],
  isDisabled = false,
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
          <div
            style={{
              flex: 1,
            }}
          >
            {title}
          </div>
          <Margin left={8} right={10}>
            <EquipmentStatusBadge isDisabled={isDisabled} />
          </Margin>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <GroupEquipmentWithAvailabilityTable
          isAllSelected={isAllSelected}
          equipmentList={equipmentList}
          disabledEquipmentIdList={disabledEquipmentIdList}
          selectedEquipmentList={selectedEquipmentList}
          toggleEquipmentItem={toggleEquipmentItem}
        />
        <Margin top={16} />
        <div className={styles.accordionFooter}>
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
