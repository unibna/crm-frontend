import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import DateRangePicker from "@mui/lab/DateRangePicker";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { RANGE_MONTH_OPTIONS, yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import React, { useEffect, useMemo, useState } from "react";
import { transformMonthFilter } from "utils/dateUtil";

interface Props {
  handleSubmit: (created_from: string, created_to: string, dateValue: string | number) => void;
  defaultDateValue?: number | string;
  created_from?: string;
  created_to?: string;
  label?: string;
  style?: React.CSSProperties;
  size?: "small" | "medium";
  roadster?: boolean;
  inputStyle?: React.CSSProperties;
}

const RangeMonthDate = ({
  roadster,
  size,
  style,
  label = "Thời gian",
  handleSubmit,
  defaultDateValue = "all",
  created_from = format(subDays(new Date(), 0), yyyy_MM_dd),
  created_to = format(subDays(new Date(), 0), yyyy_MM_dd),
  inputStyle,
}: Props) => {
  const [date, setDate] = useState<any>({
    dateValue: defaultDateValue,
    created_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    created_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    isShowRangePicker: false,
    valueDateRange: [null, null],
  });

  useEffect(() => {
    setDate({
      ...date,
      dateValue: defaultDateValue,
      created_from,
      created_to,
      valueDateRange: [created_from, created_to],
      isShowRangePicker: defaultDateValue === "custom_date" ? true : false,
    });
  }, [defaultDateValue]);

  const handleChangeRangePicker = (newValue: any) => {
    setDate({
      ...date,
      valueDateRange: newValue,
    });
  };

  const handleSelectDate = (objData?: any) => {
    if (objData) {
      switch (objData?.value) {
        case "custom_date": {
          setDate({
            ...date,
            dateValue: "custom_date",
            isShowRangePicker: true,
          });
          break;
        }
        case "all": {
          setDate({
            ...date,
            isShowRangePicker: false,
          });

          handleSubmit("all", "all", "all");
          break;
        }
        default: {
          setDate({
            ...date,
            isShowRangePicker: false,
            dateValue: objData.value,
            created_from: transformMonthFilter(objData.value, yyyy_MM_dd).created_from,
            created_to: transformMonthFilter(objData.value, yyyy_MM_dd).created_to,
          });

          handleSubmit(
            transformMonthFilter(objData.value, yyyy_MM_dd).created_from,
            transformMonthFilter(objData.value, yyyy_MM_dd).created_to,
            objData.value
          );
        }
      }
    }
  };

  const newValue = useMemo(() => {
    return (
      RANGE_MONTH_OPTIONS.find((item) => item.value === date.dateValue) || RANGE_MONTH_OPTIONS[0]
    );
  }, [date.dateValue]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Autocomplete
        fullWidth={date.isShowRangePicker ? false : true}
        style={{ width: date.isShowRangePicker ? 150 : undefined, ...style }}
        openOnFocus
        autoHighlight
        value={newValue}
        onChange={(event: any, value: any) => handleSelectDate(value)}
        options={RANGE_MONTH_OPTIONS}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <li {...props} style={{ fontSize: 13 }}>
            {option.label}
          </li>
        )}
        sx={{ marginTop: 1 }}
        renderInput={(params) => (
          <TextField
            {...params}
            size={size}
            variant={roadster ? "standard" : "outlined"}
            label={label}
          />
        )}
      />
      {date.isShowRangePicker ? (
        <div style={{ display: "flex", margin: 8 }}>
          <DateRangePicker
            calendars={2}
            value={date.valueDateRange}
            onChange={handleChangeRangePicker}
            renderInput={(startProps, endProps) => (
              <>
                <TextField
                  variant="standard"
                  {...startProps}
                  size={size}
                  label="Từ"
                  style={{ width: 100, ...inputStyle }}
                />
                <Box mx={2}>
                  <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                </Box>
                <TextField
                  variant="standard"
                  {...endProps}
                  size={size}
                  label="Đến"
                  style={{ width: 100, ...inputStyle }}
                />
              </>
            )}
          />
          <Button
            onClick={() =>
              handleSubmit(
                format(date.valueDateRange[0], yyyy_MM_dd),
                format(date.valueDateRange[1], yyyy_MM_dd),
                "custom_date"
              )
            }
          >
            <ArrowForwardIcon />
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default RangeMonthDate;
