import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { SetEquipmentWithAvailabilityType } from "@/app/types/equipmentType";
import { useState } from "react";
import { GroupEquipmentListWithAvailability } from "./GroupEquipmentWithAvailabilityList";
import { ModalBasicProps } from "@/app/components/Modal/useModal";

export interface AvailableGroupEquipmentModalProps extends ModalBasicProps {
  onConfirm: (list: SetEquipmentWithAvailabilityType[]) => void;
  disabledGroupIdList: SetEquipmentWithAvailabilityType["id"][];
  disabledEquipmentIdList: SetEquipmentWithAvailabilityType["equipmentList"][0]["id"][];
  dateRange: { startDate: string; endDate: string };
  excludeReservationId?: number;
}

export const AvailableGroupEquipmentModal = ({
  onCloseModal,
  onConfirm,
  disabledGroupIdList,
  dateRange,
  excludeReservationId,
  disabledEquipmentIdList,
}: AvailableGroupEquipmentModalProps) => {
  const [selectedGroupList, setSelectedGroupList] = useState<
    SetEquipmentWithAvailabilityType[]
  >([]);

  return (
    <Modal
      onCloseModal={onCloseModal}
      ButtonListWrapperStyle={{
        width: "400px",
        placeSelf: "flex-end",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onCloseModal,
        },
        {
          title: "추가하기",
          onClick: () => {
            onConfirm(selectedGroupList);
            onCloseModal();
          },
        },
      ]}
    >
      <div
        style={{
          width: "80vw",
          maxWidth: "900px",
          maxHeight: "80vh",
          overflow: "scroll",
        }}
      >
        <GroupEquipmentListWithAvailability
          selectedEquipmentSetList={selectedGroupList}
          setSelectedEquipmentSetList={setSelectedGroupList}
          disabledGroupIdList={disabledGroupIdList}
          disabledEquipmentIdList={disabledEquipmentIdList}
          dateRange={dateRange}
          excludeReservationId={excludeReservationId}
        />
        <Margin bottom={50} />
      </div>
    </Modal>
  );
};
