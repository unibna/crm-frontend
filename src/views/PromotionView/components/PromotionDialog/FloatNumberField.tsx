import { SxProps, TextFieldProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

interface Props extends Omit<TextFieldProps, "onBlur" | "onChange"> {
  value?: number;
  onChange: (e: any) => void;
  size?: "small" | "medium";
  autoFocus?: boolean;
  styles?: SxProps<Theme>;
}
const FloatNumberField = ({
  value,
  onChange,
  placeholder,
  label,
  variant,
  size = "small",
  autoFocus,
  styles,
  ...props
}: Props) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput((prev) => value);
  }, [value]);

  return (
    <TextField
      {...props}
      value={value}
      type="number"
      fullWidth
      disabled={props.disabled}
      autoFocus={autoFocus}
      variant={variant}
      label={label}
      placeholder={placeholder}
      error={props.error}
      helperText={props.helperText}
      size={size}
      onChange={onChange}
      sx={{ ".MuiOutlinedInput-root": { pr: 0.5 }, ...styles }}
      InputProps={{
        ...props.InputProps,
        autoComplete: "off",
        inputProps: {
          ...props.InputProps?.inputProps,
        },
      }}
    />
  );
};

export default FloatNumberField;
