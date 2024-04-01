import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import DateRangePicker from "@mui/lab/DateRangePicker";
import { RangeInput } from "@mui/lab/DateRangePicker/RangeTypes";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import differenceInDays from "date-fns/fp/differenceInDays";
import React, { useMemo } from "react";
import { fDateTime } from "utils/dateUtil";

interface Props {
  size?: "small" | "medium";
  inputStyle?: React.CSSProperties;
  rangeStart: RangeInput<Date>;
  setRangeStart?: React.Dispatch<React.SetStateAction<RangeInput<Date>>>;
  rangeEnd: RangeInput<Date>;
  setRangeEnd?: React.Dispatch<React.SetStateAction<RangeInput<Date>>>;
  handleSubmitCompare?: (rangeStart: RangeInput<Date>, rangeEnd: RangeInput<Date>) => void;
}

function DateComparePicker(props: Props) {
  const {
    size,
    inputStyle,
    rangeStart,
    rangeEnd,
    setRangeStart,
    setRangeEnd,
    handleSubmitCompare,
  } = props;
  const theme = useTheme();
  const handleChangeRangeStart = (newValue: any) => {
    setRangeStart && setRangeStart(newValue);
  };
  const handleChangeRangeEnd = (newValue: any) => {
    setRangeEnd && setRangeEnd(newValue);
  };

  const rangeStartLength = useMemo(
    () =>
      (rangeStart.length === 2 &&
        Math.abs(
          differenceInDays(new Date(rangeStart[0] as string), new Date(rangeStart[1] as string))
        ) + 1) ||
      0,
    [rangeStart]
  );

  const rangeEndLength = useMemo(
    () =>
      (rangeEnd.length === 2 &&
        Math.abs(
          differenceInDays(new Date(rangeEnd[0] as string), new Date(rangeEnd[1] as string))
        ) + 1) ||
      0,
    [rangeEnd]
  );

  return (
    <Card sx={styles.container}>
      <Box>
        <Grid container display="flex" alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography sx={styles.label}>
              Bắt đầu
              {rangeStartLength ? (
                <span
                  color={
                    rangeEndLength && rangeStartLength !== rangeEndLength
                      ? theme.palette.error.dark
                      : "inherit"
                  }
                >
                  {` (${rangeStartLength} ngày):`}
                </span>
              ) : (
                ":"
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <DateRangePicker
              calendars={2}
              value={rangeStart}
              onChange={handleChangeRangeStart}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField
                    variant="standard"
                    {...startProps}
                    size={size}
                    label="Từ"
                    style={{ ...styles.input, ...inputStyle }}
                    inputProps={{
                      ...startProps.inputProps,
                      value: startProps?.inputProps?.value
                        ? fDateTime(startProps.inputProps.value)
                        : "",
                    }}
                  />
                  <Box mx={2}>
                    <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                  </Box>
                  <TextField
                    variant="standard"
                    {...endProps}
                    size={size}
                    label="Đến"
                    style={{ ...styles.input, ...inputStyle }}
                    inputProps={{
                      ...endProps.inputProps,
                      value: endProps?.inputProps?.value
                        ? fDateTime(endProps.inputProps.value)
                        : "",
                    }}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Grid container display="flex" alignItems="center">
          <Grid item xs={12}>
            <Typography sx={styles.label}>
              Kết thúc
              {rangeEndLength ? (
                <span
                  color={
                    rangeStartLength && rangeStartLength !== rangeEndLength
                      ? theme.palette.error.dark
                      : "inherit"
                  }
                >
                  {` (${rangeEndLength} ngày):`}
                </span>
              ) : (
                ":"
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <DateRangePicker
              calendars={2}
              value={rangeEnd}
              onChange={handleChangeRangeEnd}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField
                    variant="standard"
                    {...startProps}
                    size={size}
                    label="Từ"
                    style={{ ...styles.input, ...inputStyle }}
                    inputProps={{
                      ...startProps.inputProps,
                      value: startProps?.inputProps?.value
                        ? fDateTime(startProps.inputProps.value)
                        : "",
                    }}
                  />
                  <Box mx={2}>
                    <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
                  </Box>
                  <TextField
                    variant="standard"
                    {...endProps}
                    size={size}
                    label="Đến"
                    style={{ ...styles.input, ...inputStyle }}
                    inputProps={{
                      ...endProps.inputProps,
                      value: endProps?.inputProps?.value
                        ? fDateTime(endProps.inputProps.value)
                        : "",
                    }}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
      </Box>

      <Button
        disabled={
          (rangeStartLength && rangeEndLength && rangeStartLength !== rangeEndLength) ||
          !rangeStartLength ||
          !rangeEndLength
        }
        variant="contained"
        onClick={() => handleSubmitCompare && handleSubmitCompare(rangeStart, rangeEnd)}
      >
        <ArrowForwardIcon />
      </Button>
    </Card>
  );
}

export default DateComparePicker;

const styles = {
  container: {
    px: 3,
    py: 2,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  label: {
    mb: "4px",
    fontSize: "0.775",
  },
  input: {
    width: "200px",
  },
};
