// Libraries
import { useContext, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import merge from "lodash/merge";
import map from "lodash/map";
import { useTheme } from "@mui/material/styles";

// Context
import { ZaloContext } from "views/ZaloView/contextStore";

// Hooks
import useResponsive from "hooks/useResponsive";

// Components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import BaseOptionChart from "components/Charts/BaseOptionChart";

// --------------------------------------------------------------

const CHART_SIZE = { width: 106, height: 106 };

const PERCENT_QUANLITY = {
  HIGH: 100,
  MEDIUM: 75,
  LOW: 50,
  UNDEFINED: 25,
};

const QuanlityZns = () => {
  const theme = useTheme();
  const { state: store } = useContext(ZaloContext);
  const { oaFilter } = store;
  const isDesktop = useResponsive("up", "sm");

  const chartOptions = merge(BaseOptionChart(), {
    chart: { sparkline: { enabled: true } },
    grid: {
      padding: {
        top: -9,
        bottom: -9,
      },
    },
    legend: { show: false },
    plotOptions: {
      radialBar: {
        hollow: { size: "64%" },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontSize: theme.typography.subtitle2.fontSize,
          },
        },
      },
    },
  });

  const data = useMemo(() => {
    return [
      {
        label: "Chất lượng ZNS/ 7 days",
        value: oaFilter.quality_7day_zns,
        percent: oaFilter.quality_7day_zns
          ? PERCENT_QUANLITY[oaFilter.quality_7day_zns as keyof typeof PERCENT_QUANLITY]
          : 0,
      },
      {
        label: "Chất lượng ZNS/ days",
        value: oaFilter.quality_current_zns,
        percent: oaFilter.quality_current_zns
          ? PERCENT_QUANLITY[oaFilter.quality_current_zns as keyof typeof PERCENT_QUANLITY]
          : 0,
      },
    ];
  }, [oaFilter]);

  return (
    <Card>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        divider={
          <Divider
            orientation={isDesktop ? "vertical" : "horizontal"}
            flexItem
            sx={{ borderStyle: "dashed" }}
          />
        }
      >
        {map(data, (item, index) => {
          return (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={3}
              sx={{ width: 1, py: 5 }}
            >
              <ReactApexChart
                type="radialBar"
                series={[item.percent]}
                options={
                  index === 0
                    ? chartOptions
                    : { ...chartOptions, colors: [theme.palette.chart.yellow[0]] }
                }
                {...CHART_SIZE}
              />

              <div>
                <Typography variant="h4" sx={{ mb: 0.5 }}>
                  {item.value}
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.72 }}>
                  {item.label}
                </Typography>
              </div>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
};

export default QuanlityZns;
