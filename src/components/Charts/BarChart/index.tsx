// Libraries
import { useState, useMemo, useEffect } from "react";
import { merge } from "lodash";
import map from "lodash/map";
import ReactApexChart from "react-apexcharts";

// Hooks
import useResponsive from "hooks/useResponsive";

// Components
import BaseOptionChart from "components/Charts/BaseOptionChart";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import LoadingModal from "components/Loadings/LoadingModal";
import { MultiSelect } from "components/Selectors";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Utils
import { fNumber } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

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
  subTitle?: string;
  labelKey?: string;
  data: any;
  optionsFilter?: SelectOptionType[];
  isLoading?: boolean;
  defaultFilter?: {
    filterOne: string | number;
    filterTwo?: string | number;
  };
  isSingleLine?: boolean;
  isShowFilter?: boolean;
  styleFilter?: {
    [key: string]: string | number;
  };
}
/**
 *
 * @param labelKey chọn 1 key trong item data để show dữ liệu
 * @param data là 1 mãng đối tượng - đối tượng bao gồm 1 key chứa label và 1 key chứa value
 * @param optionsFilter là mãng các item - item gồm {label, value} => value có giá trị là key của mỗi item trong data
 * @param defaultFilter là key mặc định show chart
 * @param isSingleLine là 1 cột trong chart
 * @param isShowFilter toggle show filter
 * @param styleFilter  style cho selector header
 * @returns
 */
const BarChart = (props: Props) => {
  const {
    styleFilter = {},
    height = 400,
    data,
    isSingleLine = false,
    labelKey = "date",
    optionsFilter = FILTER_CHART_OPTIONS,
    title = "Chart",
    subTitle,
    isLoading = false,
    defaultFilter = {
      filterOne: "Chi phí",
      filterTwo: "Bình luận",
    },
    isShowFilter = true,
  } = props;

  const theme = useTheme();
  const [filter, setFilter] = useState(defaultFilter);
  const isMobile = useResponsive("down", "sm");

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
    return map(data, (item: any) =>
      getObjectPropSafely(() => item[labelKey].length)
        ? item[labelKey]?.slice(0, 18)
        : item[labelKey]
    );
  }, [data]);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories,
      labels: {
        trim: true,
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: theme.palette.primary.main,
        },
        labels: {
          style: {
            colors: theme.palette.primary.main,
            maxWidth: 200,
          },
          formatter(val: number) {
            return fNumber(val);
          },
        },
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: theme.palette.chart.yellow[0],
        },
        labels: {
          style: {
            colors: theme.palette.chart.yellow[0],
          },
          formatter(val: number) {
            return fNumber(val);
          },
        },
      },
    ],
    tooltip: {
      y: {
        formatter(val: number) {
          return fNumber(val);
        },
      },
      x: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "36%",
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: !isMobile && data.length < 2,
      formatter(val: number) {
        return fNumber(val);
      },
    },
  });

  useEffect(() => {
    setFilter(defaultFilter);
  }, [defaultFilter]);

  return (
    <Grid style={containerStyle}>
      {isLoading && <LoadingModal />}
      <Card>
        <CardHeader
          title={title}
          subheader={subTitle}
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
                  {!isSingleLine && (
                    <MultiSelect
                      style={{ ...selectorStyle, ...styleFilter }}
                      title=""
                      options={optionsFilter}
                      onChange={(value: any) => {
                        setFilter({
                          ...filter,
                          filterTwo: value,
                        });
                      }}
                      label=""
                      defaultValue={filter.filterTwo}
                      simpleSelect
                      selectorId="metric-column-two"
                    />
                  )}
                </Box>
              </Stack>
            ) : null
          }
        />
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart
            type="bar"
            series={dataChart}
            options={
              isSingleLine ? { ...chartOptions, yaxis: chartOptions.yaxis[0] } : chartOptions
            }
            height={height}
          />
        </Box>
      </Card>
    </Grid>
  );
};

export default BarChart;

const containerStyle: React.CSSProperties = { position: "relative" };
const selectorStyle: React.CSSProperties = { width: 170 };
