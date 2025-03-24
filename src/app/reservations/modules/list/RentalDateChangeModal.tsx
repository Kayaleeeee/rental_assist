import { Margin } from "@/app/components/Margin";
import { Modal } from "@components/Modal";
import { useCallback, useState } from "react";

import { Label } from "@/app/components/Form/Label";
import { DateTimeSelector } from "@/app/components/DateTimeSelector";
import dayjs from "dayjs";
import { updateQuote } from "@/app/api/quote";
import { ReservationDetailResponse } from "@/app/types/reservationType";
import { showToast } from "@/app/utils/toastUtils";
import { CustomCheckbox } from "@/app/components/Checkbox/Checkbox";
import { ModalBasicProps } from "@/app/components/Modal/useModal";

export interface RentalDateChangeModalProps extends ModalBasicProps {
  dateRange: { startDate: string; endDate: string };
  onChangeDate: (date: { startDate: string; endDate: string }) => void;
  quoteId: ReservationDetailResponse["quoteId"];
}

export const RentalDateChangeModal = ({
  dateRange,
  onChangeDate,
  quoteId,
  onCloseModal,
}: RentalDateChangeModalProps) => {
  const [endAtCurrentTime, setEndAtCurrentTime] = useState<boolean>(false);

  const [changedDateRange, setChangedDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>(dateRange);

  const onConfirmChange = useCallback(async () => {
    if (dayjs(changedDateRange.endDate).isBefore(changedDateRange.startDate)) {
      showToast({
        message: "반납일자는 대여시작 이후여야 합니다.",
        type: "error",
      });
      return;
    }
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

  const handleCheckEndAtCurrentTime = useCallback(() => {
    const now = dayjs().toISOString();

    if (endAtCurrentTime) {
      setChangedDateRange((prev) => ({
        ...prev,
        endDate: dateRange.endDate,
      }));
      setEndAtCurrentTime(false);
    } else {
      setChangedDateRange((prev) => ({
        ...prev,
        endDate: now,
      }));
      setEndAtCurrentTime(true);
    }
  }, [endAtCurrentTime, dateRange]);

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
      <div
        style={{
          width: "350px",
        }}
      >
        <h4>대여 일자 변경</h4>
        <Margin top={24} />
        <Label title="대여 시작일" />
        <DateTimeSelector
          value={changedDateRange.startDate}
          onChange={(value) => {
            if (!value) return;
            setChangedDateRange((prev) => ({ ...prev, startDate: value }));
          }}
        />
        <Margin bottom={20} />

        <Label title="반납일" />
        <DateTimeSelector
          disabled={!changedDateRange.startDate || endAtCurrentTime}
          minDateTime={dayjs(changedDateRange.startDate)}
          value={changedDateRange.endDate}
          onChange={(value) => {
            if (!value) return;

            setChangedDateRange((prev) => ({ ...prev, endDate: value }));
          }}
        />
        <Margin bottom={10} />

        <div
          style={{
            flex: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={handleCheckEndAtCurrentTime}
        >
          <CustomCheckbox checked={endAtCurrentTime} />
          현재 시간으로 반납 설정
        </div>
        <Margin bottom={30} />
      </div>
    </Modal>
  );
};
