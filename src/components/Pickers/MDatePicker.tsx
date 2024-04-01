import { DatePicker, DatePickerProps } from "@mui/lab";
import TextField from "@mui/material/TextField";
import { dd_MM_yyyy } from "constants/time";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";
import { memo, useEffect, useState } from "react";

interface Props extends Omit<DatePickerProps<string | Date>, "onChange" | "renderInput" | "value"> {
  value?: string | null | Date;
  onChangeDate: (newValue: any) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: "small" | "medium";
}
const MDatePicker = ({
  value = null,
  size = "small",
  onChangeDate,
  inputFormat = dd_MM_yyyy,
  ...dateProps
}: Props) => {
  const [date, setDate] = useState<string | null | Date>(value);

  useEffect(() => {
    value !== date && setDate(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <DatePicker
      value={date}
      onChange={setDate}
      // onAccept={onChangeDate}
      inputFormat={inputFormat}
      renderInput={(params) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useDidUpdateEffect(() => {
          if (!params.error && date !== value) {
            date !== value && onChangeDate(date);
          }
        }, [date]);
        return (
          <TextField
            {...params}
            fullWidth={dateProps.fullWidth}
            size={size}
            error={dateProps.error}
            helperText={dateProps.helperText}
          />
        );
      }}
      {...dateProps}
    />
  );
};

export default memo(MDatePicker);
