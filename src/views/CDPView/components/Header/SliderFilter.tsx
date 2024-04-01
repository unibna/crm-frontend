import React from "react";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { TextField } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { toSimplest } from "utils/stringsUtil";

interface Props {
  orders: number[];
  setOrders: React.Dispatch<React.SetStateAction<number[]>>;
  inputFormatFunc?: (value: number) => number | string;
  sliderFormatFunc?: (value: number) => string;
  title: string;
  rangeSliceArr: { label: string; value: number }[];
}

const SliderFilter = ({
  orders,
  setOrders,
  inputFormatFunc,
  sliderFormatFunc,
  title,
  rangeSliceArr,
}: Props) => {
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Typography fontSize={14}>{title}</Typography>
        <Stack direction="row" alignItems="center" mx={2}>
          <TextField
            variant="outlined"
            size="small"
            label="Từ"
            style={textFieldStyle}
            inputProps={{ min: rangeSliceArr[0].value.toString() }}
            value={inputFormatFunc ? inputFormatFunc(orders[0]) : orders[0]}
            onChange={(e) => {
              const value = toSimplest(e.target.value.toString());
              (parseInt(value) || value === "") && setOrders((prev) => [parseInt(value), prev[1]]);
            }}
          />
          <Box mx={1}>
            <ArrowRightAltIcon sx={{ color: "text.secondary" }} />
          </Box>
          <TextField
            variant="outlined"
            size="small"
            label="Đến"
            style={textFieldStyle}
            inputProps={{
              max: rangeSliceArr[rangeSliceArr.length - 1].value.toString(),
            }}
            value={inputFormatFunc ? inputFormatFunc(orders[1]) : orders[1]}
            onChange={(e) => {
              const value = toSimplest(e.target.value.toString());
              (parseInt(value) || value === "") && setOrders((prev) => [prev[0], parseInt(value)]);
            }}
          />
        </Stack>
      </Stack>
      <Slider
        value={orders}
        onChange={(e, value: number[]) => setOrders(value)}
        getAriaValueText={sliderFormatFunc}
        valueLabelFormat={sliderFormatFunc}
        valueLabelDisplay="auto"
        marks={rangeSliceArr}
        min={rangeSliceArr[0].value}
        max={rangeSliceArr[rangeSliceArr.length - 1].value}
      />
    </>
  );
};

export default SliderFilter;

const textFieldStyle = { width: 125 };
