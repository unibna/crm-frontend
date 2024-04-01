// Libraries
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import find from "lodash/find";
import map from "lodash/map";
import filter from "lodash/filter";
import sumBy from "lodash/sumBy";

// Services
import { orderApi } from "_apis_/order.api";

// Hooks
import { DetailVariantContext } from "views/ProductView/containers/DetailVariant/context";
import { useCancelToken } from "hooks/useCancelToken";
import useResponsive from "hooks/useResponsive";

// Components
import Grid from "@mui/material/Grid";
import ScoreCard from "components/Charts/ScoreCard";
import BarChart from "components/Charts/BarChart";
import PieChart from "components/Charts/PieChart";
import SkeletonGeneral from "views/ProductView/components/GeneralVariant/SkeletonGeneral";
import RecentCustomer from "views/ProductView/components/GeneralVariant/RecentCustomer";
import RecentOrder from "views/ProductView/components/GeneralVariant/RecentOrder";
import SkeletonRecent from "views/ProductView/components/GeneralVariant/SkeletonRecent";
import BarChartHorizontal from "components/Charts/BarChartHorizontal";

// Constants & Utils
import { OrderType } from "_types_/OrderType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fShortenNumber, fValueVnd } from "utils/formatNumber";
import { chooseParams } from "utils/formatParamsUtil";
import { ReportByProductType } from "_types_/ReportRevenueType";
import { FILTER_CHART_REPORT_BY_PRODUCT } from "views/ReportRevenueView/constants";

// ---------------------------------------------------------
interface Data {
  label: string;
  id: string;
  icon?: any;
  isLoading: boolean;
}

const dataRenderCard: Data[] = [
  {
    label: "Tổng tiền hàng (đã KM)",
    id: "total",
    isLoading: true,
  },
  {
    label: "Tổng tiền hàng (chưa KM)",
    id: "variant_total",
    isLoading: true,
  },
  {
    label: "Số lượng đã bán",
    id: "quantity",
    isLoading: true,
  },
  {
    label: "Giảm giá",
    id: "discount",
    isLoading: true,
  },
  {
    label: "Tồn kho",
    id: "c_inventory",
    isLoading: true,
  },
  {
    label: "TB đơn/ngày(7 ngày)",
    id: "avg_orders",
    isLoading: true,
  },
];

const GeneralVariant = () => {
  const { newCancelToken } = useCancelToken();
  const { params, variantId: variant, isRefresh } = useContext(DetailVariantContext);
  const isMobile = useResponsive("down", "sm");

  const [dataReportProduct, setDataReportProduct] = useState<ReportByProductType[]>([]);
  const [dataProductByChannel, setDataProductByChannel] = useState([]);
  const [dataProductByCustomer, setDataProductByCustomer] = useState<
    {
      customer_name: string;
      customer_phone: string;
      total_order: number;
      total_order__revenue: number;
    }[]
  >([]);
  const [dataOrder, setDataOrder] = useState<OrderType[]>([]);

  const [isLoadingProductByChannel, setLoadingProductByChannel] = useState(false);
  const [isLoadingProductByCustomer, setLoadingProductByCustomer] = useState(false);
  const [isLoadingBarChart, setLoadingBarChart] = useState(false);
  const [isLoadingOrder, setLoadingOrder] = useState(false);
  const [filterRadial, setFilterRadial] = useState("total");

  const revenue = useRef({
    total: 0,
  });

  useEffect(() => {
    const objParams = {
      ...params,
      created_from: params.date_from,
      created_to: params.date_to,
      completed_time_from: params.date_from,
      completed_time_to: params.date_to,
    };

    getDataOverview(
      chooseParams(
        {
          ...objParams,
          limit: 100,
          ordering: "-total",
          dimension: "product",
        },
        ["completed_time_from", "completed_time_to", "dimension"]
      )
    );

    getDataChartChannel(
      chooseParams(
        {
          completed_time_from: params.date_from,
          completed_time_to: params.date_to,
          dimension: "source",
        },
        ["completed_time_from", "completed_time_to", "dimension"]
      )
    );

    getDataChartCustomer(
      chooseParams(
        {
          completed_time_from: params.date_from,
          completed_time_to: params.date_to,
          dimension: "customer",
          limit: 5,
        },
        ["completed_time_from", "completed_time_to", "dimension"]
      )
    );

    getListOrder(
      chooseParams({ ...objParams, limit: 5, status: "completed", ordering: "-created", variant }, [
        "completed_time_from",
        "completed_time_to",
        "variant",
        "status",
      ])
    );
  }, [params, isRefresh]);

  const getDataOverview = async (params: Partial<any>) => {
    setLoadingBarChart(true);

    const result: any = await orderApi.get({
      params: {
        ...params,
        cancelToken: newCancelToken(),
      },
      endpoint: `report/revenue/`,
    });

    if (result && result.data) {
      const { results = [], total } = result.data;

      revenue.current = {
        total,
      };
      setDataReportProduct(results);
    }

    setLoadingBarChart(false);
  };

  const getDataChartChannel = async (params: any) => {
    setLoadingProductByChannel(true);
    const result: any = await orderApi.getId({
      params,
      endpoint: `report/variant/${variant}/`,
    });

    if (result && result.data) {
      const { results = [] } = result.data;
      setDataProductByChannel(results || []);
    }

    setLoadingProductByChannel(false);
  };

  const getDataChartCustomer = async (params: any) => {
    setLoadingProductByCustomer(true);
    const result: any = await orderApi.getId({
      params,
      endpoint: `report/variant/${variant}/`,
    });

    if (result && result.data) {
      const { results = [] } = result.data;

      setDataProductByCustomer(results || []);
    }

    setLoadingProductByCustomer(false);
  };

  const getListOrder = async (params: any) => {
    setLoadingOrder(true);

    if (params) {
      const result: any = await orderApi.get({
        endpoint: "get/all/",
        params: {
          ...params,
          cancelToken: newCancelToken(),
        },
      });

      if (result && result.data) {
        const { results = [] } = result.data;

        setDataOrder(results);
      }
    }
    setLoadingOrder(false);
  };

  const formatValue = (name: string, value: any) => {
    switch (true) {
      case ["total", "variant_total", "discount", "avg_orders"].includes(name): {
        return `${fShortenNumber(value)}`;
      }
      default: {
        return value;
      }
    }
  };

  const formatterTotal = (opts: any) => {
    return fValueVnd(getObjectPropSafely(() => revenue.current.total[filterRadial]) || 0);
  };

  const objReportVariant = useMemo(() => {
    return find(dataReportProduct, (item) => item.variant === variant) || {};
  }, [dataReportProduct]);

  const dataRadialBar = useMemo(() => {
    return [
      { total: objReportVariant[filterRadial] || 0, name: "Sản phẩm" },
      {
        total: sumBy(
          filter(dataReportProduct, (item) => item.variant !== variant),
          (item) => item[filterRadial]
        ),
        name: "Sản phẩm khác",
      },
    ];
  }, [filterRadial, objReportVariant]);

  const newDataCustomer = useMemo(() => {
    return map(dataProductByCustomer, (item) => ({
      name: item.customer_name,
      phone: item.customer_phone,
      revenue: item.total_order__revenue,
    }));
  }, [dataProductByCustomer]);

  const newDataReportProduct = useMemo(
    () => [
      objReportVariant,
      ...filter(dataReportProduct, (item) => item.variant !== variant).slice(0, 5),
    ],
    [dataReportProduct]
  );

  return (
    <Grid container rowSpacing={4}>
      <Grid item container xs={12} spacing={2}>
        {dataRenderCard.map((item, index) => {
          const { label, id, icon } = item;
          const newValue = formatValue(id, objReportVariant[id] || 0);

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={id}>
              {!isLoadingBarChart ? (
                <ScoreCard
                  key={index}
                  title={label}
                  value={newValue}
                  icon={icon}
                  titleStyle={{ width: "100%" }}
                />
              ) : (
                <SkeletonGeneral key={index} />
              )}
            </Grid>
          );
        })}
      </Grid>
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12} md={12} lg={12} xl={6}>
          <BarChartHorizontal
            title="Doanh thu theo kênh bán hàng"
            data={dataProductByChannel}
            defaultFilter={{
              filterOne: "total_order__revenue",
            }}
            isShowFilter={false}
            keyFilter="source__name"
            isLoading={isLoadingProductByChannel}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={6} xl={3}>
          {!isLoadingOrder && <RecentOrder data={dataOrder} />}
          {isLoadingOrder && <SkeletonRecent />}
        </Grid>
        <Grid item xs={12} md={12} lg={6} xl={3}>
          {!isLoadingProductByCustomer && <RecentCustomer data={newDataCustomer} />}
          {isLoadingProductByCustomer && <SkeletonRecent />}
        </Grid>
      </Grid>
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12} md={12} lg={12} xl={4}>
          <PieChart
            title={!isMobile ? "Tỉ lệ doanh thu sản phầm/tổng" : ""}
            data={dataRadialBar}
            defaultFilter={{
              filterOne: filterRadial,
            }}
            isShowFilter={false}
            keyFilter="name"
            totalData={{ total: getObjectPropSafely(() => revenue.current.total[filterRadial]) }}
            isLoading={isLoadingBarChart}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={8}>
          <BarChart
            title="So sánh sản phẩm với 5 sản phầm doanh thu cao nhất"
            data={newDataReportProduct}
            isShowFilter={false}
            defaultFilter={{
              filterOne: "total",
              filterTwo: "variant_total",
            }}
            labelKey="variant_name"
            isLoading={isLoadingBarChart}
            optionsFilter={FILTER_CHART_REPORT_BY_PRODUCT}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GeneralVariant;
