//material
import Box from "@mui/material/Box";
import TextField, { BaseTextFieldProps, TextFieldProps } from "@mui/material/TextField";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import AlarmIcon from "@mui/icons-material/AddAlarm";
import HighlightOff from "@mui/icons-material/HighlightOff";
import { useEffect, useState } from "react";
import vi from "locales/vi.json";
import { SxProps, Theme } from "@mui/material";
import { DateTimePickerProps } from "@mui/lab";
import add from "date-fns/add";
import { HH_mm_ss_dd_MM_yyyy } from "constants/time";

interface Props {
  onChange: (date?: Date | string | null) => void;
  value?: Date | string | null;
  label?: string;
  sx?: SxProps<Theme>;
  inputProps?: BaseTextFieldProps;
  dateProps?: Omit<
    DateTimePickerProps<string | Date>,
    "onChange" | "renderInput" | "value" | "onError" | "inputRef"
  >;
}

export const MDateTimeMobilePicker = ({ onChange, value, label, sx, ...props }: Props) => {
  const [time, setTime] = useState(value);

  useEffect(() => {
    setTime(value);
  }, [value]);

  return (
    <Box className="relative" sx={{ ...sx }}>
      <MobileDateTimePicker
        value={time}
        onChange={() => {}}
        onAccept={(value) => {
          setTime(value);
          onChange(value);
        }}
        label={label}
        // onError={console.log}
        inputFormat={HH_mm_ss_dd_MM_yyyy}
        ampm={false}
        disabled={props.dateProps?.disabled}
        mask="___/__/__ __:__ _M"
        renderInput={(params) => <TextField {...params} fullWidth {...props.inputProps} />}
        cancelText="Huỷ"
        okText="Chọn"
        {...props.dateProps}
      />
      <div style={{ position: "absolute", right: 6, top: "50%", display: "flex" }}>
        <InputAdornment position="end">
          <IconButton
            style={{ padding: 0 }}
            onClick={() => {
              setTime(null);
              onChange(null);
            }}
            disabled={props.dateProps?.disabled}
          >
            <HighlightOff color={props.inputProps?.error ? "error" : "inherit"} />
          </IconButton>
        </InputAdornment>
        <InputAdornment position="end">
          <Tooltip title={vi.add_15_minutes} aria-label="add" placement="top" arrow>
            <Box>
              <IconButton
                style={{ padding: 0 }}
                onClick={() => {
                  const date: any = value
                    ? add(new Date(value.toString()), { minutes: 15 })
                    : add(new Date(), { minutes: 15 });
                  setTime(date);
                  onChange(date);
                }}
                disabled={props.dateProps?.disabled}
              >
                <AlarmIcon
                  style={{ fontSize: 30 }}
                  color={props.inputProps?.error ? "error" : "inherit"}
                />
              </IconButton>
            </Box>
          </Tooltip>
        </InputAdornment>
      </div>
    </Box>
  );
};
