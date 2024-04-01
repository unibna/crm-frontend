// Libraries
import { useMemo } from "react";
import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";

// Components
import BaseOptionChart from "components/Charts/BaseOptionChart";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LoadingModal from "components/Loadings/LoadingModal";

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Utils
import map from "lodash/map";
import { fNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

export const FILTER_CHART_OPTIONS = [
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
  keyX?: string;
  keyY?: string;
  data: any;
  optionsFilter?: SelectOptionType[];
  isLoading?: boolean;
  singleLine?: boolean;
  handleWatchDetail?: () => void;
}

const AreaChart = (props: Props) => {
  const {
    height = 400,
    data,
    keyX = "date",
    optionsFilter = FILTER_CHART_OPTIONS,
    title = "Chart",
    isLoading = false,
  } = props;

  const convertCost = (cost: number) => {
    return cost ? Math.round(cost) : 0;
  };

  const dataChart = useMemo(() => {
    return (
      map(optionsFilter, (itemFilter: any) => {
        const newData = map(data, (item: any) => convertCost(item[itemFilter.value]));
        return {
          name: itemFilter.label,
          data: newData,
        };
      }) || []
    );
  }, [data]);

  const categories = useMemo(() => {
    return map(data, (item: any) => item[keyX].slice(0, 15));
  }, [data]);

  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories,
      labels: {
        trim: true,
      },
    },
    tooltip: {
      y: {
        formatter(val: number) {
          return fNumber(val);
        },
      },
    },
  });

  return (
    <Grid style={chartContainerStyle}>
      {isLoading && <LoadingModal />}
      <Card>
        <CardHeader
          title={title}
          // subheader={subheader}
        />
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart type="area" series={dataChart} options={chartOptions} height={height} />
        </Box>
      </Card>
    </Grid>
  );
};

export default AreaChart;

const chartContainerStyle: React.CSSProperties = { position: "relative" };
