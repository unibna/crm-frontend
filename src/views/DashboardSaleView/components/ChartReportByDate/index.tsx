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
import { FILTER_CHART_OPTIONS_BY_DATE } from "views/SaleOnlineReportView/constants";
import { yyyy_MM_dd } from "constants/time";
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
}

let cancelRequest: CancelTokenSource;

const ChartReportByDate = (props: Props) => {
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
  }, [params, isRefresh, isInView]);

  const getDataChart = async () => {
    if (cancelRequest) {
      cancelRequest.cancel();
    }

    cancelRequest = axios.CancelToken.source();

    setLoading(true);
    const result = await saleApi.get<MultiResponseType<SaleReportTelesaleUser>>(
      {
        date_from: params.date_from,
        date_to: params.date_to,
        limit: 1000,
        cancelToken: cancelRequest.token,
        ordering: "date",
      },
      `date/`
    );
    if (result && result.data) {
      setData(result.data.results || []);
    }
    setLoading(false);
  };

  return (
    <LineChart
      title="Báo cáo hoạt động của phòng theo ngày"
      data={data}
      defaultFilter={{
        filterOne: "Tổng doanh thu",
      }}
      isLoading={isLoading}
      optionsFilter={FILTER_CHART_OPTIONS_BY_DATE}
      singleLine
    />
  );
};
export default ChartReportByDate;
