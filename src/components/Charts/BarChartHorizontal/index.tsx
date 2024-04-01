// Libraries
import { useState, useMemo } from "react";
import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";

// Components
import BaseOptionChart from "components/Charts/BaseOptionChart";
import { Card, CardHeader, Box, Stack, Grid } from "@mui/material";
import LoadingModal from "components/Loadings/LoadingModal";
import { MultiSelect } from "components/Selectors";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Utils
import map from "lodash/map";
import { fNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

export const FILTER_CHART_OPTIONS: SelectOptionType[] = [
  { value: "spend", label: "Chi phí" },
  { value: "comment", label: "Bình luận" },
  { value: "cost_per_comment", label: "Chi phi / bình luận" },
  { value: "cost_per_messaging_conversation_started_7d", label: "Chi phí/ tin nhắn" },
  { value: "cost_per_fb_pixel_complete_registration", label: "Chi phí / form" },
];
interface Props {
  height?: number;
  title?: string;
  subheader?: string;
  keyFilter?: string;
  data: any;
  optionsFilter?: SelectOptionType[];
  isLoading?: boolean;
  defaultFilter?: {
    filterOne: string;
    filterTwo?: string;
  };
  isShowFilter?: boolean;
  styleFilter?: {
    [key: string]: string | number;
  };
}

const BarChartHorizontal = (props: Props) => {
  const {
    styleFilter = {},
    height = 400,
    data,
    isShowFilter = true,
    keyFilter = "date",
    optionsFilter = FILTER_CHART_OPTIONS,
    title = "Chart",
    isLoading = false,
    defaultFilter = {
      filterOne: "cost",
    },
  } = props;

  const [filter, setFilter] = useState(defaultFilter);

  const convertCost = (cost: number) => {
    return cost ? Math.round(cost) : 0;
  };

  const dataChart = useMemo(() => {
    return map(Object.values(filter), (item) => {
      const objData = optionsFilter.find((option) => option.value === item) || {
        value: "",
        label: "",
      };

      return {
        name: objData.label,
        data: map(data, (value: any) => convertCost(value[item])),
      };
    });
  }, [filter, data, optionsFilter]);

  const categories = useMemo(() => {
    return map(data, (item: any) => item[keyFilter].slice(0, 18));
  }, [data]);

  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      categories,
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName: string) => fNumber(seriesName),
        title: {
          formatter: () => "",
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: "28%", borderRadius: 2 },
    },
  });

  return (
    <Grid style={containerStyle}>
      {isLoading && <LoadingModal />}
      <Card>
        <CardHeader
          title={title}
          action={
            isShowFilter ? (
              <Stack direction="row" alignItems="center">
                <Box component="form" noValidate autoComplete="off">
                  <MultiSelect
                    style={{ ...selectorStyle, ...styleFilter }}
                    title=""
                    options={optionsFilter}
                    onChange={(value: any) => {
                      setFilter({
                        ...filter,
                        filterOne: value,
                      });
                    }}
                    label=""
                    defaultValue={filter.filterOne}
                    simpleSelect
                    selectorId="metric-column-one"
                  />
                </Box>
              </Stack>
            ) : null
          }
        />
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart type="bar" series={dataChart} options={chartOptions} height={height} />
        </Box>
      </Card>
    </Grid>
  );
};

export default BarChartHorizontal;

const containerStyle: React.CSSProperties = { position: "relative" };
const selectorStyle: React.CSSProperties = { width: 200 };
