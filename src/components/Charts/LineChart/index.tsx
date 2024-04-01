// Libraries
import { merge, reduce } from "lodash";
import { useState, useMemo } from "react";
import map from "lodash/map";

// Components
import ReactApexChart from "react-apexcharts";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import BaseOptionChart from "components/Charts/BaseOptionChart";
import { useTheme } from "@mui/material/styles";
import LoadingModal from "components/Loadings/LoadingModal";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Utils
import { fNumber, fValueVnd } from "utils/formatNumber";
import { fDate } from "utils/dateUtil";

// ----------------------------------------------------------------------

export const FILTER_CHART_OPTIONS: SelectOptionType[] = [
  { value: "spend", label: "Chi phí" },
  { value: "comment", label: "Bình luận" },
  { value: "cost_per_comment", label: "Chi phí / bình luận" },
  { value: "cost_per_messaging_conversation_started_7d", label: "Chi phí/ tin nhắn" },
  { value: "cost_per_fb_pixel_complete_registration", label: "Chi phí / form" },
];

interface Props {
  title?: string;
  subheader?: string;
  keyFilter?: string;
  arrAttachUnitVnd?: string[];
  arrAttachUnitPercent?: string[];
  data: any;
  optionsFilter?: SelectOptionType[];
  isLoading?: boolean;
  defaultFilter?: {
    filterOne: string;
    filterTwo?: string;
  };
  singleLine?: boolean;
  getFilter?: any;
}

const LineChart = (props: Props) => {
  const {
    data,
    singleLine = false,
    arrAttachUnitPercent = [],
    arrAttachUnitVnd = [],
    keyFilter = "date",
    optionsFilter = FILTER_CHART_OPTIONS,
    title = "Chart",
    isLoading = false,
    defaultFilter = {
      filterOne: "Chi phí",
      filterTwo: "Bình luận",
    },
    getFilter,
  } = props;
  const theme = useTheme();
  const [filter, setFilter] = useState(defaultFilter);

  const convertValue = (name: string, value: number) => {
    switch (true) {
      case arrAttachUnitVnd.includes(name): {
        return fValueVnd(value);
      }
      case arrAttachUnitPercent.includes(name): {
        return `${value} %`;
      }
      default:
        return fNumber(value);
    }
  };

  const dataChart = useMemo(() => {
    return map(Object.values(filter), (item) => {
      const objData = optionsFilter.find((option) => option.label === item) || {
        value: "",
        label: "",
      };

      return {
        name: item,
        data: map(data, (value: any) => value[objData.value]),
      };
    });
  }, [filter, data, optionsFilter]);

  const objConvertFilter = useMemo(() => {
    return reduce(
      Object.values(filter),
      (prevObj, current, index) => {
        const objData = optionsFilter.find((option) => option.label === current) || {
          value: "",
          label: "",
        };

        return { ...prevObj, [index]: objData.value };
      },
      {}
    );
  }, [filter, optionsFilter]);

  const categories = useMemo(() => {
    return map(data, (item: any) =>
      keyFilter.includes("date") ? fDate(item[keyFilter]) : item[keyFilter]
    );
  }, [data]);

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories,
    },
    yaxis: [
      {
        axisTicks: { show: true },
        axisBorder: { show: true, color: theme.palette.primary.main },
        labels: {
          style: { colors: theme.palette.primary.main },
          formatter(val: number) {
            return fNumber(val);
          },
        },
      },
      {
        opposite: true,
        axisTicks: { show: true },
        axisBorder: { show: true, color: theme.palette.chart.yellow[0] },
        labels: {
          style: { colors: theme.palette.chart.yellow[0] },
          formatter(val: number) {
            return fNumber(val);
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter(val: number, opts?: any) {
          return convertValue(objConvertFilter[opts.seriesIndex], val);
        },
      },
    },
  });

  return (
    <Grid style={containerStyle}>
      {isLoading && <LoadingModal />}
      <Card>
        <CardHeader
          sx={{
            ".MuiCardHeader-action": {
              flex: "1 1 auto",
            },
          }}
          title={title}
          action={
            <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", pr: 2 }}>
              <TextField
                id="filled-select-linechart-column-first"
                select
                value={filter.filterOne}
                onChange={(event) => {
                  setFilter({
                    ...filter,
                    filterOne: event.target.value,
                  });

                  getFilter && getFilter((prev: string[]) => [...prev, event.target.value]);
                }}
                variant="filled"
                sx={{
                  fontSize: 14,
                  ".MuiFilledInput-root": {
                    borderRadius: 1,
                    "&:before, &:after": { borderBottom: 0, content: "unset" },
                    ".MuiSelect-filled": { padding: "4px 8px" },
                  },
                }}
              >
                {map(optionsFilter, (option) => (
                  <MenuItem key={option.label} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {!singleLine && (
                <TextField
                  id="filled-select-linechart-column-second"
                  select
                  value={filter.filterTwo}
                  onChange={(event) =>
                    setFilter({
                      ...filter,
                      filterTwo: event.target.value,
                    })
                  }
                  variant="filled"
                  sx={{
                    fontSize: 14,
                    ".MuiFilledInput-root": {
                      borderRadius: 1,
                      "&:before, &:after": { borderBottom: 0, content: "unset" },
                      ".MuiSelect-filled": { padding: "4px 8px" },
                    },
                  }}
                >
                  {map(optionsFilter, (option) => (
                    <MenuItem key={option.label} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Stack>
          }
        />
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart
            type="line"
            series={dataChart}
            options={singleLine ? { ...chartOptions, yaxis: chartOptions.yaxis[0] } : chartOptions}
            height={364}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default LineChart;

const containerStyle: React.CSSProperties = { position: "relative" };
