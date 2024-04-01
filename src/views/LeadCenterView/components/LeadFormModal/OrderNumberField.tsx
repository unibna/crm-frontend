import { BaseTextFieldProps, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { useRef } from "react";
import { isEnterPress } from "utils/keyBoardUtil";
import { toSimplest } from "utils/stringsUtil";

interface Props extends BaseTextFieldProps {
  label?: string;
  onChange: (value: string) => void;
  value: string;
}

const OrderNumberField = ({ value, label, onChange, ...props }: Props) => {
  const inputRef = useRef(null) as any;

  const handleEnterPress = (e: any) => {
    if (isEnterPress(e)) {
      onChange("#" + toSimplest(e.target.value));
      setTimeout(() => {
        props?.onBlur && props.onBlur(e);
      }, 0);
    }
  };

  return (
    <TextField
      autoFocus
      ref={inputRef}
      value={value?.charAt(0) === "#" ? value.slice(1) : value}
      fullWidth
      name="order_information"
      variant="outlined"
      label={label}
      onKeyPress={handleEnterPress}
      onChange={(e) =>
        // chuyển string thành array => filter # => chuyển array thành string
        onChange("#" + toSimplest(e.target.value))
      }
      InputProps={{
        startAdornment: <InputAdornment position="start">#</InputAdornment>,
      }}
      {...props}
    />
  );
};

export default OrderNumberField;
