// Libraries
import { useContext, useMemo } from "react";
import merge from "lodash/merge";
import { useTheme } from "@mui/material/styles";
import ReactApexChart from "react-apexcharts";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";

// Components
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BaseOptionChart from "components/Charts/BaseOptionChart";

// Constants & Utils
import { fNumber } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";

// ----------------------------------------------------------------

type ItemProps = {
  label: string;
  value: number;
};

type LegendProps = {
  item: ItemProps;
};

const Legend = ({ item }: LegendProps) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 16,
            height: 16,
            bgcolor: "grey.50016",
            borderRadius: 0.75,
            ...(item.label === "Đã sử dụng" && {
              bgcolor: "primary.main",
            }),
          }}
        />

        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          {`${item.label}`}
        </Typography>
      </Stack>

      <Typography variant="subtitle1">{`${item.value}`}</Typography>
    </Stack>
  );
};

const ChartZns = () => {
  const theme = useTheme();
  const { state: store } = useContext(ZaloContext);
  const { oaFilter } = store;
  const { quota_total_zns, quota_remain_zns } = oaFilter;

  const dataRender = useMemo(() => {
    return [
      { label: "Đã sử dụng", value: quota_total_zns - quota_remain_zns },
      { label: "Còn", value: quota_remain_zns },
    ];
  }, [oaFilter]);

  const chartSeries = useMemo(() => {
    return fNumber((getObjectPropSafely(() => dataRender[0].value) / quota_total_zns) * 100);
  }, [dataRender]);

  const chartOptions = useMemo(() => {
    return merge(BaseOptionChart(), {
      legend: { show: false },
      grid: {
        padding: { top: -32, bottom: -32 },
      },
      fill: {
        type: "gradient",
        gradient: {
          colorStops: [[theme.palette.primary.light, theme.palette.primary.main]].map((colors) => [
            { offset: 0, color: colors[0] },
            { offset: 100, color: colors[1] },
          ]),
        },
      },
      plotOptions: {
        radialBar: {
          hollow: { size: "64%" },
          dataLabels: {
            name: { offsetY: -16 },
            value: { offsetY: 8 },
            total: {
              label: "Tổng",
              formatter: () => fNumber(quota_total_zns),
            },
          },
        },
      },
    });
  }, [quota_total_zns]);

  return (
    <Card>
      <CardHeader title="Hạn mức ZNS / ngày" sx={{ mb: 8 }} />

      <ReactApexChart type="radialBar" series={[chartSeries]} options={chartOptions} height={310} />

      <Stack spacing={2} sx={{ p: 5 }}>
        {dataRender.map((item) => (
          <Legend key={item.label} item={item} />
        ))}
      </Stack>
    </Card>
  );
};

export default ChartZns;
