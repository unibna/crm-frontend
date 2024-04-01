import format from "date-fns/format";
import subDays from "date-fns/subDays";
import find from "lodash/find";
import map from "lodash/map";

// Components
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { Span, LabelColor } from "components/Labels";
import GoogleIcon from "@mui/icons-material/Google";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DialpadIcon from "@mui/icons-material/Dialpad";
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import SettingsIcon from "@mui/icons-material/Settings";
import FacebookIcon from "@mui/icons-material/Facebook";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";

// Constants
import { yyyy_MM_dd } from "constants/time";
import { SelectOptionType } from "_types_/SelectOptionType";
import { fNumber, fPercentOmitDecimal, fValueVnd } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  ALL_OPTION,
  KOL_NAME_OPTIONS,
  TYPE_FORM_FIELD,
  arrRenderFilterDateDefault,
} from "constants/index";
import { fDate } from "utils/dateUtil";
import { PATH_DASHBOARD } from "routes/paths";
import { ROLE_TAB, STATUS_ROLE_CONTENT_ID } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";
import { ContentIdType } from "_types_/ContentIdType";
import { UserType } from "_types_/UserType";

export const titlePopupHandle = {
  ADD_PRODUCT: "Thêm mới",
  DELETE_PRODUCT: "Xóa",
  EDIT_PRODUCT: "Chỉnh sửa",
  ADD_RULE: "Thêm mới rule",
  DELETE_RULE: "Xóa rule",
  EDIT_RULE: "Chỉnh sửa rule",
  SHOW_UPLOAD_LOGS: "Lịch sử Upload",
};

export const colorLabelRanking: {
  A: LabelColor;
  B: LabelColor;
  C: LabelColor;
  D: LabelColor;
} = {
  A: "success",
  B: "warning",
  C: "info",
  D: "default",
};

export const OBJECTIVE = {
  Mes: "Tin nhắn Faceboook",
  Con: "Chuyển dổi Facebook",
  Pos: "Post Facebook",
  Vid: "Video Facebook",
  Ggl: "Chuyển đổi Google",
};

export const colorLabelStatus = {
  "Không hiệu quả": "info",
  "Giai đoạn 1": "error",
  "Giai đoạn 2": "warning",
  "Giai đoạn 3": "primary",
  "Khuyến Mãi": "default",
  Livestream: "secondary",
};

export const optionCpaRanking = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "A",
    value: "A",
    color: colorLabelRanking.A,
  },
  {
    label: "B",
    value: "B",
    color: colorLabelRanking.B,
  },
  {
    label: "C",
    value: "C",
    color: colorLabelRanking.C,
  },
  {
    label: "D",
    value: "D",
    color: colorLabelRanking.D,
  },
];

export enum TYPE_RANKING {
  CPA = "CPA",
  CPR = "CPR",
}

export const optionRanking = [
  {
    label: "CP/Tổng SDTCL",
    value: TYPE_RANKING.CPA,
  },
  {
    label: "CP/Doanh thu",
    value: TYPE_RANKING.CPR,
  },
];

export const campaignObjective = [
  {
    label: "Youtube chuyển đổi",
    value: "Ggl",
  },
  {
    label: "Facebook chuyển đổi",
    value: "Con",
  },
  {
    label: "Facebook tin nhắn",
    value: "Mes",
  },
];

export enum ADS_TYPE {
  AWARENESS = "Nhận thức",
  CONSIDER = "Cân nhắc",
  CONVERT = "Chuyển đổi",
  NONE = "Chưa có",
}

export const ADS_TYPE_OPTIONS = [
  { label: ADS_TYPE.AWARENESS, value: ADS_TYPE.AWARENESS, color: "rgba(234, 134, 219, 0.6)" },
  { label: ADS_TYPE.CONSIDER, value: ADS_TYPE.CONSIDER, color: "rgba(134, 234, 155, 0.6)" },
  { label: ADS_TYPE.CONVERT, value: ADS_TYPE.CONVERT, color: "rgba(205, 134, 234, 0.6)" },
];

export const CONTENT_TYPE_OPTIONS = [
  { label: "Khách hàng", value: "Khách hàng", color: "rgba(134, 137, 234, 0.6)" },
  { label: "Nghệ sỹ", value: "Nghệ sỹ", color: "rgba(159, 234, 134, 0.6)" },
  { label: "Sản phẩm", value: "Sản phẩm", color: "rgba(134, 217, 234, 0.6)" },
  { label: "Nhà máy", value: "Nhà máy", color: "rgba(234, 150, 134, 0.6)" },
  { label: "Kho hàng/ đóng gói", value: "Kho hàng/ đóng gói", color: "rgba(234, 134, 192, 0.6)" },
  { label: "Telesale", value: "Telesale", color: "rgba(234, 134, 225, 0.6)" },
  { label: "Viral", value: "Viral", color: "rgba(134, 234, 204, 0.6)" },
];

export const PERFORM_ADS_OPTIONS = [
  { value: "total_expense", label: "Tổng chi phí" },
  { value: "total_impressions", label: "Lượt tiếp cận" },
  { value: "total_revenue", label: "Doanh thu" },
  { value: "total_phone", label: "Tổng SĐT*" },
  { value: "total_qualified", label: "Tổng SĐTCL*" },
];

export const TAB_HEADER_DETAIL_BY_PHONE_FACEBOOK = [
  {
    label: "Bình luận",
    value: "comment",
  },
  {
    label: "Inbox",
    value: "inbox",
  },
  {
    label: "Landing Page",
    value: "landing_page",
  },
];

export const valueFilterObjective = {
  CONVERSIONS: "CONVERSIONS",
  MESSAGES: "MESSAGES",
};

export const paramsDefault = {
  dateValue: 0,
  date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
  date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  type: "Message",
  type_phone: "INBOX",
  phone_lead_status: "null",
};

export const paramsGetDefault = [
  "date_from",
  "date_to",
  "content_creator",
  "content_designer",
  "team",
  "product",
  "ad_name",
  // "campaign_objective",
  "cpa_ranking",
  "cpr_ranking",
  "kol_koc",
  // "status",
  "cancelToken",
];

export const message = {
  PLEASE_ENTER_CONTENT_ID: "Vui lòng nhập content ID",
  ATTACH_CONTENT_ID_SUCCESS: "Gắn content ID thành công",
  NOTE_SUCCESS: "Ghi chú thành công",
};

// Arr convert value
export const arrAttachUnitVnd = [
  "cost_per_comment",
  "cost_per_total_phone",
  "spend",
  "spend_conversion",
  "spend_message",
  "spend_livestream",
  "spend_post",
  "cost",
  "total_revenue",
  "fb_cost_per_total_phone",
  "fb_cost_per_total_qualified",
  "fb_total_revenue",
  "gg_cost_per_total_phone",
  "gg_cost_per_total_qualified",
  "cost_per_total_qualified",
  "inbox_revenue",
  "total_expense",
  "cost_per_total_qualified_avg",
  "cost_per_fb_pixel_complete_registration",
  "cost_per_messaging_conversation_started_7d",
  "cost_per_conversion",
  "campaign_budget",
  "ladi_revenue",
  "phone_revenue",
  "cost_per_phone_qualified",
  "cost_per_phone_total",
];

export const arrAttachUnitPercent = [
  "total_expense_per_total_revenue",
  "engagement_rate",
  "view_rate",
  "clickthrough_rate",
  "total_buy_rate_processed",
  "processed_rate",
];

export const arrDate = ["created_date", "created"];

export const arrDateTime = ["phone_created", "created_time"];

export const arrColumnHandleLink = ["body", "phone_order_number", "drive_url"];

export const arrColumnThumbImg = ["content_id"];

export const arrColumnEditLabel = ["status"];

export const arrColumnBool = ["is_seeding", "campaign_status"];

export const arrColumnOptional = [
  "cost_per_total_qualified",
  "classification",
  "lead_status",
  "total_expense_per_total_revenue",
  "created_date_show",
  "ad_name_show",
];

export const arrColumnShowInfo = [
  "total_expense",
  "total_qualified",
  "total_qualified_processed",
  "cost_per_total_qualified",
  "total_expense_per_total_revenue",
  "total_phone",
  "total_phone_processed",
  "total_revenue",
  "total_orders",
  "buy_rate",
  "total_buy_rate_processed",
  "campaign_status",
  "campaign",

  // Total
  "content_id",
  "classification",
  "content_type",
  "status",
  "content_product",
  "ad_name_show",
  "processed_rate",

  // columnShowTotalRevenueByCampaignObject
  "time",
  "cost_per_total_qualified_avg",

  // columnShowSpendSegmentByCampaignObject
  "cost_per_total_phone",

  // columnShowTotalRevenueByDate
  "created_date",

  //
  "adgroup",
  "ad_name",
  "phone",
  "phone_created",
  "lead_status",
  "phone_order_number",
  "created_time",
  "message",
  "sender_name",
  "campaign_name",
  "adset_name",
  "is_seeding",
  "phone_note",
  "phone_reason",

  // columnShowContentIdTotalByProductDetailTeam
  "team",
  "ads_type",
  "total_impressions",
  "cost",
  "spend",
  "spend_conversion",
  "spend_message",
  "spend_livestream",

  // columnShowContentIdTotalByProductDetailObjective
  "campaign_objective",

  // columnShowContentIdFacebookByContentId
  "content_id",
  "ladi_qualified",
  "fb_pixel_complete_registration",
  "cost_per_fb_pixel_complete_registration",
  "comment_qualified",
  "kol_koc",
  "comment",
  "cost_per_comment",
  "inbox_qualified",
  "messaging_conversation_started_7d",
  "cost_per_messaging_conversation_started_7d",
  "comment_phone",
  "inbox_phone",
  "ladi_phone",

  // columnShowContentIdGoogle
  "cost_per_conversion",
  "conversion",
  "clicks",
  "kol_koc",
  "impressions",
  "drive_url",

  //
  "created",
  "phones",
  "type",
  "is_conversion_obj",
  "ad_id",
  "content_id",
  "content_message",
  "content_id_final",
  "content_id_system",
  "page_name",
  "ladi_revenue",
  "campaign_budget",
  "operation",

  // Tiktok
  "phone_revenue",
  "phone_qualified",
  "cost_per_phone_qualified",
  "phone_total",
  "cost_per_phone_total",
];

// Convert value default
export const handleDataQualified = (item: ContentIdType) => {
  const {
    total_processing = 0,
    total_qualified = 0,
    total_phone = 0,
    total_qualified_processed = 0,
    total_phone_processed = 0,
    total_orders = 0,
    ladi_qualified = 0,
    ladi_phone = 0,
    ladi_processing = 0,
    comment_processing = 0,
    comment_qualified = 0,
    kol_koc,
    comment_phone = 0,
    inbox_qualified = 0,
    inbox_processing = 0,
    inbox_phone = 0,
    fb_ladi_qualified = 0,
    fb_ladi_processing = 0,
    fb_ladi_phone = 0,
    fb_total_qualified = 0,
    fb_total_phone = 0,
    fb_total_processing = 0,
    gg_total_qualified = 0,
    gg_total_processing = 0,
    gg_total_phone = 0,
    impressions = 0,
    post_engagement = 0,
    video_view = 0,
    link_click = 0,
    reach = 0,
    avg_watch_time = 0,
    total_impressions = 0,
    total_engagements = 0,
    total_views = 0,
    total_clicks = 0,
    campaign_start_date = 0,
    campaign_end_date = 0,
    cost_per_total_qualified = 0,
    cpa_ranking = "",
    cpr_ranking = "",
    total_expense_per_total_revenue,
  } = item;

  return {
    cost_per_total_qualified: {
      value: cost_per_total_qualified,
      content: (
        <Stack direction="row" spacing={1}>
          {!!cpa_ranking && (
            <Span
              variant="ghost"
              color={
                colorLabelRanking[
                  getObjectPropSafely(() => cpa_ranking.trim()) as keyof typeof colorLabelRanking
                ] || "default"
              }
            >
              {cpa_ranking}
            </Span>
          )}

          <Typography variant="body2" noWrap>
            {fValueVnd(cost_per_total_qualified)}
          </Typography>
        </Stack>
      ),
    },
    total_expense_per_total_revenue: {
      value: total_expense_per_total_revenue,
      content: (
        <Stack direction="row" spacing={1}>
          {!!cpr_ranking && (
            <Span
              variant="ghost"
              color={
                colorLabelRanking[
                  getObjectPropSafely(() => cpr_ranking.trim()) as keyof typeof colorLabelRanking
                ] || "default"
              }
            >
              {cpr_ranking}
            </Span>
          )}

          <Typography variant="body2" noWrap>
            {fPercentOmitDecimal(total_expense_per_total_revenue || 0)}
          </Typography>
        </Stack>
      ),
    },
    campaign_status: !!item.campaign_status,
    total_qualified: `${total_qualified} (${total_processing}) - ${fPercentOmitDecimal(
      total_qualified / total_phone
    )} `,
    total_qualified_processed: `${item.total_qualified_processed} - ${fPercentOmitDecimal(
      total_qualified_processed / total_phone_processed
    )} `,
    buy_rate: isNaN(total_orders / total_qualified)
      ? "0 %"
      : `${((total_orders / total_qualified) * 100).toFixed(0)}%`,
    ladi_qualified: `${ladi_qualified} (${ladi_processing}) - ${fPercentOmitDecimal(
      ladi_qualified / ladi_phone
    )} `,
    comment_qualified: `${comment_qualified} (${comment_processing}) - ${fPercentOmitDecimal(
      comment_qualified / comment_phone
    )} `,
    inbox_qualified: `${inbox_qualified} (${inbox_processing}) - ${fPercentOmitDecimal(
      inbox_qualified / inbox_phone
    )} `,
    total_orders: total_orders || 0,
    fb_ladi_qualified: `${fb_ladi_qualified} (${fb_ladi_processing}) - ${fPercentOmitDecimal(
      fb_ladi_qualified / fb_ladi_phone
    )} `,
    fb_total_qualified: `${fb_total_qualified} (${fb_total_processing}) - ${fPercentOmitDecimal(
      fb_total_qualified / fb_total_phone
    )} `,
    gg_total_qualified: `${gg_total_qualified} (${gg_total_processing}) - ${fPercentOmitDecimal(
      gg_total_qualified / gg_total_phone
    )} `,
    impressions: fNumber(impressions),
    kol_koc: kol_koc ? kol_koc?.join(", ") : "",
    post_engagement: fNumber(post_engagement),
    video_view: fNumber(video_view),
    link_click: fNumber(link_click),
    reach: fNumber(reach),
    avg_watch_time: fNumber(avg_watch_time),
    total_impressions: fNumber(total_impressions),
    total_engagements: fNumber(total_engagements),
    total_views: fNumber(total_views),
    total_clicks: fNumber(total_clicks),
    campaign_start_date: fDate(campaign_start_date),
    campaign_end_date: fDate(campaign_end_date),
  };
};

export const handleDataChart = (item: ContentIdType) => {
  const { total_orders = 0, total_qualified = 0, total_buy_rate_processed = 0 } = item;

  return {
    total_expense_per_total_revenue: fNumber((item?.total_expense_per_total_revenue || 0) * 100),
    processed_rate: fNumber((item?.processed_rate || 0) * 100),
    buy_rate: isNaN(total_orders / total_qualified)
      ? 0
      : `${((total_orders / total_qualified) * 100).toFixed(0)}`,
    total_buy_rate_processed: `${(total_buy_rate_processed * 100).toFixed(0)}%`,
  };
};

export const convertNameInReport = (
  keyMaps: { [key: string]: { name: string; description: string } },
  keyName: string
) => {
  return keyMaps[keyName].name;
};

export const convertDescriptionInReport = (
  keyMaps: { [key: string]: { name: string; description: string } },
  keyName: string
) => {
  return getObjectPropSafely(() => keyMaps[keyName].description) || "";
};

// Summary
export const summaryColumnDefault = [
  { columnName: "buy_rate", type: "sum" },
  { columnName: "total_buy_rate_processed", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
  { columnName: "total_expense", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "total_qualified_processed", type: "sum" },
  { columnName: "total_expense_per_total_revenue", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_phone_processed", type: "sum" },
  { columnName: "classification", type: "sum" },
  { columnName: "total_revenue", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "processed_rate", type: "sum" },

  // ColumnTotalProduct
  { columnName: "total_impressions", type: "sum" },
  { columnName: "total_engagements", type: "sum" },
  { columnName: "total_views", type: "sum" },
  { columnName: "total_clicks", type: "sum" },
  { columnName: "engagement_rate", type: "sum" },
  { columnName: "view_rate", type: "sum" },
  { columnName: "clickthrough_rate", type: "sum" },

  // columnShowContentIdTotalByProductDetailTeam
  { columnName: "cost", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "spend_conversion", type: "sum" },
  { columnName: "spend_message", type: "sum" },
  { columnName: "spend_livestream", type: "sum" },

  // columnShowContentIdFacebookByContentId
  { columnName: "comment", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "comment_qualified", type: "sum" },
  { columnName: "kol_koc", type: "sum" },
  { columnName: "comment_phone", type: "sum" },
  { columnName: "inbox_qualified", type: "sum" },
  { columnName: "inbox_phone", type: "sum" },
  { columnName: "total_post_comments", type: "sum" },
  { columnName: "ladi_qualified", type: "sum" },
  { columnName: "ladi_phone", type: "sum" },
  { columnName: "rate_post_comments_phone", type: "sum" },
  { columnName: "impressions", type: "sum" },
  { columnName: "post_engagement", type: "sum" },
  { columnName: "video_view", type: "sum" },
  { columnName: "link_click", type: "sum" },
  { columnName: "reach", type: "sum" },
  { columnName: "15s_watch_rate", type: "sum" },
  { columnName: "avg_watch_time", type: "sum" },

  // columnShowContentIdGoogleDefault
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "conversion", type: "sum" },
  { columnName: "clicks", type: "sum" },
  { columnName: "ladi_revenue", type: "sum" },

  // columnShowContentIdGoogleDefault
  { columnName: "phone_revenue", type: "sum" },
  { columnName: "phone_qualified", type: "sum" },
  { columnName: "cost_per_phone_qualified", type: "sum" },
  { columnName: "phone_total", type: "sum" },
  { columnName: "cost_per_phone_total", type: "sum" },
];

export const arrFormatSummaryOptionalDefault = [
  "total_qualified",
  "fb_ladi_qualified",
  "comment_qualified",
  "kol_koc",
  "gg_total_qualified",
  "inbox_qualified",
  "fb_total_qualified",
  "classification",
  "cost_per_total_qualified",
  "total_qualified_processed",
  "buy_rate",
  "ladi_qualified",
];

export const handleFormatSummaryDefault = (
  columnName: string | number,
  totalRow: Partial<any>,
  optional?: { dataAttributeRule?: SelectOptionType[] }
) => {
  const {
    fb_ladi_qualified,
    fb_ladi_phone,
    fb_ladi_processing,
    comment_qualified,
    kol_koc,
    comment_phone,
    comment_processing,
    gg_total_qualified,
    gg_total_phone,
    gg_total_processing,
    fb_total_qualified,
    fb_total_phone,
    fb_total_processing,
    inbox_qualified,
    inbox_phone,
    inbox_processing,
    classification = {},
    total_phone,
    total_qualified,
    total_processing,
    total_qualified_processed,
    total_phone_processed,
    cpa_ranking,
    cost_per_total_qualified,
    total_orders,
    ladi_qualified,
    ladi_phone,
    ladi_processing,
  } = totalRow;

  switch (columnName) {
    case "total_qualified": {
      return `${total_qualified} (${total_processing}) - ${fPercentOmitDecimal(
        total_qualified / total_phone
      )} `;
    }
    case "total_qualified_processed": {
      return `${total_qualified_processed} - ${fPercentOmitDecimal(
        total_qualified_processed / total_phone_processed
      )} `;
    }
    case "cost_per_total_qualified": {
      return (
        <Stack direction="row" spacing={1}>
          {!!cpa_ranking && (
            <Span
              variant="ghost"
              color={
                colorLabelRanking[
                  getObjectPropSafely(() => cpa_ranking.trim()) as keyof typeof colorLabelRanking
                ] || "default"
              }
            >
              {cpa_ranking}
            </Span>
          )}
          <Typography variant="body1" fontWeight={700} noWrap>
            {fValueVnd(cost_per_total_qualified)}
          </Typography>
        </Stack>
      );
    }
    case "buy_rate": {
      return isNaN(total_orders / total_qualified)
        ? 0
        : `${((total_orders / total_qualified) * 100).toFixed(0)}%`;
    }
    case "fb_ladi_qualified": {
      return `${fb_ladi_qualified} (${fb_ladi_processing}) - ${fPercentOmitDecimal(
        fb_ladi_qualified / fb_ladi_phone
      )} `;
    }
    case "comment_qualified": {
      return `${comment_qualified} (${comment_processing}) - ${fPercentOmitDecimal(
        comment_qualified / comment_phone
      )} `;
    }
    case "gg_total_qualified": {
      return `${gg_total_qualified} (${gg_total_processing}) - ${fPercentOmitDecimal(
        gg_total_qualified / gg_total_phone
      )} `;
    }
    case "inbox_qualified": {
      return `${inbox_qualified} (${inbox_processing}) - ${fPercentOmitDecimal(
        inbox_qualified / inbox_phone
      )} `;
    }
    case "kol_koc": {
      return kol_koc ? kol_koc?.join(", ") : "";
    }
    case "fb_total_qualified": {
      return `${fb_total_qualified} (${fb_total_processing}) - ${fPercentOmitDecimal(
        fb_total_qualified / fb_total_phone
      )} `;
    }
    case "ladi_qualified": {
      return `${ladi_qualified} (${ladi_processing || 0}) - ${fPercentOmitDecimal(
        ladi_qualified / ladi_phone
      )} `;
    }
    case "classification": {
      const arrClassification = Object.keys(classification);

      return (
        <Stack spacing={1}>
          {map(arrClassification, (current) => (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" component="span">
                {current}
              </Typography>
              <Chip
                size="small"
                label={getObjectPropSafely(() => classification[current])}
                sx={{
                  backgroundColor: find(
                    optional?.dataAttributeRule || [],
                    (option) => option.name === current
                  )?.colorcode,
                  color: "#fff",
                }}
              />
            </Stack>
          ))}
        </Stack>
      );
    }
    default: {
      return `${total_qualified} (${total_processing}) - ${fPercentOmitDecimal(
        total_qualified / total_phone
      )} `;
    }
  }
};

// Props table default
export const propsTableDefault: any = {
  arrAttachUnitVnd,
  arrAttachUnitPercent,
  arrDate,
  arrColumnHandleLink,
  arrColumnThumbImg,
  arrColumnEditLabel,
  arrColumnBool,
  arrDateTime,
  arrColumnOptional,
  // contentOptional: {
  //   arrColumnOptional,
  // },
  contentSummary: {
    arrFormatSummaryOptional: arrFormatSummaryOptionalDefault,
    handleFormatSummary: (columnName: string | number, totalRow: Partial<any>) =>
      handleFormatSummaryDefault(columnName, totalRow),
  },
};

export const TAB_HEADER_DETAIL_BY_PHONE_TOTAL = [
  {
    label: "Bình luận",
    value: "comment",
  },
  {
    label: "Inbox",
    value: "inbox",
  },
  {
    label: "Facebook",
    value: "facebook",
  },
  {
    label: "Google",
    value: "google",
  },
];

// Value header
export const funcDataRenderHeaderDefault = ({
  dataFilterTeam = [],
  dataFilterProduct = [],
}: {
  dataFilterTeam: SelectOptionType[];
  dataFilterProduct: SelectOptionType[];
}) => {
  return [
    {
      style: {
        width: 200,
      },
      title: "Xếp hạng CP/SDTCL",
      options: optionCpaRanking,
      label: "cpa_ranking",
      defaultValue: optionCpaRanking[0].value,
      renderOptionTitleFunc: ({ option }: any) => (
        <>
          {option.value !== "all" ? (
            <Span
              variant="ghost"
              color={
                colorLabelRanking[
                  getObjectPropSafely(() => option.label.trim()) as keyof typeof colorLabelRanking
                ] || "default"
              }
            >
              {option.label}
            </Span>
          ) : (
            <Typography variant="body2">{option.label}</Typography>
          )}
        </>
      ),
    },
    {
      style: {
        width: 200,
      },
      title: "Xếp hạng CP/Doanh thu",
      options: optionCpaRanking,
      label: "cpr_ranking",
      defaultValue: optionCpaRanking[0].value,
      renderOptionTitleFunc: ({ option }: any) => (
        <>
          {option.value !== "all" ? (
            <Span
              variant="ghost"
              color={
                colorLabelRanking[
                  getObjectPropSafely(() => option.label.trim()) as keyof typeof colorLabelRanking
                ] || "default"
              }
            >
              {option.label}
            </Span>
          ) : (
            <Typography variant="body2">{option.label}</Typography>
          )}
        </>
      ),
    },
    {
      style: {
        width: 200,
      },
      title: "KOL/ KOC",
      options: KOL_NAME_OPTIONS,
      label: "kol_koc",
      defaultValue: ALL_OPTION.value,
    },
    {
      style: {
        width: 200,
      },
      title: "Team",
      options: dataFilterTeam,
      label: "team",
      defaultValue: getObjectPropSafely(() => dataFilterTeam[0].value),
    },
    {
      style: {
        width: 200,
      },
      title: "Sản phẩm",
      options: dataFilterProduct,
      label: "product",
      defaultValue: getObjectPropSafely(() => dataFilterProduct[0].value),
    },
    ...arrRenderFilterDateDefault,
  ];
};

export const headerFilterStatusStage = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Không hiệu quả",
    value: "Không hiệu quả",
  },
  {
    label: "Giai đoạn 1",
    value: "Giai đoạn 1",
  },
  {
    label: "Giai đoạn 2",
    value: "Giai đoạn 2",
  },
  {
    label: "Giai đoạn 3",
    value: "Giai đoạn 3",
  },
  {
    label: "Khuyến Mãi",
    value: "Khuyến Mãi",
  },
  {
    label: "Livestream",
    value: "Livestream",
  },
  {
    label: "Test Lại",
    value: "Test Lại",
  },
];

export const headerFilterStatusFacebook = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đang hoạt động",
    value: "ACTIVE",
  },
  {
    label: "Không hoạt động",
    value: "NONE_ACTIVE",
  },
];

export const headerFilterStatusGoogle = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đang hoạt động",
    value: "ENABLED",
  },
  {
    label: "Không hoạt động",
    value: "NON_ENABLED",
  },
];

export const headerFilterObjecttive = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chuyển đổi",
    value: "CONVERSIONS",
  },
  {
    label: "Tin nhắn",
    value: "MESSAGES",
  },
  {
    label: "Bài viết",
    value: "POST_ENGAGEMENT",
  },
  {
    label: "Livestream",
    value: "VIDEO_VIEWS",
  },
];

export const headerFilterType = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Comment",
    value: "Comment",
  },
  {
    label: "Message",
    value: "Message",
  },
];

export const headerFilterContentId = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chưa có",
    value: 0,
  },
  {
    label: "Có",
    value: 1,
  },
];

export const dataRenderHeaderShareFacebook = [
  {
    style: {
      width: 180,
    },
    title: "Trạng thái",
    options: headerFilterStatusFacebook,
    label: "effective_status",
    defaultValue: headerFilterStatusFacebook[0].value,
  },
  {
    style: {
      width: 180,
    },
    title: "Mục tiêu",
    options: headerFilterObjecttive,
    label: "objective",
    defaultValue: headerFilterObjecttive[0].value,
  },
];

export const dataRenderHeaderShareGoogle = [
  {
    style: {
      width: 180,
    },
    title: "Trạng thái",
    options: headerFilterStatusGoogle,
    label: "effective_status",
    defaultValue: headerFilterStatusGoogle[0].value,
  },
  {
    style: {
      width: 180,
    },
    title: "Mục tiêu",
    options: headerFilterObjecttive,
    label: "objective",
    defaultValue: headerFilterObjecttive[0].value,
  },
];

export const TAB_HEADER_REPORT_CONTENT_ID = (user: Partial<UserType> | null, roles: any) => [
  {
    label: "Tổng",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.TOTAL]}`,
    icon: <ContentPasteIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.TOTAL]
    ),
  },
  {
    label: "Facebook",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.FACEBOOK]}`,
    icon: <FacebookIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.FACEBOOK]
    ),
  },
  {
    label: "Google",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.GOOGLE]}`,
    icon: <GoogleIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.GOOGLE]
    ),
  },
  {
    label: "Tiktok",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.TIKTOK]}`,
    icon: <CandlestickChartIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.TIKTOK]
    ),
  },
  {
    label: "Số điện thoại",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.PHONE_LEAD]}`,
    icon: <DialpadIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.PHONE_LEAD]
    ),
  },
  {
    label: "Gán SĐT",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.ATTACH_PHONE]}`,
    icon: <SettingsPhoneIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.ATTACH_PHONE]
    ),
  },
  {
    label: "Pivot",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.PIVOT]}`,
    icon: <SettingsPhoneIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.PIVOT]
    ),
  },
  {
    label: "Cài đặt",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.ATTRIBUTES]}`,
    icon: <SettingsIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_ID]?.[STATUS_ROLE_CONTENT_ID.ATTRIBUTES]
    ),
  },
];
