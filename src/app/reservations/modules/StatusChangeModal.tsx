import { Margin } from "@/app/components/Margin";
import { ReservationStatus } from "@/app/types/reservationType";
import { Modal } from "@components/Modal";
import { MenuItem, Select } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { ReservationStatusText } from "./ReservationStatusText";
import { updateReservation } from "@/app/api/reservation";
import { showToast } from "@/app/utils/toastUtils";

const statusMenu = [
  { key: ReservationStatus.pending, title: "대기" },
  { key: ReservationStatus.confirmed, title: "예약 확정" },
  { key: ReservationStatus.canceled, title: "예약 취소" },
];

type Props = {
  currentStatus: ReservationStatus;
  onCloseModal: () => void;
  onChangeStatus: (status: ReservationStatus) => void;
};

export const ReservationStatusChangeModal = ({
  onCloseModal,
  currentStatus,
  onChangeStatus,
}: Props) => {
  const [selectedStatus, setSelectedStatus] =
    useState<ReservationStatus>(currentStatus);

  const onConfirmChange = useCallback(async () => {
    if (!confirm("예약 상태를 변경하시겠어요?")) return;

    onChangeStatus(selectedStatus);
  }, [selectedStatus]);

  return (
    <Modal
      onCloseModal={onCloseModal}
      ButtonListWrapperStyle={{
        width: "200px",
        placeSelf: "flex-end",
      }}
      ButtonProps={[
        {
          title: "닫기",
          onClick: onCloseModal,
        },
        {
          title: "변경하기",
          onClick: onConfirmChange,
        },
      ]}
    >
      <h4>예약 상태 변경</h4>
      <Margin top={16} bottom={24}>
        <Select
          fullWidth
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value as ReservationStatus)
          }
        >
          {statusMenu.map((item) => {
            return (
              <MenuItem key={item.key} value={item.key}>
                {item.title}
              </MenuItem>
            );
          })}
        </Select>
      </Margin>
    </Modal>
  );
};
