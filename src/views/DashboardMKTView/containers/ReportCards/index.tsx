// Libraries
import { useContext, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios, { CancelTokenSource } from "axios";

// Services
import { dashboardMkt } from "_apis_/marketing/dashboard_marketing.api";

// Hooks
import useSettings from "hooks/useSettings";
import { AttributeContext } from "contexts/AttributeContext";

// Components
import ScoreCard from "components/Charts/ScoreCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import facebookFill from "@iconify/icons-eva/facebook-fill";
import googleFill from "@iconify/icons-eva/google-fill";
import cubeFill from "@iconify/icons-eva/cube-fill";
import gridFill from "@iconify/icons-eva/grid-fill";
import layersFill from "@iconify/icons-eva/layers-fill";
import pieChartFill from "@iconify/icons-eva/pie-chart-fill";
import twitterFill from "@iconify/icons-eva/twitter-fill";
import flashFill from "@iconify/icons-eva/flash-fill";
import dropletFill from "@iconify/icons-eva/droplet-fill";
import image2Fill from "@iconify/icons-eva/image-2-fill";
import filmFill from "@iconify/icons-eva/film-fill";

// Constants
import { fShortenNumber, fPercent, fPercentOmitDecimal } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { excludeContentAdsStartWith } from "views/DashboardMKTView/constants";
interface Props {
  params?: {
    date_from: string;
    date_to: string;
    exclude_content_ads_start_with: string[]
  };
  isRefresh?: boolean;
  isInView?: boolean;
}

interface Data {
  label: string;
  id: string;
  value: number;
  icon?: any;
  isLoading: boolean;
  description?: string;
  subPercent?: number;
}

const ICON_SIZE = {
  width: 32,
  height: 32,
};

const data: Data[] = [
  {
    label: "Doanh thu QC",
    id: "revenue_ads",
    description: "Doanh thu tất cả kênh trừ CRM, Offline, Livestream, Ecom",
    value: 142267000,
    icon: <Icon icon={cubeFill} color="#1877F2" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "Đơn hàng QC",
    id: "order_ads",
    value: 69,
    description: "Tổng đơn đã xác nhận của tất cả kênh",
    icon: <Icon icon={gridFill} color="#FF6C40" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "AOV (Ads)",
    id: "revenue_ads_per_order_ads",
    value: 100,
    description: "Giá trị trung bình đơn",
    icon: <Icon icon={flashFill} color="#04297A" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "CP QC / DT QC",
    id: "total_spend_per_revenue_ads",
    value: 100,
    description: "Chi phí quảng cáo / Doanh thu quảng cáo",
    icon: <Icon icon={dropletFill} color="#bf4397" {...ICON_SIZE} />,
    isLoading: true,
  },

  {
    label: "Tổng SĐTCL (Ads)",
    id: "ads_qualified",
    value: 16708178,
    description: "Tổng SĐTCL mapping được từ Ads",
    icon: <Icon icon={pieChartFill} color="#A48AFF" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "CP / SĐTCL (Ads)",
    id: "total_spend_per_ads_qualified",
    value: 16708178,
    description: "Chi phí quảng cáo / SĐTCL đã xử lý",
    icon: <Icon icon={pieChartFill} color="#A48AFF" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "Tỷ lệ chốt (Ads)",
    id: "ads_buy_rate",
    value: 0.28,
    description: "Tỷ lệ chốt đã xử lý : Có mua / Có mua + Không mua",
    icon: <Icon icon={layersFill} color="#FFC107" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "Tỷ lệ SĐTCL (Ads)",
    id: "ads_qualified_rate",
    value: 40,
    description: "Có mua + Không mua / Tổng SĐT",
    icon: <Icon icon={image2Fill} color="#54D62C" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "Tổng chi phí (Ads)",
    id: "total_spend",
    value: 142267000,
    description: "Tổng chi phí quảng cáo Performance",
    icon: <Icon icon={twitterFill} color="#1C9CEA" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "Chi phí FB (Ads)",
    id: "fb_spend",
    value: 142267000,
    description: "Chi phí quảng cáo Performance FB",
    icon: <Icon icon={facebookFill} color="#1877F2" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "Chi phí GG (Ads)",
    id: "gg_spend",
    value: 142267000,
    description: "Chi phí quảng cáo Performance GG",
    icon: <Icon icon={googleFill} color="#DF3E30" {...ICON_SIZE} />,
    isLoading: true,
  },
  {
    label: "Chi phí Tiktok (Ads)",
    id: "tt_spend",
    value: 142267000,
    description: "Chi phí quảng cáo Performance Tiktok",
    icon: <Icon icon={filmFill} color="#1C9CEA" {...ICON_SIZE} />,
    isLoading: true,
  },
];

const arrUnitVnd = [
  "revenue",
  "total_spend",
  "fb_spend",
  "gg_spend",
  "spend_per_qualified_phone_exclude_crm",
  "total_spend_per_ads_qualified",
  "revenue_ads",
  "revenue_ads_per_order_ads",
  "tt_spend"
];

const arrUnitPercent = [
  "spend_per_revenue",
  "ads_buy_rate",
  "lead_qualified_rate",
  "ads_qualified_rate",
  "total_spend_per_revenue_ads",
];

let cancelRequest: CancelTokenSource;

const ReportCards = (props: Props) => {
  const { isRefresh, params, isInView = false } = props;
  const { themeLayout } = useSettings();
  const isCollapse = themeLayout === "vertical_collapsed";
  const { convertDescription, convertTitle } = useContext(AttributeContext);

  const [dataOverview, setDataOverview] = useState<Data[]>(data);

  useEffect(() => {
    return () => {
      if (cancelRequest) {
        cancelRequest.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isInView) {
      getDataOverview();
    }
  }, [params, isRefresh, isInView]);

  const formatValue = (name: string, value: any) => {
    switch (true) {
      case ["buy_rate"].includes(name): {
        return `${(value * 100).toFixed(1)}`;
      }
      case arrUnitVnd.includes(name): {
        return `${fShortenNumber(value)} đ`;
      }
      case arrUnitPercent.includes(name): {
        return `${fPercent(value)}`;
      }
      default: {
        return value;
      }
    }
  };

  const getDataOverview = async () => {
    const newDataGg = dataOverview.map((item) => {
      return {
        ...item,
        isLoading: true,
      };
    });

    setDataOverview(newDataGg);

    if (cancelRequest) {
      cancelRequest.cancel();
    }

    cancelRequest = axios.CancelToken.source();

    const result: any = await dashboardMkt.get(
      {
        ...params,
        cancelToken: cancelRequest.token,
        exclude_content_ads_start_with: excludeContentAdsStartWith
      },
      "report/date/v2/"
    );

    if (result && result.data) {
      const { total: data = {} } = result.data;

      const newData = dataOverview.map((item) => {
        return {
          ...item,
          subPercent: data["revenue_ads"] / data["revenue"],
          value: getObjectPropSafely(() => data[item.id]) || 0,
          isLoading: false,
        };
      });

      setDataOverview(newData);
    } else {
      const newData = dataOverview.map((item) => {
        return {
          ...item,
          value: 0,
          isLoading: false,
        };
      });

      setDataOverview(newData);
    }
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))` }}>
      <Grid container spacing={[1, 2]}>
        {dataOverview.map((item) => {
          const { label, value, id, icon, isLoading, description, subPercent } = item;
          const newValue = formatValue(id, value);
          const newDescription = convertDescription(id) || description;
          const newTitle = convertTitle(id) || label;

          return (
            <Grid item xs={12} sm={6} md={4} lg={isCollapse ? 3 : 4} xl={3} key={id}>
              <ScoreCard
                title={newTitle}
                value={newValue}
                isLoading={isLoading}
                icon={icon}
                description={newDescription}
                subTitle={id === "revenue_ads" ? "tổng doanh thu" : ""}
                subPercent={subPercent}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ReportCards;
