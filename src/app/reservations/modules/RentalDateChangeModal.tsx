import { Margin } from "@/app/components/Margin";
import { Modal } from "@components/Modal";
import { useCallback, useState } from "react";

import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";
import dayjs from "dayjs";
import { updateQuote } from "@/app/api/quote";
import { ReservationDetailType } from "@/app/types/reservationType";
import { showToast } from "@/app/utils/toastUtils";

type Props = {
  dateRange: { startDate: string; endDate: string };
  onCloseModal: () => void;
  onChangeDate: (date: { startDate: string; endDate: string }) => void;
  quoteId: ReservationDetailType["quoteId"];
};

export const RentalDateChangeModal = ({
  onCloseModal,
  dateRange,
  onChangeDate,
  quoteId,
}: Props) => {
  const [changedDateRange, setChangedDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>(dateRange);

  const onConfirmChange = useCallback(async () => {
    if (!confirm("대여 일자를 변경하시겠어요?")) return;

    try {
      const result = await updateQuote(quoteId, changedDateRange);
      onChangeDate({ startDate: result.startDate, endDate: result.endDate });
      showToast({ message: "대여일자를 변경했습니다.", type: "success" });
      onCloseModal();
    } catch {
      showToast({
        message: "대여일자 변경에 실패했습니다.",
        type: "error",
      });
    }
    onChangeDate(changedDateRange);
  }, [changedDateRange]);

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
      <h4>대여 일자 변경</h4>
      <Margin top={24} />
      <Label title="대여 시작일" />
      <DateTimeSelector
        value={dateRange.startDate}
        onChange={(value) => {
          if (!value) return;
          setChangedDateRange((prev) => ({ ...prev, startDate: value }));
        }}
      />
      <Margin bottom={10} />

      <Label title="반납일" />
      <DateTimeSelector
        disabled={!dateRange.startDate}
        minDateTime={dayjs(dateRange.startDate)}
        value={dateRange.endDate}
        onChange={(value) => {
          if (!value) return;

          setChangedDateRange((prev) => ({ ...prev, endDate: value }));
        }}
      />
      <Margin bottom={30} />
    </Modal>
  );
};
