// Libraries
import { useState, useMemo } from 'react'
import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';

// Components
import BaseOptionChart from 'components/Charts/BaseOptionChart';
import { Card, CardHeader, TextField, Box, Button, Stack, Grid } from '@mui/material';
import LoadingModal from 'components/Loadings/LoadingModal'

// Types
import { SelectOptionType } from "_types_/SelectOptionType";

// Utils
import { fNumber } from "utils/formatNumber";

// ----------------------------------------------------------------------

interface Props {
  height?: number;
  title?: string;
  subheader?: string;
  keyX?: string;
  keyY?: string;
  optionsFilter?: SelectOptionType[]
  data: any;
  isLoading?: boolean;
  handleWatchDetail?: () => void
}

export const FILTER_CHART_OPTIONS = [
  { value: "spend", label: "Chi phí" },
  { value: "comment", label: "Bình luận" },
  { value: "cost_per_comment", label: "Chi phi / bình luận" },
  { value: "cost_per_messaging_conversation_started_7d", label: "Chi phí/ tin nhắn" },
  { value: "cost_per_fb_pixel_complete_registration", label: "Chi phí / form" },
];

const BarChartAnalytics = (props: Props) => {
  const {
    height = 700,
    data,
    keyX = 'date',
    keyY = 'spend',
    title = 'Chart',
    optionsFilter = FILTER_CHART_OPTIONS,
    isLoading = false,
    handleWatchDetail
  } = props;
  const [filter, setFilter] = useState(keyY);

  const convertCost = (cost: number) => {
    return cost ? Math.round(cost) : 0;
  };

  const dataChart = useMemo(() => {
    return optionsFilter.map((itemFilter: any) => {
      const newData = data.map((item: any) => convertCost(item[itemFilter.value]))
      return {
        name: itemFilter.label,
        data: newData
      }
    }) || []
  }, [filter, data])

  const categories = useMemo(() => {
    // const newData = data.sort((a: any, b: any) => b[filter] - a[filter])
    return data.map((item: any) => item[keyX].slice(0, 15))
  }, [data])

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      y: {
        formatter: (seriesName: string) => fNumber(seriesName)
      },
      shared: true,
      intersect: false
    },
    plotOptions: {
      bar: { 
        horizontal: true, 
        borderRadius: 2,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: -6
    },
    xaxis: {
      categories,
      labels: {
        formatter(val: number) {
          return fNumber(val);
        }
      }
    }
  });

  return (
    <Grid style={{ position: 'relative' }}>
      {isLoading && <LoadingModal />}
      <Card>
        <CardHeader
          title={title}
          // subheader={subheader}
          action={
            <Stack direction="row" alignItems="center">
              <Box sx={{ padding: "0 24px" }}>
                <TextField
                  select
                  fullWidth
                  value={filter}
                  SelectProps={{ native: true }}
                  onChange={(event) => setFilter(event.target.value)}
                  sx={{
                    '& fieldset': { border: '0 !important' },
                    '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
                    '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
                    '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 }
                  }}
                  style={{ width: 200, marginRight: 10 }}
                >
                  {optionsFilter.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  onClick={handleWatchDetail}
                  sx={{ fontSize: 10 }}
                >
                  Xem thêm
                </Button>
              </Box>
            </Stack>
          }
        />
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart
            type="bar"
            series={dataChart}
            options={chartOptions}
            height={height}
          />
        </Box>
      </Card>
    </Grid>
  );
}

export default BarChartAnalytics