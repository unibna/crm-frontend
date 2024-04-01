import { useEffect, useState } from "react";

import { fValueVnd } from "utils/formatNumber";
import { fDateTime } from "utils/dateUtil";
import { toSimplest } from "utils/stringsUtil";
import vi from "locales/vi.json";

import { MDateTimeMobilePicker } from "components/Pickers";
import { MTextLine } from "components/Labels";

import { alpha, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import Edit from "@mui/icons-material/Edit";
import format from "date-fns/format";

export interface PaymentEditType {
  receive_time: string;
  actual_amount: number;
  note: string;
  amount: number;
}

export function PaymentEditColumn({
  disabled,
  defaultValue,
  handleUpdatePayment,
}: {
  disabled?: boolean;
  defaultValue?: PaymentEditType;
  handleUpdatePayment: (
    payment: Partial<PaymentEditType>,
    onUpdateSuccess?: () => void,
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
}) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState<Partial<PaymentEditType> | undefined>({
    receive_time: "",
    actual_amount: 0,
    note: "",
  });

  const { receive_time, actual_amount = 0, note } = data || {};

  const onChange = (key: keyof PaymentEditType, value: PaymentEditType[keyof PaymentEditType]) => {
    setData((prev = {}) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    setData(defaultValue);
  }, [defaultValue]);

  if (!isEdit)
    return (
      <Stack direction="row" spacing={2} display="flex" alignItems="center">
        <Stack direction="column" spacing={2}>
          <MTextLine
            label="Thời gian thực nhận:"
            value={receive_time ? fDateTime(receive_time) : "---"}
          />
          <MTextLine
            label="Số tiền thực nhận:"
            value={actual_amount ? `${fValueVnd(actual_amount)}` : "---"}
            valueStyle={{ ...(defaultValue?.amount !== actual_amount && { color: "error.main" }) }}
          />
          <MTextLine label="Ghi chú:" value={note || "---"} />
        </Stack>
        {!disabled && (
          <IconButton
            sx={{
              width: 32,
              height: 32,
              mr: "auto",
              color: "primary.main",
              backgroundColor: alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity
              ),
            }}
            onClick={() => setIsEdit(!isEdit)}
          >
            <Edit />
          </IconButton>
        )}
      </Stack>
    );

  return (
    <Stack direction="column" spacing={2}>
      <MDateTimeMobilePicker
        onChange={(date: Date) => {
          onChange("receive_time", format(date, "yyyy-MM-dd HH:mm:ss"));
        }}
        label="Thời gian thực nhận"
        value={receive_time ? new Date(receive_time) : null}
        dateProps={{ disabled: disabled }}
      />
      <TextField
        fullWidth
        sx={{ input: { ...(defaultValue?.amount !== actual_amount && { color: "error.main" }) } }}
        placeholder={vi.actual_amount}
        label={vi.actual_amount}
        disabled={disabled}
        value={fValueVnd(actual_amount, true)}
        onChange={(e) => onChange("actual_amount", toSimplest(e.target.value))}
      />
      <TextField
        fullWidth
        multiline
        minRows={2}
        placeholder={vi.note}
        disabled={disabled}
        label={vi.note}
        value={note}
        onChange={(e) => onChange("note", e.target.value)}
      />
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <Stack direction="row" spacing={1} display="flex" justifyContent={"flex-end"}>
          <IconButton
            sx={{ color: "success.main" }}
            onClick={() => {
              handleUpdatePayment(data || {}, () => setIsEdit(false), setLoading);
              setIsEdit(!isEdit);
            }}
            disabled={disabled}
          >
            <DoneIcon />
          </IconButton>

          <IconButton
            disabled={disabled}
            sx={{ color: "error.main" }}
            onClick={() => {
              setIsEdit(!isEdit);
              setData(defaultValue);
            }}
          >
            <ClearIcon />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}
