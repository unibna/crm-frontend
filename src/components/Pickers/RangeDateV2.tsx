// Libraries
import React, { useEffect, useState, useMemo, useRef } from "react";
import filter from "lodash/filter";
import map from "lodash/map";

// Components
import { useTheme, Theme, alpha, styled, TextFieldProps } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import Dialog from "@mui/material/Dialog";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import List from "@mui/material/List";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { RangeInput } from "@mui/lab/DateRangePicker/RangeTypes";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import { DatePicker, DesktopDatePicker } from "@mui/lab";
import { TitleGroup } from "components/Labels";

// Constants
import { RANGE_DATE_OPTIONS, yyyy_MM_dd } from "constants/time";

// Utils
import { fDate, transformDateFilter } from "utils/dateUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { format, subDays } from "date-fns";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { dateIsValid } from "utils/helpers";
import useResponsive from "hooks/useResponsive";

const dd_mm_yyyy = "dd/MM/yyyy";

export interface RangeDateV2Props {
  handleSubmit: (created_from: string, created_to: string, dateValue: string | number) => void;
  defaultDateValue?: number | string;
  created_from?: string;
  created_to?: string;
  label?: string;
  sxProps?: React.CSSProperties;
  size?: "small" | "medium";
  roadster?: boolean;
  inputStyle?: React.CSSProperties;
  dropdownStyle?: boolean;
  isTabComponent?: boolean;
  tabComponentStyles?: {
    container?: any;
    tabs?: any;
    tab?: any;
  };
  showCompareDate?: boolean;
  inputFormat?: string;
  handleSubmitCompare?: (rangeStart: RangeInput<Date>, rangeEnd: RangeInput<Date>) => void;
}

const RangeDateV2 = ({
  roadster,
  size = "small",
  sxProps,
  label = "Thời gian",
  handleSubmit,
  defaultDateValue = "all",
  inputStyle,
  isTabComponent,
  dropdownStyle,
  tabComponentStyles,
  showCompareDate,
  handleSubmitCompare,
  created_from,
  created_to,
  inputFormat = yyyy_MM_dd,
}: RangeDateV2Props) => {
  const theme = useTheme();
  const [date, setDate] = useState<any>({
    dateValue: defaultDateValue,
    created_from: null,
    created_to: null,
    valueDateRange: [null, null],
  });
  const [open, setOpen] = useState(false);
  const startDateInputRef: any = useRef();
  const isMobile = useResponsive("down", "sm");

  useEffect(() => {
    setDate({
      ...date,
      dateValue: defaultDateValue,
      created_from: created_from || null,
      created_to: created_to || null,
      valueDateRange: [created_from || null, created_to || null],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDateValue, created_from, created_to]);

  const handleChangeRangePicker = (value: any) => {
    setDate({
      ...date,
      valueDateRange: value,
    });
  };

  const handleSelectDate = (objData?: any) => {
    if (objData) {
      switch (objData?.value) {
        case "custom_date":
        case "custom_compare_date": {
          setDate((prev: any) => ({
            ...date,
            dateValue: objData?.value,
          }));
          startDateInputRef?.current?.focus();
          break;
        }
        case "all": {
          setDate({
            ...date,
          });

          handleSubmit("all", "all", "all");
          toggle();
          break;
        }
        default: {
          const checkOption = filter(
            RANGE_DATE_OPTIONS,
            (day) => parseInt(getObjectPropSafely(() => objData.value.toString())) === day.value
          );

          const haveToday = getObjectPropSafely(() => checkOption[0]?.haveToday) ? true : false;

          setDate({
            ...date,
            dateValue: objData.value,
            created_from: transformDateFilter(objData.value, dd_mm_yyyy, haveToday).created_from,
            created_to: transformDateFilter(objData.value, dd_mm_yyyy, haveToday).created_to,
          });

          handleSubmit(
            transformDateFilter(objData.value, inputFormat, haveToday).created_from,
            transformDateFilter(objData.value, inputFormat, haveToday).created_to,
            objData.value
          );

          const dateRangeStart: any = (formatString: string) => [
            transformDateFilter(
              objData.value,
              formatString,
              haveToday,
              new Date(transformDateFilter(objData.value, inputFormat, haveToday).created_from)
            ).created_from,
            transformDateFilter(
              objData.value,
              formatString,
              haveToday,
              new Date(transformDateFilter(objData.value, inputFormat, haveToday).created_from)
            ).created_to,
          ];

          const dateRangeEnd: any = (formatString: string) => [
            transformDateFilter(objData.value, formatString, haveToday).created_from,
            transformDateFilter(objData.value, formatString, haveToday).created_to,
          ];

          handleSubmitCompare &&
            handleSubmitCompare(dateRangeStart(inputFormat), dateRangeEnd(inputFormat));
          toggle();
        }
      }
    }
  };

  const handleSubmitRangeDate = () => {
    setDate({
      ...date,
      dateValue: "custom_date",
      created_from: date.valueDateRange[0],
      created_to: date.valueDateRange[1],
    });

    handleSubmit(
      format(new Date(date.valueDateRange[0].toString()), inputFormat),
      format(new Date(date.valueDateRange[1].toString()), inputFormat),
      "custom_date"
    );

    const duration =
      differenceInCalendarDays(
        new Date(date.valueDateRange[1].toString()),
        new Date(date.valueDateRange[0].toString())
      ) + 1;

    handleSubmitCompare &&
      handleSubmitCompare(
        [
          format(subDays(new Date(date.valueDateRange[0].toString()), duration), inputFormat),
          format(subDays(new Date(date.valueDateRange[1].toString()), duration), inputFormat),
        ],
        [
          format(new Date(date.valueDateRange[0].toString()), inputFormat),
          format(new Date(date.valueDateRange[1].toString()), inputFormat),
        ]
      );

    toggle();
  };

  const newValue = useMemo(() => {
    if (date.dateValue === "custom_date") {
      return {
        value: "custom_date",
        label: `${dateIsValid(date.valueDateRange[0]) ? fDate(date.valueDateRange[0]) : ""} - ${
          dateIsValid(date.valueDateRange[1]) ? fDate(date.valueDateRange[1]) : ""
        }`,
      };
    }
    return (
      RANGE_DATE_OPTIONS.find((item) => item.value === date.dateValue) || RANGE_DATE_OPTIONS[0]
    );
  }, [date.dateValue, date.valueDateRange]);

  const toggle = () => {
    setOpen(!open);
  };

  const inputDateProps: TextFieldProps = {
    variant: "outlined",
    size,
    sx: {
      width: isMobile ? 150 : 200,
      ...inputStyle,
    },
    InputLabelProps: { shrink: true },
  };

  const variant: any = roadster ? "standard" : "outlined";

  if (isTabComponent)
    return (
      <Box sx={tabComponentStyles?.container}>
        <Tabs
          value={newValue}
          onChange={(event: any, value: any) => handleSelectDate(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={tabComponentStyles?.tabs}
        >
          {map(RANGE_DATE_OPTIONS, (option, index) => (
            <Tab value={option} label={option.label} key={index} sx={tabComponentStyles?.tab} />
          ))}
        </Tabs>
      </Box>
    );

  return (
    <>
      <TextField
        size={size}
        variant={variant}
        label={dropdownStyle ? "" : label}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          readOnly: true,
          disableUnderline: dropdownStyle ? true : false,
          endAdornment: (
            <InputAdornment position="end">
              {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </InputAdornment>
          ),
        }}
        sx={{
          cursor: "pointer",
          transition: theme.transitions.create("all", {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
          ...(dropdownStyle && {
            "&: hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: "4px",
          }),
          ".MuiInput-input": {
            cursor: "pointer",
            ...(dropdownStyle && {
              padding: "8px",
              fontWeight: 500,
            }),
          },
        }}
        onClick={toggle}
        value={newValue.label}
      />
      <Dialog onClose={toggle} open={open} maxWidth="md" fullWidth>
        <DialogTitle>Chọn ngày</DialogTitle>
        <DialogContent sx={{ p: "24px!important" }}>
          <Stack
            direction={isMobile ? "column-reverse" : "row"}
            spacing={1}
            display="flex"
            alignItems="flex-start"
          >
            <Stack direction="column" spacing={1}>
              {/* Nhập ngày */}
              <Stack direction="column" spacing={1}>
                <Stack direction="row" spacing={1} display="flex" alignItems="center">
                  <Point />
                  <TitleGroup>{"Ngày tuỳ chọn"}</TitleGroup>
                </Stack>
                <Stack direction="row" spacing={1} display="flex" alignItems="center">
                  <DesktopDatePicker
                    label="Từ"
                    value={date.valueDateRange[0]}
                    onChange={(value) => handleChangeRangePicker([value, date.valueDateRange[1]])}
                    inputRef={startDateInputRef}
                    renderInput={(params) => <TextField {...params} {...inputDateProps} />}
                    disableOpenPicker
                  />
                  <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                  <DesktopDatePicker
                    label="Đến"
                    value={date.valueDateRange[1]}
                    onChange={(value) => handleChangeRangePicker([date.valueDateRange[0], value])}
                    renderInput={(params) => <TextField {...params} {...inputDateProps} />}
                    disableOpenPicker
                  />
                </Stack>
              </Stack>

              {/* Chọn ngày */}
              <WrapperDateRange>
                <StaticDateRangePicker
                  calendars={isMobile ? 1 : 2}
                  displayStaticWrapperAs="desktop"
                  value={date.valueDateRange}
                  onChange={handleChangeRangePicker}
                  inputFormat={dd_mm_yyyy}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </React.Fragment>
                  )}
                />
              </WrapperDateRange>
            </Stack>

            {/* Chọn ngày có sẵn */}
            <Stack direction="column" spacing={1}>
              <Stack direction="row" spacing={1} display="flex" alignItems="center">
                <Point />
                <TitleGroup>{"Ngày mặc định"}</TitleGroup>
              </Stack>
              <StyledList>
                {map(RANGE_DATE_OPTIONS, (option, index) => (
                  <StyledListItem
                    onMouseDown={() => handleSelectDate(option)}
                    key={index}
                    sx={{
                      ...(date.dateValue === option.value && {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }),
                    }}
                  >
                    {option.label}
                    {date.dateValue === option.value && (
                      <Box sx={{ pl: 2 }}>
                        <Point sx={{ width: 10, height: 10, borderRadius: "50%" }} />
                      </Box>
                    )}
                  </StyledListItem>
                ))}
              </StyledList>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            display="flex"
            justifyContent={isMobile ? "flex-start" : "flex-end"}
            sx={{ pt: 2 }}
          >
            <Button
              onClick={handleSubmitRangeDate}
              variant="contained"
              sx={{
                width: 120,
              }}
              disabled={
                !date.valueDateRange[0] ||
                !date.valueDateRange[1] ||
                !dateIsValid(date.valueDateRange[0]) ||
                !dateIsValid(date.valueDateRange[1])
              }
            >
              Chọn
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RangeDateV2;

const WrapperDateRange = styled(Box)(({ theme }: { theme: Theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  padding: 8,
  width: "fit-content",
}));

const Point = styled(Box)(({ theme }: { theme: Theme }) => ({
  width: 12,
  height: 12,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 4,
}));

const StyledList = styled(List)(({ theme }: { theme: Theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 16,
  padding: `8px 0px 8px 0px`,
  maxHeight: 451,
  overflow: "auto",
}));

const StyledListItem = styled(ListItem)(({ theme }: { theme: Theme }) => ({
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  transition: theme.transitions.create("all", {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));
