import format from "date-fns/format";
import subDays from "date-fns/subDays";
import find from "lodash/find";
import map from "lodash/map";

// Components
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { Span, LabelColor } from "components/Labels";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

// Constants
import { yyyy_MM_dd } from "constants/time";
import { SelectOptionType } from "_types_/SelectOptionType";
import { fNumber, fPercentOmitDecimal, fValueVnd } from "utils/formatNumber";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { TYPE_FORM_FIELD } from "constants/index";
import { fDate } from "utils/dateUtil";
import { PATH_DASHBOARD } from "routes/paths";
import { ROLE_TAB, STATUS_ROLE_CONTENT_DAILY } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";
import { ContentIdType } from "_types_/ContentIdType";
import { ContentDailyDefaultType } from "_types_/ContentDailyType";
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
  "cancelToken",
  "ad_name",
  "platform",
  "default",
  "rows",
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
  "cost_per_phone_qualified",
  "inbox_revenue",
  "total_expense",
  "cost_per_total_qualified_avg",
  "cost_per_fb_pixel_complete_registration",
  "cost_per_messaging_conversation_started_7d",
  "cost_per_conversion",
  "campaign_budget",
  "ladi_revenue",
];

export const arrAttachUnitPercent = [
  "total_expense_per_total_revenue",
  "engagement_rate",
  "view_rate",
  "clickthrough_rate",
  "total_buy_rate_processed",
  "15s_watch_rate",
];

export const arrDate = ["created_date", "created"];

export const arrDateTime = ["phone_created", "created_time"];

export const arrColumnHandleLink = ["body", "phone_order_number"];

export const arrColumnThumbImg = ["content_id"];

export const arrColumnEditLabel = ["status"];

export const arrColumnBool = ["is_seeding", "campaign_status"];

export const arrColumnOptional = [
  "cost_per_total_qualified",
  "cost_per_phone_qualified",
  "classification",
  "lead_status",
  "total_expense_per_total_revenue",
  "created_date_show",
  "ad_name_show",
];

export const arrColumnShowInfo = [
  "spend",
  "fb_pixel_complete_registration",
  "cost_per_fb_pixel_complete_registration",
  "comment",
  "cost_per_comment",
  "15s_watch_rate",
  "avg_watch_time",
  "impressions",
  "post_engagement",
  "video_view",
  "link_click",
  "reach",
  "engagement_rate",
  "view_rate",
  "clickthrough_rate",
  "messaging_conversation_started_7d",
  "cost_per_messaging_conversation_started_7d",

  //
  "content_id",
  "cost",
  "engagements",
  "impressions",
  "reach",
  "views",
  "CPV",
  "CPE",
  "CPM",
  "CPR",
  "campaign_name",
];

export const arrRenderFilterDateDefault = [
  {
    type: TYPE_FORM_FIELD.DATE,
    title: "Thời gian",
    keyDateFrom: "date_from",
    keyDateTo: "date_to",
    keyDateValue: "dateValue",
  },
];

// Convert value default
export const handleDataQualified = (item: any) => {
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
    kol_koc = [],
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
    CPR,
    CPV,
    CPM,
    CPE,
  } = item;

  console.log("🚀 ~ file: index.tsx:228 ~ handleDataQualified ~ kol_koc:", kol_koc);
  return {
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
    kol_koc: kol_koc ? kol_koc?.join(", ") : "",
    impressions: fNumber(impressions),
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
    CPV: fNumber(CPV),
    CPE: fNumber(CPE),
    CPM: fNumber(CPM),
    CPR: fNumber(CPR),
  };
};

export const handleDataChart = (item: ContentIdType) => {
  const { total_orders = 0, total_qualified = 0, total_buy_rate_processed = 0 } = item;

  return {
    total_expense_per_total_revenue: fNumber((item?.total_expense_per_total_revenue || 0) * 100),
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
  {
    columnName: "spend",
    type: "sum",
  },
  {
    columnName: "fb_pixel_complete_registration",
    type: "sum",
  },
  {
    columnName: "cost_per_fb_pixel_complete_registration",
    type: "sum",
  },
  {
    columnName: "comment",
    type: "sum",
  },
  {
    columnName: "cost_per_comment",
    type: "sum",
  },
  {
    columnName: "15s_watch_rate",
    type: "sum",
  },
  {
    columnName: "avg_watch_time",
    type: "sum",
  },
  // {
  //   columnName: "impressions",
  //   type: "sum",
  // },
  {
    columnName: "post_engagement",
    type: "sum",
  },
  {
    columnName: "video_view",
    type: "sum",
  },
  {
    columnName: "link_click",
    type: "sum",
  },
  // {
  //   columnName: "reach",
  //   type: "sum",
  // },
  {
    columnName: "engagement_rate",
    type: "sum",
  },
  {
    columnName: "view_rate",
    type: "sum",
  },
  {
    columnName: "clickthrough_rate",
    type: "sum",
  },
  {
    columnName: "messaging_conversation_started_7d",
    type: "sum",
  },
  {
    columnName: "cost_per_messaging_conversation_started_7d",
    type: "sum",
  },

  //
  { columnName: "cost", type: "sum" },
  { columnName: "engagements", type: "sum" },
  { columnName: "impressions", type: "sum" },
  { columnName: "reach", type: "sum" },
  { columnName: "views", type: "sum" },
  { columnName: "CPV", type: "sum" },
  { columnName: "CPE", type: "sum" },
  { columnName: "CPM", type: "sum" },
  { columnName: "CPR", type: "sum" },
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
  "cost_per_phone_qualified",
  "total_qualified_processed",
  "buy_rate",
  "ladi_qualified",
  "avg_watch_time",
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
    avg_watch_time,
  } = totalRow;

  switch (columnName) {
    case "total_qualified": {
      return `${total_qualified} (${total_processing}) - ${fPercentOmitDecimal(
        total_qualified / total_phone
      )} `;
    }
    case "avg_watch_time": {
      return fNumber(avg_watch_time);
    }
    case "kol_koc": {
      return kol_koc ? kol_koc?.join(", ") : "";
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
              color={colorLabelRanking[getObjectPropSafely(() => cpa_ranking.trim())] || "default"}
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

export const OPTION_PLATFORM = [
  { value: "FACEBOOK", label: "FACEBOOK" },
  { value: "GOOGLE", label: "GOOGLE" },
  { value: "TIKTOK", label: "TIKTOK" },
];

// Value header
export const funcDataRenderHeaderContentDailyDefault = ({
  dataFilterContent,
  dataFilterStatus,
  dataFilterChannel,
}: {
  dataFilterContent: SelectOptionType[];
  dataFilterStatus: SelectOptionType[];
  dataFilterChannel: SelectOptionType[];
}) => {
  return [
    {
      style: {
        width: 200,
      },
      title: "Platform",
      options: [
        {
          label: "Tất cả",
          value: "all",
        },
        ...OPTION_PLATFORM,
      ],
      label: "platform",
      defaultValue: "all",
    },
    ...arrRenderFilterDateDefault,
  ];
};

export const TAB_HEADER_CONTENT_DAILY = (user: Partial<UserType> | null, roles: any) => [
  {
    label: "Tổng quan",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_DAILY]?.[STATUS_ROLE_CONTENT_DAILY.OVERVIEW]}`,
    icon: <ContentPasteIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_DAILY]?.[STATUS_ROLE_CONTENT_DAILY.OVERVIEW]
    ),
  },
  {
    label: "Pivot",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CONTENT_DAILY]?.[STATUS_ROLE_CONTENT_DAILY.PIVOT]}`,
    icon: <ContentPasteIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.CONTENT_DAILY]?.[STATUS_ROLE_CONTENT_DAILY.PIVOT]
    ),
  },
];
