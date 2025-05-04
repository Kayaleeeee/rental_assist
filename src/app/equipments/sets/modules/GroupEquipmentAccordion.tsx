import {
  EquipmentListItemType,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "./groupEquipmentAccordion.module.scss";
import { Margin } from "@/app/components/Margin";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";
import { GroupEquipmentListTable } from "./GroupEquipmentListTable";
import { EquipmentStatusBadge } from "../../modules/EquipmentStatusBadge";
import { useCallback, useMemo } from "react";
import { useGroupEquipmentStore } from "../store/useGroupEquipmentStore";
import { isEqual } from "lodash";

type Props = {
  groupEquipment: SetEquipmentType;
  disabledGroup?: boolean;
  disabledEquipmentIdList?: number[];
  hideDetailButton?: boolean;
};

export const GroupEquipmentAccordion = ({
  groupEquipment,
  hideDetailButton = false,
  disabledGroup = false,
  disabledEquipmentIdList = [],
}: Props) => {
  const toggleGroupEquipment = useGroupEquipmentStore(
    (state) => state.toggleGroupEquipment
  );
  const toggleEquipmentItemOfGroup = useGroupEquipmentStore(
    (state) => state.toggleEquipmentItemOfGroup
  );

  const storedGroupEquipment = useGroupEquipmentStore((state) =>
    state.selectedGroupEquipmentMap.get(groupEquipment.id)
  );

  const isAllSelected = useMemo(() => {
    return (
      !!storedGroupEquipment &&
      isEqual(storedGroupEquipment?.equipmentList, groupEquipment.equipmentList)
    );
  }, [storedGroupEquipment, groupEquipment.id]);

  const toggleEquipmentItem = useCallback(
    (equipment: EquipmentListItemType) =>
      toggleEquipmentItemOfGroup(groupEquipment, equipment),
    [toggleEquipmentItemOfGroup, groupEquipment]
  );

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
            onChange={() => toggleGroupEquipment(groupEquipment)}
            disabled={disabledGroup}
            checked={isAllSelected}
          />
          <div
            style={{
              flex: 1,
            }}
          >
            {groupEquipment.title}
          </div>
          <Margin left={8} right={10}>
            <EquipmentStatusBadge
              isDisabled={groupEquipment.disabled || false}
            />
          </Margin>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <GroupEquipmentListTable
          isAllSelected={isAllSelected}
          equipmentList={groupEquipment.equipmentList}
          disabledEquipmentIdList={disabledEquipmentIdList}
          selectedEquipmentList={storedGroupEquipment?.equipmentList || []}
          toggleEquipmentItem={toggleEquipmentItem}
        />
        <Margin top={16} />
        <div className={styles.accordionFooter}>
          {!hideDetailButton && (
            <Link href={`/equipments/sets/${groupEquipment.id}`}>
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
