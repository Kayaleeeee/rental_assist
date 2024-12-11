"use client";

import {
  DateOrTimeView,
  DateTimePicker,
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
  size?: "small" | "medium";
  views?: DateOrTimeView[];
};

export const DateTimeSelector = ({
  label,
  onChange,
  value,
  disabled = false,
  maxDateTime,
  minDateTime,
  size = "medium",
  views,
}: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value ? dayjs(value) : undefined}
        disabled={disabled}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        views={views}
        onChange={(value) => {
          const dateTime = value?.toISOString() || null;

          onChange?.(dateTime);
        }}
        sx={{
          width: "100%",
        }}
        slotProps={{
          textField: {
            size,
          },
        }}
      />
    </LocalizationProvider>
  );
};
