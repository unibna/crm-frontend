import { SxProps, TextFieldProps, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { fNumber } from "utils/formatNumber";
import { isEnterPress } from "utils/keyBoardUtil";
import { toSimplest } from "utils/stringsUtil";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

// Material
import { SortingDirection } from "@devexpress/dx-react-grid";
import { styled, useTheme } from "@mui/material/styles";

interface ArrowProps {
  direction?: SortingDirection;
  handleClickUp: () => void;
  handleClickDown: () => void;
}

function ArrowVerticalIcon(props: ArrowProps) {
  const { direction, handleClickUp, handleClickDown } = props;
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.main;

  return (
    <Stack
      direction="column"
      sx={{
        "svg:hover": { cursor: "pointer", backgroundColor: theme.palette.action.hover },
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="6 0 12 12"
        fill="none"
        style={{ width: "24px", height: 16 }}
        onClick={handleClickUp}
      >
        <Path
          d="M9.5 9.745v-1.65l3.25-3.5 3.25 3.5v1.65H9.5z"
          fill={direction === "asc" ? PRIMARY_MAIN : theme.palette.text.primary}
        ></Path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="6 9 12 12"
        fill="none"
        style={{ width: "24px", height: 16 }}
        onClick={handleClickDown}
      >
        <Path
          d="M16 12.85v1.65L12.75 18 9.5 14.5v-1.65H16z"
          fill={direction === "desc" ? PRIMARY_MAIN : theme.palette.text.primary}
        ></Path>
      </svg>
    </Stack>
  );
}

const Path = styled(`path`)(({ theme }: { theme: Theme }) => ({
  cursor: "pointer",
  "&:hover": {
    fill: theme.palette.primary.main,
  },
}));

interface Props extends Omit<TextFieldProps, "onBlur" | "onChange"> {
  value?: string | number;
  onChange: (value: number | string) => void;
  onBlur?: (value: number | string) => void;
  size?: "small" | "medium";
  autoFocus?: boolean;
  min?: number;
  unit?: 1 | 10 | 100 | 1000 | 10000 | 100000;
  styles?: SxProps<Theme>;
  type?: "float" | "int";
}
export const CommasField = ({
  value,
  onChange,
  placeholder,
  label,
  variant,
  onBlur,
  size = "small",
  type = "int",
  autoFocus,
  min = 0,
  unit = 1,
  styles,
  ...props
}: Props) => {
  const [input, setInput] = useState(value);

  const formatSimpleValue = (e: any) => {
    if (e.target.value || e.target.value === 0) {
      const splitString = e.target.value?.split(".");
      const numberBeforePoint = splitString?.[0] || "0";
      const numberAfterPoint = splitString?.[1]?.[0] || "0";

      const value =
        type === "int"
          ? parseInt(toSimplest(e.target.value))
          : parseFloat(`${numberBeforePoint}.${numberAfterPoint}`).toFixed(1);
      return value;
    }
    return "";
  };

  const checkMinValue = (value: number | string) => {
    if (min) {
      if (parseInt(value.toString()) >= min) return value;
      return min;
    } else {
      if (parseInt(value.toString()) < 0) return 0;
      return value;
    }
  };

  const handleEnterPress = (e: any) => {
    const value = formatSimpleValue(e);

    if (isEnterPress(e)) {
      onBlur && onBlur(checkMinValue(value) || 0);
    } else if (e.keyCode === 38) {
      handleInCrement(value.toString());
    } else if (e.keyCode === 40) {
      handleDeCrement(value.toString());
    }
  };

  const handleChange = (e: any) => {
    const value = formatSimpleValue(e);
    setInput((prev) => checkMinValue(value));
    onChange(checkMinValue(value) || 0);
  };

  const handleBlur = (e: any) => {
    const value = formatSimpleValue(e);
    onBlur && onBlur(checkMinValue(value) || 0);
  };

  const handleInCrement = (input: string) => {
    const increment = type === "float" ? parseFloat(input) + unit : parseInt(input) + unit;
    onChange(increment || 0);
    setInput((prev) => increment);
  };

  const handleDeCrement = (input: string) => {
    const decrement = type === "float" ? parseFloat(input) - unit : parseInt(input) - unit;
    onChange(checkMinValue(decrement) || 0);
    setInput((prev) => checkMinValue(decrement));
  };

  useEffect(() => {
    setInput((prev) => value);
  }, [value]);

  return (
    <TextField
      {...props}
      value={input ? (type === "int" ? fNumber(input.toString()) : input) : input === 0 ? 0 : ""}
      fullWidth
      disabled={props.disabled}
      autoFocus={autoFocus}
      variant={variant}
      label={label}
      onBlur={handleBlur}
      placeholder={placeholder}
      error={props.error}
      helperText={props.helperText}
      size={size}
      onChange={handleChange}
      onKeyDown={handleEnterPress}
      sx={{ ".MuiOutlinedInput-root": { pr: 0.5 }, ...styles }}
      InputProps={{
        ...props.InputProps,
        autoComplete: "off",
        inputProps: {
          min: min,
          ...props.InputProps?.inputProps,
        },
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{
              pointerEvents: props.disabled ? "none" : "auto",
              opacity: props.disabled ? 0.4 : 0.8,
            }}
          >
            <ArrowVerticalIcon
              handleClickDown={() => handleDeCrement((input || unit).toString())}
              handleClickUp={() => handleInCrement((input || unit).toString())}
            />
          </InputAdornment>
        ),
      }}
    />
  );
};
