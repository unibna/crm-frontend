// Libraries
import axios, { CancelTokenSource } from "axios";
import { useEffect, useMemo, useReducer, useState } from "react";

// Components
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import FunctionsIcon from "@mui/icons-material/Functions";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import PixIcon from "@mui/icons-material/Pix";
import StorageIcon from "@mui/icons-material/Storage";
import { Theme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

// Constants & Utils
import { yyyy_MM_dd } from "constants/time";
import { USER_ROLE_CODES } from "constants/userRoles";
import { chooseParams } from "utils/formatParamsUtil";
import Metric, { MetricProps } from "../Metric";
import {
  actionType,
  arrayFieldConvertSecondsToTimeString,
  arrayFieldFormatCurrency,
  arrayFieldFormatNumber,
  arrayFieldFormatPercent,
} from "../../constants";

// Types
import { InitialStateReport } from "_types_/FacebookType";
import { BaseResponseType, MultiResponseType } from "_types_/ResponseApiType";
import { SaleReportTelesaleUser } from "_types_/SaleReportType";

// Services
import { saleApi } from "_apis_/sale.api";

// Stores
import { userApi } from "_apis_/user.api";
import { UserType } from "_types_/UserType";
import { fPercent, fShortenNumber } from "utils/formatNumber";

//Hooks
import { MultiSelect, DropdownMultiSelect } from "components/Selectors";
import { ALL_OPTION } from "constants/index";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import useAuth from "hooks/useAuth";
import { fDateTime, fSecondsToTimeString } from "utils/dateUtil";

export const metricsData: any = (theme: Theme) => [
  {
    title: "Tổng lead được chia",
    name: "total_lead_assigned",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.success.light,
  },
  {
    title: "Tổng lead data nóng được chia",
    name: "hot_lead_assigned",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.info.light,
  },
  {
    title: "Tổng lead data lạnh được chia",
    name: "cold_lead_assigned",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.error.light,
  },
  {
    title: "Tổng lead đã XL",
    name: "total_lead_processed",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.warning.light,
  },
  {
    title: "Tổng lead data lạnh đã XL",
    name: "cold_lead_processed",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.success.light,
  },
  {
    title: "Tổng lead data nóng đã XL",
    name: "hot_lead_processed",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.info.light,
  },
  {
    title: "Tỷ lệ chốt data nóng",
    name: "hot_lead_is_buy_ratio",
    value: 0,
    icon: <DonutLargeIcon />,
    color: theme.palette.error.light,
  },
  {
    title: "Tỷ lệ chốt data lạnh",
    name: "cold_lead_is_buy_ratio",
    value: 0,
    icon: <DonutLargeIcon />,
    color: theme.palette.warning.light,
  },
  {
    title: "Tổng lead data lạnh có mua",
    name: "cold_lead_processed_is_buy",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.success.light,
  },
  {
    title: "Tổng lead data nóng có mua",
    name: "hot_lead_processed_is_buy",
    value: 0,
    icon: <FunctionsIcon />,
    color: theme.palette.info.light,
  },

  {
    title: "Tỷ lệ kcl data nóng",
    name: "hot_lead_not_qualified_ratio",
    value: 0,
    icon: <DonutLargeIcon />,
    color: theme.palette.error.light,
  },
  {
    title: "Tỷ lệ kcl data lạnh",
    name: "cold_lead_not_qualified_ratio",
    value: 0,
    icon: <DonutLargeIcon />,
    color: theme.palette.warning.light,
  },
  {
    title: "Tổng doanh thu",
    name: "total_revenue",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.success.light,
  },
  {
    title: "Doanh thu data lạnh",
    name: "cold_revenue",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.info.light,
  },
  {
    title: "Doanh thu data nóng",
    name: "hot_revenue",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.error.light,
  },
  {
    title: "Tổng đơn hàng",
    name: "total_order",
    value: 0,
    icon: <PixIcon />,
    color: theme.palette.warning.light,
  },
  {
    title: "Đơn hàng data nóng",
    name: "hot_order",
    value: 0,
    icon: <PixIcon />,
    color: theme.palette.success.light,
  },
  {
    title: "Đơn hàng data lạnh",
    name: "cold_order",
    value: 0,
    icon: <PixIcon />,
    color: theme.palette.info.light,
  },
  {
    title: "AOV data nóng",
    name: "hot_data_aov",
    value: 0,
    icon: <AttachMoneyIcon />,
    color: theme.palette.error.light,
  },
  {
    title: "AOV data lạnh",
    name: "cold_data_aov",
    value: 0,
    icon: <AttachMoneyIcon />,
    color: theme.palette.warning.light,
  },
  {
    title: "Talk time",
    name: "talktime",
    value: 0,
    icon: <HeadsetMicIcon />,
    color: theme.palette.success.light,
  },
  {
    title: "Talktime trung bình",
    name: "talktime_per_tls",
    value: 0,
    icon: <HeadsetMicIcon />,
    color: theme.palette.info.light,
  },
  {
    title: "Data xử lý trung bình",
    name: "lead_processed_per_tls",
    value: 0,
    icon: <StorageIcon />,
    color: theme.palette.error.light,
  },
  {
    title: "Doanh thu trung bình",
    name: "revenue_per_tls",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.warning.light,
  },
  {
    title: "TB doanh thu data nóng",
    name: "hot_data_revenue_per_lead",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.success.light,
  },
  {
    title: "TB doanh thu data lạnh",
    name: "cold_data_revenue_per_lead",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.info.light,
  },
  {
    title: "Cuộc gọi đến",
    name: "inbound",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.error.light,
  },
  {
    title: "Cuộc gọi đi",
    name: "outbound",
    value: 0,
    icon: <CurrencyExchangeIcon />,
    color: theme.palette.warning.light,
  },
];

export const DEFAULT_FILTER_METRIC: (string | number)[] = [
  "total_lead_processed",
  "cold_lead_processed",
  "hot_lead_processed",
  "cold_revenue",
  "hot_revenue",
  "talktime_per_tls",
  "revenue_per_tls",
  "lead_processed_per_tls",
];

export interface MetricsProps {
  params?: {
    dateValue?: number | string;
    date_from: string;
    date_to: string;
  };
  isRefresh?: boolean;
  isInView?: boolean;
}

const initState: InitialStateReport = {
  data: [],
  loading: false,
  params: {
    page: 1,
    limit: 200,
    ordering: "-date",
  },
  dataTotal: 0,
  totalRow: {},
};

const storeChartReportByDate = (state: InitialStateReport, action: any) => {
  if (action && action.type) {
    const { payload = {} } = action;
    switch (action.type) {
      case actionType.UPDATE_DATA: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_DATA_TOTAL: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_LOADING: {
        return {
          ...state,
          ...payload,
        };
      }
      case actionType.UPDATE_PARAMS: {
        return {
          ...state,
          params: {
            ...state.params,
            ...payload,
          },
        };
      }
      case actionType.UPDATE_TOTAL_ROW: {
        return {
          ...state,
          ...payload,
        };
      }
    }
  }
};

let cancelRequest: CancelTokenSource;

function Metrics(props: MetricsProps) {
  const {
    isRefresh,
    params: paramsAll = {
      date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
      date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    },
    isInView = false,
  } = props;

  const theme = useTheme();
  const tempArrayMetric: MetricProps[] = metricsData(theme);
  const [state, dispatch] = useReducer(storeChartReportByDate, initState);

  const { user } = useAuth();

  const isSale = user?.group_permission?.code === USER_ROLE_CODES.ROLE_SALES;

  const { params, totalRow } = state;

  const [listSeller, setListSeller] = useState<UserType[]>([]);
  const [metricsShow, setMetricsShow] = useState<(string | number)[]>(DEFAULT_FILTER_METRIC);
  const [filter, setFilter] = useState<{
    seller?: string[];
    team?: string[];
  }>({
    seller: [],
    team: [],
  });

  const optionFilterShowMetric: { label: string; value: string | number }[] = useMemo(
    () =>
      tempArrayMetric.map((metric) => ({
        label: metric.title,
        value: metric.name,
      })),
    [tempArrayMetric]
  );

  const arrayMetricData = useMemo(
    () =>
      (totalRow &&
        tempArrayMetric.map((metric) => {
          const value = totalRow[metric.name];
          const valueFormat =
            value && arrayFieldFormatNumber.includes(metric.name)
              ? fShortenNumber(value)
              : arrayFieldFormatCurrency.includes(metric.name)
              ? fShortenNumber(value)
              : arrayFieldConvertSecondsToTimeString.includes(metric.name)
              ? fSecondsToTimeString(+value)
              : arrayFieldFormatPercent.includes(metric.name)
              ? fPercent(value)
              : value || 0;
          return {
            ...metric,
            value: valueFormat,
          };
        })) ||
      tempArrayMetric,
    [totalRow, tempArrayMetric]
  );

  const handleChangeFilter = (value: any) => (type: string) => {
    setFilter({
      ...filter,
      [type]: value,
    });
  };

  const loadDataTable = () => {
    const objParams = {
      ...params,
      ...paramsAll,
      handle_by: filter.seller || [],
    };

    const newParams = chooseParams(objParams, ["date_from", "date_to", "handle_by"]);

    if (isInView) {
      getMetricsData(newParams);
    }
  };

  const getMetricsData = async (params: any) => {
    if (params) {
      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: true,
        },
      });

      if (cancelRequest) {
        cancelRequest.cancel();
      }

      cancelRequest = axios.CancelToken.source();

      const result = await saleApi.get<MultiResponseType<SaleReportTelesaleUser>>(
        {
          ...params,
          cancelToken: cancelRequest.token,
        },
        `date/`
      );

      if (result && result.data) {
        const { results = [], count, total = {} } = result.data;
        const newData = (results || []).map((item: any) => {
          return {
            ...item,
          };
        });

        dispatch({
          type: actionType.UPDATE_DATA,
          payload: {
            data: newData,
          },
        });

        dispatch({
          type: actionType.UPDATE_DATA_TOTAL,
          payload: {
            dataTotal: count,
          },
        });

        dispatch({
          type: actionType.UPDATE_TOTAL_ROW,
          payload: {
            totalRow: total,
          },
        });
      }

      dispatch({
        type: actionType.UPDATE_LOADING,
        payload: {
          loading: false,
        },
      });
    }
  };

  const getListSeller = async () => {
    if (cancelRequest) {
      cancelRequest.cancel();
    }
    cancelRequest = axios.CancelToken.source();

    const result: BaseResponseType<UserType[]> = await userApi.getAllTelesalesUser({
      params: { limit: 1000 },
    });

    if (result && result.data) {
      setListSeller(result.data);
    }
  };

  useEffect(() => {
    getListSeller();
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    loadDataTable();
  }, [params, paramsAll, isRefresh, isInView, filter]);

  useEffect(() => {
    isSale &&
      setFilter({
        ...filter,
        seller: [user?.name || "all"],
      });
  }, [isSale]);

  return (
    <Card
      sx={{
        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        boxShadow:
          "rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",
        borderRadius: "16px",
        padding: "16px",
      }}
    >
      <CardHeader
        title={
          <Stack direction="column">
            <Typography sx={{ fontWeight: 700, lineHeight: 1.5, mb: 1 }}>Thống kê</Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.8125rem" }}>{`Cập nhật lần cuối: ${
              totalRow?.last_update_at ? fDateTime(totalRow?.last_update_at) : "---"
            }`}</Typography>
          </Stack>
        }
        action={
          <Stack spacing={2} direction="row">
            {!isSale && (
              <MultiSelect
                outlined
                options={[
                  ALL_OPTION,
                  ...listSeller.map((option) => ({
                    label: option.name,
                    value: option.name,
                  })),
                ]}
                onChange={(values) => handleChangeFilter(values)("seller")}
                title="Telesale"
                placeholder="Nhập tên telesale"
                selectorId="telesales"
              />
            )}

            <DropdownMultiSelect
              title="Lọc chỉ số"
              options={optionFilterShowMetric}
              values={metricsShow}
              setValues={setMetricsShow}
              defaultValues={DEFAULT_FILTER_METRIC}
            />
          </Stack>
        }
        sx={{ padding: "16px" }}
      />
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {arrayMetricData?.map(
            (metric: MetricProps, index: number) =>
              metricsShow.includes(metric.name) && (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Metric {...metric} key={index} />
                </Grid>
              )
          )}
        </Grid>
      </Box>
    </Card>
  );
}

export default Metrics;
