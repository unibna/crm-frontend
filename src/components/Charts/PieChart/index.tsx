// Libraries
import { merge } from "lodash";
import { useState, useMemo, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

// Components
import { Card, CardHeader, Stack, Grid } from "@mui/material";
import BaseOptionChart from "components/Charts/BaseOptionChart";
import { useTheme, styled } from "@mui/material/styles";
import LoadingModal from "components/Loadings/LoadingModal";
import Box from "@mui/material/Box";
import { MultiSelect } from "components/Selectors";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Utils
import map from "lodash/map";
import { fNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

export const FILTER_CHART_OPTIONS = [
  { value: "spend", label: "Chi phí" },
  { value: "comment", label: "Bình luận" },
  { value: "cost_per_comment", label: "Chi phí / bình luận" },
  { value: "cost_per_messaging_conversation_started_7d", label: "Chi phí/ tin nhắn" },
  { value: "cost_per_fb_pixel_complete_registration", label: "Chi phí / form" },
];

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  "& .apexcharts-canvas svg": { height: CHART_HEIGHT },
  "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    alignContent: "center",
    position: "relative !important" as "relative",
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

interface Props {
  title?: string;
  subTitle?: string;
  subheader?: string;
  keyFilter?: string;
  data: any;
  optionsFilter?: SelectOptionType[];
  optionsFilterData?: SelectOptionType[];
  isLoading?: boolean;
  defaultFilter?: {
    filterOne: string;
    filterTwo?: string;
  };
  totalData?: any;
  styleFilter?: {
    [key: string]: string | number;
  };
  colors?: string[];
  isShowFilter?: boolean;
  handleChangeFilterData?: (value: string) => void;
}

const PieChart = (props: Props) => {
  const {
    styleFilter = {},
    data,
    colors = [],
    keyFilter = "date",
    optionsFilter,
    optionsFilterData = [],
    totalData,
    handleChangeFilterData = (value: string) => {},
    title = "Chart",
    subTitle,
    isLoading = false,
    defaultFilter = {
      filterOne: "cost",
    },
    isShowFilter = true,
  } = props;
  const theme = useTheme();
  const [filter, setFilter] = useState(defaultFilter);

  const objOption = useMemo(() => {
    return totalData
      ? {
          title: {
            text: `Tổng: ${fNumber(totalData[filter.filterOne])}`,
            align: "center",
            style: {
              color: theme.palette.text.primary,
            },
          },
        }
      : {};
  }, [filter, totalData]);

  const dataChart = useMemo(() => {
    return data.length
      ? data.reduce((prevArr: any, current: any) => {
          return [...prevArr, current[filter.filterOne]];
        }, [])
      : [];
  }, [filter, data, optionsFilter]);

  const categories = useMemo(() => {
    return map(data, (item: any) => item[keyFilter]);
  }, [data]);

  const chartOptions = merge(BaseOptionChart(), {
    colors: colors.length ? colors : BaseOptionChart().colors,
    labels: categories,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: "center" },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: string) => fNumber(seriesName),
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
    ...objOption,
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
                  {optionsFilter && (
                    <MultiSelect
                      style={{ ...firstSelectorStyle, ...styleFilter }}
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
                  )}
                  {optionsFilterData.length ? (
                    <MultiSelect
                      style={{ ...selectorStyle, ...styleFilter }}
                      title=""
                      options={optionsFilterData}
                      onChange={(value: string) => handleChangeFilterData(value)}
                      label=""
                      defaultValue={optionsFilterData[0].value}
                      simpleSelect
                      selectorId="metric-column-two"
                    />
                  ) : null}
                </Box>
              </Stack>
            ) : null
          }
        />
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart type="pie" series={dataChart} options={chartOptions} height={280} />
        </ChartWrapperStyle>
      </Card>
    </Grid>
  );
};

export default PieChart;

const containerStyle: React.CSSProperties = { position: "relative" };

const selectorStyle: React.CSSProperties = { width: 170, marginLeft: 10 };
const firstSelectorStyle: React.CSSProperties = { width: 200 };
