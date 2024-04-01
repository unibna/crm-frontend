// Libraries
import React, { useEffect, useState, useRef } from "react";

// Components
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import PhoneForwarded from "@mui/icons-material/PhoneForwarded";
import Tooltip from "@mui/material/Tooltip";

// Hook
import useDebounce from "hooks/useDebounce";

interface Props {
  label?: string;
  renderIcon?: React.ReactNode;
  roadster?: boolean;
  onSearch: (value: string) => void;
  placeholder?: string;
  tooltip?: string;
  defaultValue?: string;
  style?: any;
  delay?: number;
}

const SearchFilter = (props: Props) => {
  const {
    label = "Nhập số điện thoại",
    renderIcon = <PhoneForwarded style={iconStyle} />,
    roadster,
    style = {},
    placeholder,
    tooltip = "",
    defaultValue = "",
    delay,
    onSearch,
  } = props;
  const [value, setValue] = useState<string>(defaultValue || "");
  const debouncedSearch = useDebounce(value, delay || 500);
  const firstRender = useRef(0);

  useEffect(() => {
    if (defaultValue !== value) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (firstRender.current !== 0 && (value !== defaultValue || value === "")) {
      onSearch(value);
    }
    firstRender.current += 1;
  }, [debouncedSearch]);

  return (
    <TextField
      fullWidth
      label="Tìm kiếm"
      size="small"
      style={style}
      variant={roadster ? "standard" : "outlined"}
      value={value}
      placeholder={label || placeholder}
      sx={{ width: 300 }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <Tooltip title={tooltip}>
            <InputAdornment position="start">{renderIcon}</InputAdornment>
          </Tooltip>
        ),
      }}
    />
  );
};

export default SearchFilter;

const iconStyle = { fontSize: 20 };
