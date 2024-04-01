// Libraries
import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";

// Components
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { useTheme, styled } from "@mui/material/styles";
import LoadingModal from "components/Loadings/LoadingModal";
import BaseOptionChart from "components/Charts/BaseOptionChart";

// ----------------------------------------------------------------------

export const FILTER_CHART_OPTIONS = [
  { value: "spend", label: "Chi phí" },
  { value: "comment", label: "Bình luận" },
  { value: "cost_per_comment", label: "Chi phí / bình luận" },
  { value: "cost_per_messaging_conversation_started_7d", label: "Chi phí/ tin nhắn" },
  { value: "cost_per_fb_pixel_complete_registration", label: "Chi phí / form" },
];

interface Props {
  title?: string;
  subheader?: string;
  titleChart?: string;
  subtitleChart?: string;
  data: any;
  isLoading?: boolean;
  labels?: string[];
  labelTotal?: string;
  contentFilter?: () => JSX.Element;
  contentDescription?: () => JSX.Element;
  contentTitle?: () => JSX.Element;
  formatterValue?: (value: number) => string | number;
  formatterTotal?: (opts: any) => string | number;
}

const CHART_HEIGHT = 450;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
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

const RadialBar = (props: Props) => {
  const {
    data,
    title = "Chart",
    titleChart = "",
    subtitleChart = "",
    labelTotal = "Tổng",
    isLoading = false,
    labels = [],
    contentFilter,
    contentDescription,
    formatterValue,
    formatterTotal,
  } = props;
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [theme.palette.primary.main, theme.palette.chart.blue[0]],
    labels,
    legend: { floating: true, horizontalAlign: "center", inverseOrder: true },
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          [
            { offset: 0, color: theme.palette.primary.light },
            { offset: 100, color: theme.palette.primary.main },
          ],
          [
            { offset: 0, color: theme.palette.chart.blue[0] },
            { offset: 100, color: theme.palette.chart.blue[1] },
          ],
        ],
      },
    },
    title: {
      text: titleChart,
      align: "center",
      style: { color: theme.palette.text.primary },
    },
    subtitle: {
      text: subtitleChart,
      align: "center",
      style: { color: theme.palette.text.primary },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "68%" },
        dataLabels: {
          value: {
            offsetY: 16,
            formatter: (val: number) => {
              return formatterValue ? formatterValue(val) : `${val} %`;
            },
          },
          total: {
            show: !!formatterTotal,
            label: labelTotal,
            formatter: (opts: any) => {
              return formatterTotal ? formatterTotal(opts) : "";
            },
          },
        },
      },
    },
  });

  return (
    <Grid style={containerStyle}>
      {isLoading && <LoadingModal />}
      <Card>
        <CardHeader title={title} action={contentFilter ? contentFilter() : null} />
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart type="radialBar" series={data} options={chartOptions} height={340} />
        </ChartWrapperStyle>

        {contentDescription ? contentDescription() : null}
      </Card>
    </Grid>
  );
};

export default RadialBar;

const containerStyle: React.CSSProperties = { position: "relative" };
