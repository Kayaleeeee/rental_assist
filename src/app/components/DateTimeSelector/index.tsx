"use client";

import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

type Props = {
  label?: string;
  value?: string | null;
  onChange?: (date: string | null) => void;
  disabled?: boolean;
};

export const DateTimeSelector = ({
  label,
  onChange,
  value,
  disabled = false,
}: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : undefined}
        disabled={disabled}
        onChange={(value) => {
          const dateTime = value?.toISOString() || null;

          onChange?.(dateTime);
        }}
        sx={{
          width: "100%",
        }}
      />
    </LocalizationProvider>
  );
};
