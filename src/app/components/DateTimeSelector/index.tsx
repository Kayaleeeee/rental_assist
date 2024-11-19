"use client";

import {
  DateTimePicker,
  DateTimePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

type Props = {
  label?: string;
  value?: string | null;
  onChange?: (date: string | null) => void;
  disabled?: boolean;
  minDateTime?: Dayjs;
  maxDateTime?: Dayjs;
};

export const DateTimeSelector = ({
  label,
  onChange,
  value,
  disabled = false,
  maxDateTime,
  minDateTime,
}: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : undefined}
        disabled={disabled}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
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
