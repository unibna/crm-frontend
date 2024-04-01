import { ColumnShow, ColumnShowDatagrid } from "_types_/FacebookType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { SummaryItem } from "@devexpress/dx-react-grid";
import { ReportByDateType } from "_types_/ReportRevenueType";
import vi from "locales/vi.json";

export type StatusSyncType = "OH" | "IP" | "RJ" | "CO";

// Type dispatch reducer in component
export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_TAB_HEADER: "UPDATE_TAB_HEADER",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_PARAMS_FILTER: "UPDATE_PARAMS_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_TOP_CONTENT_ID_FACEBOOK_MESSAGE: "UPDATE_TOP_CONTENT_ID_FACEBOOK_MESSAGE",
  UPDATE_TOP_CONTENT_ID_FACEBOOK_CONVERSATION: "UPDATE_TOP_CONTENT_ID_FACEBOOK_CONVERSATION",
  UPDATE_TOP_CONTENT_ID_GOOGLE: "UPDATE_TOP_CONTENT_ID_GOOGLE",
  UPDATE_REPORT_BY_DATE: "UPDATE_REPORT_BY_DATE",
  UPDATE_CONTENT_ID: "UPDATE_CONTENT_ID",
  UPDATE_BUY_RATE_BY_CHANNEL: "UPDATE_BUY_RATE_BY_CHANNEL",
  UPDATE_REVENUE_BY_CHANNEL: "UPDATE_REVENUE_BY_CHANNEL",
  UPDATE_REVENUE_BY_PRODUCT: "UPDATE_REVENUE_BY_PRODUCT",
  RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_MESSAGE: "RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_MESSAGE",
  RESIZE_COLUMN_TOP_CONTENT_ID_TIKTOK_MESSAGE: "RESIZE_COLUMN_TOP_CONTENT_ID_TIKTOK_MESSAGE",
  RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_CONVERSATION:
    "RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_CONVERSATION",
  RESIZE_COLUMN_TOP_CONTENT_ID_TIKTOK_CONVERSATION:
    "RESIZE_COLUMN_TOP_CONTENT_ID_TIKTOK_CONVERSATION",
  RESIZE_COLUMN_TOP_CONTENT_ID_GOOGLE: "RESIZE_COLUMN_TOP_CONTENT_ID_GOOGLE",
  RESIZE_COLUMN_REPORT_BY_DATE: "RESIZE_COLUMN_REPORT_BY_DATE",
  RESIZE_BUY_RATE_BY_CHANNEL: "RESIZE_BUY_RATE_BY_CHANNEL",
  RESIZE_REVENUE_BY_CHANNEL: "RESIZE_REVENUE_BY_CHANNEL",
  RESIZE_REVENUE_BY_PRODUCT: "RESIZE_REVENUE_BY_PRODUCT",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_MESSAGE:
    "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_MESSAGE",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_TIKTOK_MESSAGE:
    "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_TIKTOK_MESSAGE",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_CONVERSATION:
    "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_CONVERSATION",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_TIKTOK_CONVERSATION:
    "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_TIKTOK_CONVERSATION",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_GOOGLE: "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_GOOGLE",
  UPDATE_COLUMN_ORDER_REPORT_BY_DATE: "UPDATE_COLUMN_ORDER_REPORT_BY_DATE",
  UPDATE_COLUMN_ORDER_REVENUE_BY_CHANNEL: "UPDATE_COLUMN_ORDER_REVENUE_BY_CHANNEL",
  UPDATE_COLUMN_ORDER_BUY_RATE_BY_CHANNEL: "UPDATE_COLUMN_ORDER_BUY_RATE_BY_CHANNEL",
  UPDATE_COLUMN_ORDER_REVENUE_BY_PRODUCT: "UPDATE_COLUMN_ORDER_REVENUE_BY_PRODUCT",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
};

export const columnShowFacebookContentIdFilterConversation: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 140 },
    { columnName: "thumb_img", width: 170 },
    { columnName: "cost_per_total_phone", width: 90 },
    { columnName: "total_qualified", width: 110 },
    { columnName: "cost_per_total_qualified", width: 100 },
  ],
  columnsShowHeader: [
    { name: "thumb_img", title: "Nội dung", isShow: true },
    { name: "spend", title: "Chi phí", isShow: true },
    { name: "total_qualified", title: "Tổng SĐTCL", isShow: true },
    { name: "cost_per_total_qualified", title: "CP/Tổng SĐTCL", isShow: true },
  ],
};

export const columnShowTiktokContentIdFilterConversation: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 140 },
    { columnName: "thumb_img", width: 170 },
    { columnName: "phone_qualified", width: 110 },
    { columnName: "cost_per_phone_qualified", width: 100 },
  ],
  columnsShowHeader: [
    { name: "thumb_img", title: "Nội dung", isShow: true },
    { name: "spend", title: "Chi phí", isShow: true },
    { name: "phone_qualified", title: "Tổng SĐTCL", isShow: true },
    { name: "cost_per_phone_qualified", title: "CP/Tổng SĐTCL", isShow: true },
  ],
};

export const columnShowFacebookContentIdFilterMessage: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 140 },
    { columnName: "thumb_img", width: 150 },
    { columnName: "total_qualified", width: 110 },
    { columnName: "cost_per_total_qualified", width: 100 },
  ],
  columnsShowHeader: [
    { name: "thumb_img", title: "Nội dung", isShow: true },
    { name: "spend", title: "Chi phí", isShow: true },
    { name: "total_qualified", title: "Tổng SĐTCL", isShow: true },
    { name: "cost_per_total_qualified", title: "CP/Tổng SĐTCL", isShow: true },
  ],
};

export const columnShowTiktokContentIdFilterMessage: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 140 },
    { columnName: "thumb_img", width: 150 },
    { columnName: "phone_qualified", width: 110 },
    { columnName: "cost_per_phone_qualified", width: 100 },
  ],
  columnsShowHeader: [
    { name: "thumb_img", title: "Nội dung", isShow: true },
    { name: "spend", title: "Chi phí", isShow: true },
    { name: "phone_qualified", title: "Tổng SĐTCL", isShow: true },
    { name: "cost_per_phone_qualified", title: "CP/Tổng SĐTCL", isShow: true },
  ],
};

export const columnShowGoogleContentId: ColumnShow = {
  columnWidths: [
    { columnName: "cost", width: 150 },
    { columnName: "ladi_qualified", width: 120 },
    { columnName: "thumb_img", width: 130 },
    { columnName: "cost_per_total_qualified", width: 110 },
  ],
  columnsShowHeader: [
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "cost",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "ladi_qualified",
      title: "SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP/SĐTCL",
      isShow: true,
    },
  ],
  columnShowTable: [],
};

export const columnShowReportByDate: ColumnShowDatagrid<ReportByDateType> = {
  columnWidths: [
    {
      columnName: "date",
      width: 150,
    },
    {
      columnName: "revenue",
      width: 150,
    },
    {
      columnName: "order_count",
      width: 150,
    },
    {
      columnName: "return_rate",
      width: 150,
    },
    {
      columnName: "revenue_crm",
      width: 150,
    },
    {
      columnName: "revenue_offline",
      width: 150,
    },
    {
      columnName: "revenue_livestream",
      width: 150,
    },
    {
      columnName: "revenue_ecom",
      width: 150,
    },
    {
      columnName: "revenue_ads",
      width: 150,
    },
    {
      columnName: "revenue_per_order",
      width: 150,
    },
    {
      columnName: "total_spend",
      width: 150,
    },
    {
      columnName: "fb_spend",
      width: 150,
    },
    {
      columnName: "gg_spend",
      width: 150,
    },
    {
      columnName: "tt_spend",
      width: 150,
    },
    {
      columnName: "lead_assigned",
      width: 150,
    },
    {
      columnName: "lead_done",
      width: 150,
    },
    {
      columnName: "lead_qualified",
      width: 150,
    },
    {
      columnName: "lead_buy",
      width: 150,
    },
    {
      columnName: "lead_buy_rate",
      width: 150,
    },
    {
      columnName: "lead_qualified_rate",
      width: 150,
    },
    {
      columnName: "ads_phone",
      width: 150,
    },
    {
      columnName: "ads_qualified_rate",
      width: 150,
    },
    {
      columnName: "ads_buy_rate",
      width: 150,
    },
    {
      columnName: "total_spend_per_revenue_ads",
      width: 150,
    },
    {
      columnName: "total_spend_per_ads_qualified",
      width: 150,
    },
    {
      columnName: "ads_qualified",
      width: 150,
    },
    {
      columnName: "ads_qualified",
      width: 150,
    },
    {
      columnName: "total_spend_per_revenue",
      width: 150,
    },
    {
      columnName: "provisional_revenue",
      width: 150,
    },
  ],
  columnsShowHeader: [
    {
      name: "date",
      title: "Ngày",
      isShow: true,
    },
    {
      name: "revenue",
      title: "Tổng doanh thu",
      description: "Tổng doanh thu các đơn đã xác nhận",
      isShow: true,
    },
    {
      name: "provisional_revenue",
      title: "Doanh thu tạm tính",
      description: "Doanh thu tạm tính",
      isShow: true,
    },
    {
      name: "revenue_ads",
      title: "Doanh thu Quảng cáo",
      description: "Doanh thu tất cả kênh trừ CRM, CRM Campaign, Offline, Livestream, Ecom",
      isShow: true,
    },
    {
      name: "revenue_crm",
      title: "Doanh thu CRM",
      description: "Doanh thu kênh CRM, CRM Campaign",
      isShow: true,
    },
    {
      name: "total_spend_per_revenue_ads",
      title: "CP / DT QC",
      description: "Chi phí quảng cáo / Doanh thu quảng cáo",
      isShow: true,
    },
    {
      name: "total_spend_per_revenue",
      title: "CP / DT",
      description: "Chi phí quảng cáo / Doanh thu",
      isShow: true,
    },
    {
      name: "total_spend",
      title: "Tổng chi phí (Ads)",
      description: "Tổng chi phí quảng cáo Performance",
      isShow: true,
    },
    {
      name: "fb_spend",
      title: "Chi phí FB (Ads)",
      description: "Chi phí quảng cáo Performance FB",
      isShow: true,
    },
    {
      name: "gg_spend",
      title: "Chi phí GG (Ads)",
      description: "Chi phí quảng cáo Performance GG",
      isShow: true,
    },
    {
      name: "tt_spend",
      title: "Chi phí Tiktok (Ads)",
      description: "Chi phí quảng cáo Performance Tiktok",
      isShow: true,
    },
    {
      name: "total_spend_per_ads_qualified",
      title: "CP / SĐTCL (Ads)",
      description: "Chi phí quảng cáo / SĐTCL đã xử lý",
      isShow: true,
    },
    {
      name: "ads_qualified",
      title: "Tổng SĐTCL (Ads)",
      description: "Tổng SĐT mapping được từ Ads",
      isShow: true,
    },
    {
      name: "ads_qualified_rate",
      title: "Tỷ lệ SĐTCL (Ads)",
      description: "Có mua + Không mua / Tổng SĐT",
      isShow: true,
    },
    {
      name: "ads_buy_rate",
      title: "Tỷ lệ chốt (Ads)",
      description: "Từ SĐTCL → Tỷ lệ chốt đã xử lý : Có mua / Có mua + Không mua",
      isShow: true,
    },
    {
      name: "lead_done",
      title: "SĐT đã xử lý (Lead)",
      description: "Tổng lead đã chuyển trạng thái cuối (Có mua, Không mua, KCL) ở Lead Center",
      isShow: true,
    },
    {
      name: "lead_qualified_rate",
      title: "Tỷ lệ SĐTCL (Lead)",
      description: "Tỷ lệ SĐTCL của lead Đã xử lý",
      isShow: true,
    },
    {
      name: "lead_buy_rate",
      title: "Tỷ lệ chốt (Lead)",
      description: "Tỷ lệ chốt của lead Đã xử lý (Có mua / Có mua + Không mua)",
      isShow: true,
    },
    {
      name: "order_count",
      title: "Tổng đơn hàng",
      description: "Tổng đơn đã xác nhận của tất cả kênh",
      isShow: true,
    },
    {
      name: "return_rate",
      title: "Tỷ lệ hoàn",
      description: "Tổng số đơn hoàn",
      isShow: true,
    },
    {
      name: "revenue_per_order",
      title: "AOV",
      description: "Giá trị trung bình đơn",
      isShow: true,
    },
    {
      name: "revenue_offline",
      title: "Doanh thu Offline",
      description: "Doanh thu kênh Offline",
      isShow: false,
    },
    {
      name: "revenue_livestream",
      title: "Doanh thu Livestream",
      description: "Doanh thu kênh Livestream",
      isShow: false,
    },
    {
      name: "revenue_ecom",
      title: "Doanh thu E-commerce",
      description: "Doanh thu các kênh Ecom",
      isShow: false,
    },
    {
      name: "ads_phone",
      title: "Tổng SĐT (Ads)",
      description: "Tổng SĐT mapping được từ Ads",
      isShow: false,
    },
    {
      name: "lead_assigned",
      title: "SĐT đã chia (Lead)",
      description: "Tổng lead đã chia số ở Lead Center",
      isShow: false,
    },

    {
      name: "lead_qualified",
      title: "SĐTCL đã xử lý (Lead)",
      description: "Tổng lead đã chuyển sang trạng thái Có mua, Không mua",
      isShow: false,
    },
    {
      name: "lead_buy",
      title: "SĐT có mua (Lead)",
      description: "Tổng lead đã chuyển trạng thái Có mua",
      isShow: false,
    },
  ],
  columnShowTable: [
    {
      name: "date",
      column: "date",
      isShowTitle: false,
      title: "Ngày",
      isShow: true,
    },
    {
      name: "revenue",
      column: "revenue",
      isShowTitle: false,
      title: "Tổng doanh thu",
      isShow: true,
    },
    {
      name: "provisional_revenue",
      column: "provisional_revenue",
      isShowTitle: false,
      title: "Doanh thu tạm tính",
      isShow: true,
    },
    {
      name: "order_count",
      column: "order_count",
      isShowTitle: false,
      title: "Tổng đơn hàng",
      isShow: true,
    },
    {
      name: "return_rate",
      column: "return_rate",
      isShowTitle: false,
      title: "Tỷ lệ hoàn",
      isShow: true,
    },
    {
      name: "revenue_crm",
      column: "revenue_crm",
      isShowTitle: false,
      title: "Doanh thu CRM",
      isShow: true,
    },
    {
      name: "revenue_offline",
      column: "revenue_offline",
      isShowTitle: false,
      title: "Doanh thu Offline",
      isShow: false,
    },
    {
      name: "total_spend_per_revenue_ads",
      column: "total_spend_per_revenue_ads",
      title: "CP / DT QC",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "total_spend_per_revenue",
      column: "total_spend_per_revenue",
      title: "CP / DT",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "revenue_livestream",
      column: "revenue_livestream",
      isShowTitle: false,
      title: "Doanh thu Livestream",
      isShow: false,
    },
    {
      name: "revenue_ecom",
      column: "revenue_ecom",
      isShowTitle: false,
      title: "Doanh thu E-commerce",
      isShow: false,
    },
    {
      name: "ads_qualified",
      column: "ads_qualified",
      title: "Tổng SĐTCL (Ads)",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "total_spend_per_ads_qualified",
      column: "total_spend_per_ads_qualified",
      title: "CP / SĐTCL (Ads)",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "revenue_ads",
      column: "revenue_ads",
      isShowTitle: false,
      title: "Doanh thu Quảng cáo",
      isShow: true,
    },
    {
      name: "revenue_per_order",
      column: "revenue_per_order",
      isShowTitle: false,
      title: "AOV",
      isShow: true,
    },
    {
      name: "total_spend",
      column: "total_spend",
      isShowTitle: false,
      title: "Tổng chi phí (Ads)",
      isShow: true,
    },
    {
      name: "fb_spend",
      column: "fb_spend",
      isShowTitle: false,
      title: "Chi phí FB (Ads)",
      isShow: true,
    },
    {
      name: "gg_spend",
      column: "gg_spend",
      isShowTitle: false,
      title: "Chi phí GG (Ads)",
      isShow: true,
    },
    {
      name: "tt_spend",
      column: "tt_spend",
      isShowTitle: false,
      title: "Chi phí Tiktok (Ads)",
      isShow: true,
    },
    {
      name: "ads_phone",
      column: "ads_phone",
      isShowTitle: false,
      title: "Tổng SĐT (Ads)",
      isShow: false,
    },
    {
      name: "ads_qualified_rate",
      column: "ads_qualified_rate",
      isShowTitle: false,
      title: "Tỷ lệ SĐTCL (Ads)",
      isShow: true,
    },
    {
      name: "ads_buy_rate",
      column: "ads_buy_rate",
      isShowTitle: false,
      title: "Tỷ lệ chốt (Ads)",
      isShow: true,
    },
    {
      name: "lead_assigned",
      column: "lead_assigned",
      isShowTitle: false,
      title: "SĐT đã chia (Lead)",
      isShow: false,
    },
    {
      name: "lead_done",
      column: "lead_done",
      isShowTitle: false,
      title: "SĐT đã xử lý (Lead)",
      isShow: true,
    },
    {
      name: "lead_qualified",
      column: "lead_qualified",
      isShowTitle: false,
      title: "SĐTCL đã xử lý (Lead)",
      isShow: false,
    },
    {
      name: "lead_buy",
      column: "lead_buy",
      isShowTitle: false,
      title: "SĐT có mua (Lead)",
      isShow: false,
    },
    {
      name: "lead_buy_rate",
      column: "lead_buy_rate",
      isShowTitle: false,
      title: "Tỷ lệ chốt (Lead)",
      isShow: true,
    },
    {
      name: "lead_qualified_rate",
      column: "lead_qualified_rate",
      isShowTitle: false,
      title: "Tỷ lệ SĐTCL (Lead)",
      isShow: true,
    },
  ],
};

export const columnShowBuyRateByChannel: ColumnShow = {
  columnWidths: [
    { columnName: "channel", width: 150 },
    { columnName: "total", width: 90 },
    { columnName: "post_qualified", width: 130 },
    { columnName: "buy", width: 120 },
    { columnName: "buy_rate", width: 120 },
  ],
  columnsShowHeader: [
    {
      name: "channel",
      title: "Kênh bán hàng",
      isShow: true,
    },
    {
      name: "total",
      title: "Tổng",
      isShow: true,
    },
    {
      name: "post_qualified",
      title: "SĐTCL sau xử lí",
      isShow: true,
    },
    {
      name: "buy",
      title: "Có mua",
      isShow: true,
    },
    {
      name: "buy_rate",
      title: "Tỉ lệ chốt",
      isShow: true,
    },
  ],
};

export const columnShowReportByChannel: ColumnShow = {
  columnWidths: [
    { width: 200, columnName: "source_name" },
    { width: 120, columnName: "total_order" },
    { width: 150, columnName: "total_actual" },
  ],
  columnsShowHeader: [
    { title: "Theo kênh bán hàng", name: "source_name", isShow: true },
    { title: "Tổng đơn hàng", name: "total_order", isShow: true },
    { title: "Doanh thu", name: "total_actual", isShow: true },
  ],
};

export const columnShowReportByProduct: ColumnShow = {
  columnWidths: [
    { width: 210, columnName: "variant_name" },
    { width: 100, columnName: "quantity" },
    { width: 130, columnName: "thumb_img" },
    { width: 150, columnName: "variant_total" },
    { width: 150, columnName: "total" },
  ],
  columnsShowHeader: [
    { title: "Theo sản phẩm", name: "variant_name", isShow: true },
    { title: "Thumbnail", name: "thumb_img", isShow: true },
    { title: "Tổng tiền hàng (đã KM)", name: "total", isShow: true },
    { title: "Tổng tiền hàng (chưa KM)", name: "variant_total", isShow: true },
    { title: "Số sản phẩm", name: "quantity", isShow: true },
  ],
};

// Summary
export const summaryColumnFacebookContentIdMessage: SummaryItem[] = [
  { columnName: "total_phone", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
  { columnName: "cost_per_qualified_phone", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnTiktokContentIdMessage: SummaryItem[] = [
  { columnName: "phone_total", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "phone_qualified", type: "sum" },
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "cost_per_phone_total", type: "sum" },
  { columnName: "cost_per_phone_qualified", type: "sum" },
  // { columnName: "messaging_conversation_started_7d", type: "sum" },
  // { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnFacebookContentIdConversation: SummaryItem[] = [
  { columnName: "total_phone", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "cost_per_qualified_phone", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
];

export const summaryColumnTiktokContentIdConversation: SummaryItem[] = [
  { columnName: "phone_total", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "phone_qualified", type: "sum" },
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "cost_per_phone_total", type: "sum" },
  { columnName: "cost_per_phone_qualified", type: "sum" },
  // { columnName: "fb_pixel_complete_registration", type: "sum" },
  // { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
];

export const summaryColumnGoogleContentId: SummaryItem[] = [
  { columnName: "cost", type: "sum" },
  { columnName: "ladi_qualified", type: "sum" },
  { columnName: "ladi_phone", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnReportByDate: SummaryItem[] = [
  {
    columnName: "revenue",
    type: "sum",
  },
  {
    columnName: "order_count",
    type: "sum",
  },
  {
    columnName: "return_rate",
    type: "sum",
  },
  {
    columnName: "revenue_crm",
    type: "sum",
  },
  {
    columnName: "revenue_offline",
    type: "sum",
  },
  {
    columnName: "revenue_livestream",
    type: "sum",
  },
  {
    columnName: "revenue_ecom",
    type: "sum",
  },
  {
    columnName: "revenue_ads",
    type: "sum",
  },
  {
    columnName: "revenue_per_order",
    type: "sum",
  },
  {
    columnName: "total_spend",
    type: "sum",
  },
  {
    columnName: "fb_spend",
    type: "sum",
  },
  {
    columnName: "gg_spend",
    type: "sum",
  },
  {
    columnName: "tt_spend",
    type: "sum",
  },
  {
    columnName: "lead_assigned",
    type: "sum",
  },
  {
    columnName: "lead_done",
    type: "sum",
  },
  {
    columnName: "lead_qualified",
    type: "sum",
  },
  {
    columnName: "lead_buy",
    type: "sum",
  },
  {
    columnName: "lead_buy_rate",
    type: "sum",
  },
  {
    columnName: "lead_qualified_rate",
    type: "sum",
  },
  {
    columnName: "ads_qualified_rate",
    type: "sum",
  },
  {
    columnName: "ads_buy_rate",
    type: "sum",
  },
  {
    columnName: "ads_phone",
    type: "sum",
  },
  {
    columnName: "total_spend_per_ads_qualified",
    type: "sum",
  },
  {
    columnName: "ads_qualified",
    type: "sum",
  },
  {
    columnName: "total_spend_per_revenue_ads",
    type: "sum",
  },
  {
    columnName: "total_spend_per_revenue",
    type: "sum",
  },
  {
    columnName: "provisional_revenue",
    type: "sum",
  },
];

export const summaryColumnBuyRateByChannel: SummaryItem[] = [
  { columnName: "total", type: "sum" },
  { columnName: "post_qualified", type: "sum" },
  { columnName: "buy", type: "sum" },
  { columnName: "buy_rate", type: "sum" },
];

export const summaryColumnReportByChannel: SummaryItem[] = [
  { columnName: "total_actual", type: "sum" },
  { columnName: "total_order", type: "sum" },
];

export const summaryColumnReportByProduct: SummaryItem[] = [
  { columnName: "total", type: "sum" },
  { columnName: "variant_total", type: "sum" },
  { columnName: "quantity", type: "sum" },
];

export const FILTER_CHART_OPTIONS_BY_PRODUCT: SelectOptionType[] = [
  { value: "inventory_quantity", label: "Tồn kho" },
  { value: "revenue", label: "Doanh thu" },
  { value: "quantity", label: "Số sản phẩm" },
];

export const FILTER_CHART_OPTIONS_BY_DATE: SelectOptionType[] = [
  {
    value: "revenue",
    label: "Tổng doanh thu",
  },
  {
    value: "provisional_revenue",
    label: "Doanh thu tạm tinh",
  },
  {
    value: "revenue_ads",
    label: "Doanh thu Quảng cáo",
  },
  {
    value: "revenue_crm",
    label: "Doanh thu CRM",
  },
  {
    value: "total_spend_per_revenue_ads",
    label: "CP / DT QC",
  },
  {
    value: "total_spend_per_revenue",
    label: "CP / DT",
  },
  {
    value: "total_spend",
    label: "Tổng chi phí (Ads)",
  },
  {
    value: "fb_spend",
    label: "Chi phí FB (Ads)",
  },
  {
    value: "gg_spend",
    label: "Chi phí GG (Ads)",
  },
  {
    value: "tt_spend",
    label: "Chi phí Tiktok (Ads)",
  },
  {
    value: "total_spend_per_ads_qualified",
    label: "CP / SĐTCL (Ads)",
  },
  {
    value: "ads_qualified",
    label: "Tổng SĐTCL (Ads)",
  },
  {
    value: "ads_qualified_rate",
    label: "Tỷ lệ SĐTCL (Ads)",
  },
  {
    value: "ads_buy_rate",
    label: "Tỷ lệ chốt (Ads)",
  },
  {
    value: "lead_done",
    label: "SĐT đã xử lý (Lead)",
  },
  {
    value: "lead_qualified_rate",
    label: "Tỷ lệ SĐTCL (Lead)",
  },
  {
    value: "lead_buy_rate",
    label: "Tỷ lệ chốt (Lead)",
  },
  {
    value: "order_count",
    label: "Tổng đơn hàng",
  },
  {
    value: "return_rate",
    label: "Tỷ lệ hoàn",
  },
  {
    value: "revenue_per_order",
    label: "AOV",
  },
  {
    value: "revenue_offline",
    label: "Doanh thu Offline",
  },
  {
    value: "revenue_livestream",
    label: "Doanh thu Livestream",
  },
  {
    value: "revenue_ecom",
    label: "Doanh thu E-commerce",
  },
  {
    value: "ads_phone",
    label: "Tổng SĐT (Ads)",
  },
  {
    value: "lead_assigned",
    label: "SĐT đã chia (Lead)",
  },

  {
    value: "lead_qualified",
    label: "SĐTCL đã xử lý (Lead)",
  },
  {
    value: "lead_buy",
    label: "SĐT có mua (Lead)",
  },
];

export const FILTER_CHART_OPTIONS_TOP_CONVERSATION_FACEBOOK: SelectOptionType[] = [
  { value: "spend", label: "Chi phí" },
  { value: "total_phone", label: "Tổng SĐT" },
  { value: "cost_per_total_phone", label: "Chi phí/Tổng SĐT" },
  { value: "total_phone_qualified", label: "Tổng SĐT chất lượng" },
  { value: "cost_per_total_phone_qualified", label: "Chi phí/Tổng SĐT chất lượng" },
  { value: "fb_pixel_complete_registration", label: "Form" },
  { value: "cost_per_fb_pixel_complete_registration", label: "Chi phí/Form" },
];

export const FILTER_CHART_OPTIONS_TOP_MESSAGE_FACEBOOK: SelectOptionType[] = [
  { value: "spend", label: "Chi phí" },
  { value: "total_phone", label: "Tổng SĐT" },
  { value: "cost_per_total_phone", label: "Chi phí/Tổng SĐT" },
  { value: "total_phone_qualified", label: "Tổng SĐT chất lượng" },
  { value: "cost_per_total_phone_qualified", label: "Chi phí/Tổng SĐT chất lượng" },
  { value: "messaging_conversation_started_7d", label: "Tin nhắn" },
  { value: "cost_per_messaging_conversation_started_7d", label: "Chi phí/Tin nhắn" },
];

export const FILTER_CHART_OPTIONS_TOP_CONVERSATION_GOOGLE: SelectOptionType[] = [
  { value: "cost", label: "Chi phí" },
  { value: "landingpage_phone_qualified", label: "SĐT chất lượng landing page" },
  { value: "landingpage_phone_total", label: "Tổng SĐT landing page" },
  { value: "cost_per_total_phone", label: "Chi phí/Tổng SĐT" },
  { value: "cost_per_qualified_phone", label: "Chi phí/SĐT chất lượng" },
];

// Conver value
export const arrAttachUnitVnd = [
  "revenue",
  "revenue_crm",
  "revenue_offline",
  "revenue_livestream",
  "revenue_ecom",
  "revenue_ads",
  "revenue_per_order",
  "total_spend",
  "fb_spend",
  "gg_spend",
  "tt_spend",
  "spend_per_qualified_phone_exclude_crm",
  "total_spend_per_ads_qualified",
  "provisional_revenue",
  "tt_spend",
];
