// Libraries
import { useEffect, useState } from "react";
import axios, { CancelTokenSource } from "axios";

// Services
import { reportMarketing } from "_apis_/marketing/report_marketing.api";

// Hooks
import useResponsive from "hooks/useResponsive";

// Components
import PieChart from "components/Charts/PieChart";

// Constants
import {
  FILTER_CHART_OPTIONS_PERFORMANCE_MATKETER,
  typeFilterPerformanceMarketer,
  FILTER_DATA_OPTIONS_PERFORMANCE_MATKETER,
} from "views/DashboardMKTView/constants";
import { chooseParams } from "utils/formatParamsUtil";
import { yyyy_MM_dd } from "constants/time";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { objectiveFacebook } from "constants/index";
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

const PerformanceMarketer = (props: Props) => {
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
  const [totalData, setTotalData] = useState();
  const [filterReport, setFilterReport] = useState(typeFilterPerformanceMarketer.TOTAL);
  const isMobile = useResponsive("down", "sm");

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      const dataCallApi: any = handleFilterData();
      getDataChart(dataCallApi.params, dataCallApi.endpoint);
    }
  }, [params, isRefresh, isInView, filterReport]);

  const handleParams = (arrTakeItem: string[] = [], objective: string[] = []) => {
    const objParams = {
      ...params,
      date_from: params.date_from,
      date_to: params.date_to,
      objective,
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to", ...arrTakeItem]);

    return newParams;
  };

  const handleFilterData = () => {
    let params: any = [];
    let endpoint: string | string[] = [];
    switch (filterReport) {
      case typeFilterPerformanceMarketer.FACEBOOK_CONVERSION: {
        params = [handleParams(["objective"], objectiveFacebook.CONVERSIONS)];
        endpoint = ["facebook/marketer/"];
        break;
      }
      case typeFilterPerformanceMarketer.FACEBOOK_MESSAGE: {
        params = [handleParams(["objective"], objectiveFacebook.MESSAGES)];
        endpoint = ["facebook/marketer/"];
        break;
      }
      case typeFilterPerformanceMarketer.GOOGLE: {
        params = [handleParams()];
        endpoint = ["google/marketer/"];
        break;
      }
      case typeFilterPerformanceMarketer.TOTAL: {
        params = [handleParams(["objective"], objectiveFacebook.CONVERSIONS), handleParams()];
        endpoint = ["facebook/marketer/", "google/marketer/"];
      }
    }

    return {
      params,
      endpoint,
    };
  };

  const getDataChart = async (params: any, endpoint: string[]) => {
    if (cancelRequest) {
      cancelRequest.cancel();
    }

    cancelRequest = axios.CancelToken.source();

    setLoading(true);

    const results = await Promise.all(
      params.map((item: any, index: number) => {
        const result: any = reportMarketing.get(
          {
            ...item,
            cancelToken: cancelRequest.token,
          },
          endpoint[index]
        );

        return result;
      })
    );

    if (results && results.length) {
      let arrTotal: any = [];
      const newResults = results.reduce((prevArr: any, current: any) => {
        arrTotal = getObjectPropSafely(() => current?.data?.total)
          ? [...arrTotal, current.data.total]
          : arrTotal;
        return [...prevArr, ...getObjectPropSafely(() => current.data.results)];
      }, []);

      setTotalData(caculateTotalData(arrTotal));
      setData(convertDataChart(newResults));
    }

    setLoading(false);
  };

  const caculateTotalData = (arrTotal: any) => {
    return arrTotal.length
      ? arrTotal.reduce((prevObj: any, current: any) => {
          return {
            ...prevObj,
            spend: (prevObj.spend = (prevObj.spend || 0) + (current.spend || current.cost || 0)),
            revenue: (prevObj.revenue =
              (prevObj.revenue || 0) + (current.total_revenue || current.ladi_revenue || 0)),
            total_phone: (prevObj.total_phone =
              (prevObj.total_phone || 0) + (current.total_phone || current.ladi_phone || 0)),
            total_qualified: (prevObj.total_qualified =
              (prevObj.total_qualified || 0) +
              (current.total_qualified || current.ladi_qualified || 0)),
          };
        }, {})
      : {};
  };

  const convertDataChart = (dataApi: any) => {
    let objValueMarketer = {};
    dataApi.forEach((current: any) => {
      if (objValueMarketer[current.marketer]) {
        objValueMarketer[current.marketer] = {
          ...objValueMarketer[current.marketer],
          spend: (objValueMarketer[current.marketer].spend += current.spend || current.cost || 0),
          revenue: (objValueMarketer[current.marketer].revenue +=
            current.total_revenue || current.ladi_revenue || 0),
          total_phone: (objValueMarketer[current.marketer].total_phone +=
            current.total_phone || current.ladi_phone || 0),
          total_qualified: (objValueMarketer[current.marketer].total_qualified +=
            current.total_qualified || current.ladi_qualified || 0),
        };
      } else {
        objValueMarketer[current.marketer] = {
          marketer: current.marketer,
          spend: current.spend || current.cost || 0,
          revenue: current.total_revenue || current.ladi_revenue || 0,
          total_phone: current.total_phone || current.ladi_phone || 0,
          total_qualified: current.total_qualified || current.ladi_qualified || 0,
        };
      }
    });

    return dataApi.length ? [...Object.values(objValueMarketer)] : [];
  };

  return (
    <PieChart
      title={!isMobile ? "Hiệu suất Digital" : ""}
      data={data}
      defaultFilter={{
        filterOne: "spend",
      }}
      styleFilter={{ width: 170 }}
      keyFilter="marketer"
      totalData={totalData}
      isLoading={isLoading}
      optionsFilter={FILTER_CHART_OPTIONS_PERFORMANCE_MATKETER}
      optionsFilterData={FILTER_DATA_OPTIONS_PERFORMANCE_MATKETER}
      handleChangeFilterData={(value: string) => setFilterReport(value)}
    />
  );
};
export default PerformanceMarketer;
