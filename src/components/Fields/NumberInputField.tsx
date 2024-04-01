import { TextFieldProps } from "@mui/material";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Iconify from "components/Icons/Iconify";

import { fNumber } from "utils/formatNumber";

type InputNumberProps = {
  name?: string;
  value?: number;
  minQuantity?: number;
  maxQuantity?: number;
  textFieldQuantityProps?: TextFieldProps;
  onChange: (value: number) => void;
  type?: "amount" | "currency" | "percent";
  positionAdorment?: "start" | "end";
  unit?: string;
  label?: string;
  containerStyles?: any;
  inputStyle?: React.CSSProperties;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
};

export function InputNumber({
  value = 0,
  minQuantity = 0,
  maxQuantity,
  onChange,
  textFieldQuantityProps,
  type = "amount",
  positionAdorment = "end",
  unit,
  label,
  containerStyles,
  inputStyle = {},
  disabled,
  error,
  helperText,
}: InputNumberProps) {
  const isType = (typeInput: "amount" | "currency" | "percent") => {
    return type === typeInput;
  };

  const textAdorment = (typeInput: "amount" | "currency" | "percent", unit?: string) => {
    if (unit) return unit;
    switch (typeInput) {
      case "percent":
        return "%";
      case "currency":
        return "đ";
      default:
        return "";
    }
  };

  return (
    <Box
      sx={{
        ...(isType("amount") && {
          py: 0.5,
          px: 0.75,
          border: 1,
          lineHeight: 0,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          borderColor: "grey.50032",
          pointerEvents: disabled ? "none" : "auto",
        }),
        ...containerStyles,
      }}
    >
      {isType("amount") && (
        <IconButton
          size="small"
          color="inherit"
          disabled={value <= minQuantity}
          onClick={() => onChange(value - 1)}
        >
          <Iconify icon={"eva:minus-fill"} width={14} height={14} />
        </IconButton>
      )}
      <TextField
        error={error}
        helperText={helperText}
        disabled={disabled}
        label={(!isType("amount") && label) || undefined}
        sx={{
          ...(isType("amount")
            ? {
                input: {
                  textAlign: "center",
                  border: "none",
                  padding: 0,
                  fontSize: "0.8125rem",
                  ...inputStyle,
                },
                fieldset: {
                  display: "none",
                },
              }
            : {
                input: {
                  padding: "9px 16px",
                  fontSize: "0.8125rem",
                  ...inputStyle,
                },
              }),
          width: "100%",
        }}
        value={isType("currency") ? fNumber(value) : Number(value).toString()}
        onChange={(e) => {
          const value = e.target.value || "0";
          onChange(parseInt(isType("currency") ? value.replace(/[^0-9.-]+/g, "") : value));
        }}
        onBlur={() => {
          if (minQuantity && value < minQuantity) {
            onChange(minQuantity);
          }
          if (maxQuantity && value > minQuantity) {
            onChange(maxQuantity);
          }
        }}
        InputProps={{
          ...(!isType("amount") && {
            startAdornment:
              (positionAdorment === "start" && (
                <InputAdornment position={positionAdorment}>
                  {textAdorment(type, unit)}
                </InputAdornment>
              )) ||
              null,
            endAdornment:
              (positionAdorment === "end" && (
                <InputAdornment position={positionAdorment}>
                  {textAdorment(type, unit)}
                </InputAdornment>
              )) ||
              null,
          }),
        }}
        {...textFieldQuantityProps}
      />
      {isType("amount") && (
        <IconButton
          size="small"
          color="inherit"
          disabled={!!(maxQuantity && value >= maxQuantity)}
          onClick={() => onChange(value + 1)}
        >
          <Iconify icon={"eva:plus-fill"} width={14} height={14} />
        </IconButton>
      )}
    </Box>
  );
}
