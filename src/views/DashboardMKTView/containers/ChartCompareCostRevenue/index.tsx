// Libraries
import { useEffect, useState } from "react";
import { map } from "lodash";
import axios, { CancelTokenSource } from "axios";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

// Services
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Components
import BarChart from "components/Charts/BarChart";

// Types
import { MultiResponseType } from "_types_/ResponseApiType";

// Constants
import { FILTER_CHART_OPTIONS_BY_DATE } from "views/DashboardView/constants";
import { yyyy_MM_dd } from "constants/time";
import { fDate } from "utils/dateUtil";
import { excludeContentAdsStartWith } from "views/DashboardMKTView/constants";
interface Props {
  params?: {
    dateValue?: number | string;
    date_from: string;
    date_to: string;
    exclude_content_ads_start_with: string[]
    
  };
  isRefresh?: boolean;
  isInView?: boolean;
}

let cancelRequest: CancelTokenSource;

const ChartCompareCostRevenue = (props: Props) => {
  const {
    isRefresh,
    params = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
      exclude_content_ads_start_with : excludeContentAdsStartWith
    },
    isInView = false,
  } = props;
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (isInView) {
      getDataChart({
        date_from: format(subDays(new Date(), 7), yyyy_MM_dd),
        date_to: format(subDays(new Date(), 1), yyyy_MM_dd),
      });
    }

    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, [isInView]);

  useDidUpdateEffect(() => {
    if (isInView) {
      getDataChart();
    }
  }, [params, isRefresh]);

  const getDataChart = async (paramsAgrs: Partial<any> = {}) => {
    if (cancelRequest) {
      cancelRequest.cancel();
    }

    cancelRequest = axios.CancelToken.source();

    setLoading(true);
    const result = await dashboardMkt.get<MultiResponseType<any>>(
      {
        date_from: params.date_from,
        date_to: params.date_to,
        limit: 1000,
        cancelToken: cancelRequest.token,
        ordering: "date",
        ...paramsAgrs,
      },
      `report/date/v2/`
    );
    if (result && result.data) {
      const newResult = map(
        result.data.results,
        (item: { total_spend_per_revenue_ads: number; date: string }) => ({
          ...item,
          date: fDate(item.date),
        })
      );

      setData(newResult || []);
    }
    setLoading(false);
  };

  return (
    <BarChart
      title="Bảng so sánh Chi phí/Doanh thu"
      data={data}
      defaultFilter={{
        filterOne: "revenue_ads",
        filterTwo: "total_spend",
      }}
      isShowFilter={false}
      isLoading={isLoading}
      optionsFilter={FILTER_CHART_OPTIONS_BY_DATE}
    />
  );
};
export default ChartCompareCostRevenue;
