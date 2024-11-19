import { Margin } from "@/app/components/Margin";
import { PaymentMethod, PaymentStatus } from "@/app/types/reservationType";
import { Modal } from "@components/Modal";
import { MenuItem, Select } from "@mui/material";
import { useCallback, useState } from "react";
import { getPaymentStatusText } from "./PaymentStatusText";
import { Label } from "@/app/components/Form/Label";

const statusMenu = [
  {
    key: PaymentStatus.unpaid,
    title: getPaymentStatusText(PaymentStatus.unpaid),
  },
  { key: PaymentStatus.paid, title: getPaymentStatusText(PaymentStatus.paid) },
  {
    key: PaymentStatus.refunded,
    title: getPaymentStatusText(PaymentStatus.refunded),
  },
];

const paymentOptionMenu = [
  {
    key: PaymentMethod.card,
    title: "카드",
  },
  { key: PaymentMethod.cash, title: "현금" },
  {
    key: PaymentMethod.bank_transfer,
    title: "계좌이체",
  },
];

type Props = {
  currentStatus: PaymentStatus;
  onCloseModal: () => void;
  onChangeStatus: (status: PaymentStatus) => void;
};

export const PaymentStatusChangeModal = ({
  onCloseModal,
  currentStatus,
  onChangeStatus,
}: Props) => {
  const [selectedStatus, setSelectedStatus] =
    useState<PaymentStatus>(currentStatus);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.card
  );

  const onConfirmChange = useCallback(async () => {
    if (!confirm("결제 상태를 변경하시겠어요?")) return;

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
      <h4>결제 상태 변경</h4>
      <Margin top={16} bottom={24}>
        <Select
          fullWidth
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus)}
        >
          {statusMenu.map((item) => {
            return (
              <MenuItem key={item.key} value={item.key}>
                {item.title}
              </MenuItem>
            );
          })}
        </Select>
        {selectedStatus === PaymentStatus.paid && (
          <Margin top={16}>
            <Label title="결제 방식" />
            <Select
              fullWidth
              value={selectedMethod}
              onChange={(e) =>
                setSelectedMethod(e.target.value as PaymentMethod)
              }
            >
              {paymentOptionMenu.map((item) => {
                return (
                  <MenuItem key={item.key} value={item.key}>
                    {item.title}
                  </MenuItem>
                );
              })}
            </Select>
          </Margin>
        )}
      </Margin>
    </Modal>
  );
};
