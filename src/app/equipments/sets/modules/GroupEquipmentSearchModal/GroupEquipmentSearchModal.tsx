import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { ModalBasicProps } from "@/app/components/Modal/useModal";
import { GroupEquipmentList } from "@/app/equipments/sets/modules/GroupEquipmentList";
import { SetEquipmentType } from "@/app/types/equipmentType";
import { useState } from "react";

export interface GroupEquipmentSearchModalProps extends ModalBasicProps {
  onConfirm: (list: SetEquipmentType[]) => void;
  disabledIdList: SetEquipmentType["id"][];
}

export const GroupEquipmentSearchModal = ({
  onCloseModal,
  onConfirm,
  disabledIdList,
}: GroupEquipmentSearchModalProps) => {
  const [selectedGroupList, setSelectedGroupList] = useState<
    SetEquipmentType[]
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
        <GroupEquipmentList
          selectedEquipmentSetList={selectedGroupList}
          setSelectedEquipmentSetList={setSelectedGroupList}
          disabledSetIdList={disabledIdList}
        />
        <Margin bottom={50} />
      </div>
    </Modal>
  );
};
