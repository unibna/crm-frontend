// Libraries
import { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";

// Services
import { saleApi } from "_apis_/sale.api";

// Components
import LineChart from "components/Charts/LineChart";

// Types
import { MultiResponseType } from "_types_/ResponseApiType";
import { SaleReportTelesaleUser } from "_types_/SaleReportType";

// Constants
import { yyyy_MM_dd } from "constants/time";
import { FILTER_CHART_TOTAL_OPTIONS_BY_DATE } from "../../constants";
import { chooseParams } from "utils/formatParamsUtil";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

interface Props {
  params?: {
    dateValue?: number | string;
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
  dimensions?: string[];
}

let cancelRequest: CancelTokenSource;

const ChartReportTotalByDate = (props: Props) => {
  const {
    isRefresh,
    params = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [arrFilterName, setArrFilterName] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      getDataChart();
    }
  }, [params, isRefresh, isInView, arrFilterName]);

  const getDataChart = async () => {
    if (cancelRequest) {
      cancelRequest.cancel();
    }

    cancelRequest = axios.CancelToken.source();

    setLoading(true);

    const objParams = {
      // dimension: [...revenueDimensions
      //   .filter((dimension) => arrFilterName.includes(dimension.label))
      //   .map((dimension) => dimension.value),'processed_date'],
      dimension: ["processed_date"],
      assigned_from: params.date_from,
      assigned_to: params.date_to,
    };

    const newParams = chooseParams(objParams, ["assigned_from", "assigned_to", "dimension"]);

    const result = await saleApi.get<MultiResponseType<SaleReportTelesaleUser>>(
      {
        ...newParams,
        limit: 1000,
        cancelToken: cancelRequest.token,
        ordering: "processed_date",
      },
      `manager/pivot/`
    );
    if (result && result.data) {
      setData(result.data.results || []);
    }
    setLoading(false);
  };

  return (
    <LineChart
      title="Báo cáo kết quả kinh doanh theo thời gian"
      data={data}
      defaultFilter={{
        filterOne: "Doanh thu",
      }}
      isLoading={isLoading}
      optionsFilter={FILTER_CHART_TOTAL_OPTIONS_BY_DATE}
      singleLine
      keyFilter="processed_date"
      getFilter={setArrFilterName}
    />
  );
};
export default ChartReportTotalByDate;
