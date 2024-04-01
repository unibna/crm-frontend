// Libraries
import { useEffect, useState } from "react";
import map from "lodash/map";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

// Services
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";

// Hooks
import useResponsive from "hooks/useResponsive";
import { useCancelToken } from "hooks/useCancelToken";
import { useDidUpdateEffect } from "hooks/useDidUpdateEffect";

// Components
import LineChart from "components/Charts/LineChart";

// Types
import { MultiResponseType } from "_types_/ResponseApiType";
import { ReportByDateType } from "_types_/ReportRevenueType";

// Constants
import { FILTER_CHART_OPTIONS_BY_DATE } from "views/DashboardView/constants";
import { yyyy_MM_dd } from "constants/time";
import { fNumber } from "utils/formatNumber";
interface Props {
  params?: {
    dateValue?: number | string;
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
}

const ChartReportByDate = (props: Props) => {
  const {
    isRefresh,
    params = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;
  const { newCancelToken } = useCancelToken();
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const isMobile = useResponsive("down", "sm");

  useEffect(() => {
    if (isInView) {
      getDataChart({
        date_from: format(subDays(new Date(), 7), yyyy_MM_dd),
        date_to: format(subDays(new Date(), 1), yyyy_MM_dd),
      });
    }
  }, [isInView]);

  useDidUpdateEffect(() => {
    if (isInView) {
      getDataChart();
    }
  }, [params, isRefresh]);

  const getDataChart = async (paramAgrs: Partial<any> = {}) => {
    setLoading(true);
    const result = await dashboardMkt.get<MultiResponseType<any>>(
      {
        date_from: params.date_from,
        date_to: params.date_to,
        limit: 1000,
        cancelToken: newCancelToken(),
        ordering: "date",
        ...paramAgrs,
      },
      `report/date/`
    );
    if (result && result.data) {
      const newData = map(result.data.results, (item: ReportByDateType) => ({
        ...item,
        lead_buy_rate: fNumber((item?.lead_buy_rate || 0) * 100),
        lead_qualified_rate: fNumber((item?.lead_qualified_rate || 0) * 100),
        ads_qualified_rate: fNumber((item?.ads_qualified_rate || 0) * 100),
        ads_buy_rate: fNumber((item?.ads_buy_rate || 0) * 100),
        total_spend_per_revenue_ads: fNumber((item?.total_spend_per_revenue_ads || 0) * 100),
        total_spend_per_revenue: fNumber((item?.total_spend_per_revenue || 0) * 100),
        return_rate: fNumber((item?.return_rate || 0) * 100),
      }));
      setData(newData || []);
    }
    setLoading(false);
  };

  return (
    <LineChart
      title={!isMobile ? "Báo cáo theo ngày" : ""}
      data={data}
      defaultFilter={{
        filterOne: "Tổng doanh thu",
        filterTwo: "Doanh thu Quảng cáo",
      }}
      isLoading={isLoading}
      optionsFilter={FILTER_CHART_OPTIONS_BY_DATE}
    />
  );
};
export default ChartReportByDate;
