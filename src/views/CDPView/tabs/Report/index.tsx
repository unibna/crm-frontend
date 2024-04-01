import BarChart from "components/Charts/BarChart";
import Paper from "@mui/material/Paper";
import map from "lodash/map";
import { customerApi } from "_apis_/customer.api";
import vi from "locales/vi.json";
import BarChartLegend from "components/Charts/BarChart/BarChartLegend";
import { fNumber } from "utils/formatNumber";
import maxBy from "lodash/maxBy";
import { HEIGHT_DEVICE } from "constants/index";
import { useCallback, useEffect, useState } from "react";

export interface ReportRankType {
  rank_id?: string;
  rank_name?: string;
  rank_range?: number;
  count?: number;
}

const ReportView = () => {
  const [data, setData] = useState<{ label: string; value: number; rank_range?: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    const result = await customerApi.get<ReportRankType>({
      params: {},
      endpoint: "ranking/count/",
    });
    if (result.data) {
      const { data } = result as any;
      const barChartData = formatData(data);
      const dataShift = barChartData.splice(0, 1);
      const dataClone = [...dataShift, ...barChartData.reverse()];
      setData(dataClone);
    }
    setLoading(false);
  }, []);

  const formatData = (data: ReportRankType[]) => {
    let result: { label: string; value: number; rank_range?: number }[] = [];
    map(data, (item) => {
      const rankItem = (item?.rank_name + "") as keyof typeof vi.rank_options;
      result = [
        {
          label: vi.rank_options[rankItem],
          value: item.rank_name ? item.count || 0 : 0,
          rank_range: item.rank_range,
        },
        ...result,
      ];
      return;
    });
    return result;
  };

  const legendData: string[] = map(data, (item, idx) => {
    let result = "";

    switch (data[idx + 1]?.rank_range) {
      case 0:
        result = `${item.label} = 0`;
        break;
      case undefined:
        result = `${item.label} >=${fNumber(item?.rank_range)}`;
        break;
      default:
        result = `${item.label} ${fNumber(item?.rank_range)} - ${fNumber(
          data[idx + 1]?.rank_range
        )}`;
        break;
    }
    return result;
  });

  useEffect(() => {
    getData();
  }, [getData]);

  const maxColumnValue = maxBy(data, "value")?.value || 0;

  return (
    <Paper style={containerStyle} variant="elevation" elevation={3}>
      <BarChartLegend data={legendData} />
      <BarChart
        isLoading={loading}
        data={data}
        isSingleLine
        labelKey="label"
        title="Biểu đồ hạng khách hàng"
        isShowFilter={false}
        defaultFilter={{ filterOne: "value" }}
        height={maxColumnValue <= 200 ? 450 : HEIGHT_DEVICE - 250}
      />
    </Paper>
  );
};

export default ReportView;

const containerStyle = { marginTop: 16, marginBottom: 16 };
