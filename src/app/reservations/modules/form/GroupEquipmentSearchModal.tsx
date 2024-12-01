import { Margin } from "@/app/components/Margin";
import { Modal } from "@/app/components/Modal";
import { SetEquipmentList } from "@/app/equipments/sets/modules/SetEquipmentList";
import { SetEquipmentType } from "@/app/types/equipmentType";
import { useState } from "react";

type Props = {
  onCloseModal: () => void;
  onConfirm: (list: SetEquipmentType[]) => void;
  disabledIdList: number[];
};

export const GroupEquipmentSearchModal = ({
  onCloseModal,
  onConfirm,
}: // disabledIdList,
Props) => {
  const [selectedGroupList, setSelectedGroupList] = useState<
    SetEquipmentType[]
  >([]);

  // useEffect(() => {
  //   fetchList(searchParams);
  // }, [searchParams]);

  // const toggleEquipmentList = useCallback(
  //   (itemList: EquipmentListItemType[]) => {
  //     if (itemList.some((item) => disabledIdList.includes(item.id))) {
  //       showToast({
  //         message: "이미 추가된 장비는 중복으로 추가할 수 없습니다.",
  //         type: "error",
  //       });
  //       return;
  //     }

  //     setSelectedGroupList(itemList);
  //   },
  //   [disabledIdList]
  // );

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
        }}
      >
        <SetEquipmentList
          selectedEquipmentSetList={selectedGroupList}
          setSelectedEquipmentSetList={setSelectedGroupList}
        />

        <Margin bottom={50} />
      </div>
    </Modal>
  );
};
