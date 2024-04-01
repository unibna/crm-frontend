// Libraries
import { useEffect, useState } from "react";

import axios, { CancelTokenSource } from "axios";

// Services
import { phoneLeadApi } from "_apis_/lead.api";

// Components
import BarChartHorizontal from "components/Charts/BarChartHorizontal";

// Constants
import { FILTER_CHART_OPTIONS_BUY_RATE_BY_CHANNEL } from "views/DashboardMKTView/constants";
import { chooseParams } from "utils/formatParamsUtil";
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

const BuyRateByChannel = (props: Props) => {
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
      const objParams = {
        ...params,
        created_from: params.date_from,
        created_to: params.date_to,
        dimension: "channel",
        ordering: "-total",
      };

      const newParams = chooseParams(objParams, ["created_from", "created_to", "dimension"]);

      getDataChart(newParams);
    }
  }, [params, isRefresh, isInView]);

  const getDataChart = async (params: any) => {
    if (cancelRequest) {
      cancelRequest.cancel();
    }

    cancelRequest = axios.CancelToken.source();

    setLoading(true);
    const result: any = await phoneLeadApi.getReport({
      params: {
        ...params,
        cancelToken: cancelRequest.token,
      },
    });

    if (result && result.data) {
      const { data = [] } = result;
      setData(data || []);
    }
    setLoading(false);
  };

  return (
    <BarChartHorizontal
      title="Tỉ lệ chốt theo kênh bán hàng"
      data={data}
      defaultFilter={{
        filterOne: "total",
      }}
      keyFilter="channel"
      isLoading={isLoading}
      optionsFilter={FILTER_CHART_OPTIONS_BUY_RATE_BY_CHANNEL}
    />
  );
};
export default BuyRateByChannel;
