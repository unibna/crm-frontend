import { ColumnShow, ColumnShowDatagrid } from "_types_/FacebookType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { SummaryItem } from "@devexpress/dx-react-grid";
import { fShortenNumber } from "utils/formatNumber";
import { ReportByDateType } from "_types_/ReportRevenueType";

export type StatusSyncType = "OH" | "IP" | "RJ" | "CO";

export const keyFilter = {
  STATUS: "STATUS",
  OBJECTIVE: "OBJECTIVE",
  AD_ACCOUNT: "AD_ACCOUNT",
  CAMPAIGN: "CAMPAIGN",
  AD_SET: "AD_SET",
  AD: "AD",
  CONTENT_CREATOR: "CONTENT_CREATOR",
  DESIGNER: "DESIGNER",
  FANPAGE: "FANPAGE",
};

export const styleDefaultColumn = {
  minWidth: 150,
  align: "left",
  headerAlign: "center",
  disableColumnMenu: true,
  isShow: true,
};
export const excludeContentAdsStartWith = ["d"];
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
  UPDATE_FACEBOOK_PRODUCT: "UPDATE_FACEBOOK_PRODUCT",
  UPDATE_GOOGLE_PRODUCT: "UPDATE_GOOGLE_PRODUCT",
  UPDATE_TOP_LIVESTREAM_GOOD: "UPDATE_TOP_LIVESTREAM_GOOD",
  UPDATE_REPORT_BY_DATE: "UPDATE_REPORT_BY_DATE",
  UPDATE_CONTENT_ID: "UPDATE_CONTENT_ID",
  RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_MESSAGE: "RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_MESSAGE",
  RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_CONVERSATION:
    "RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_CONVERSATION",
  RESIZE_COLUMN_TOP_CONTENT_ID_GOOGLE: "RESIZE_COLUMN_TOP_CONTENT_ID_GOOGLE",
  RESIZE_COLUMN_FACEBOOK_PRODUCT: "RESIZE_COLUMN_FACEBOOK_PRODUCT",
  RESIZE_COLUMN_GOOGLE_PRODUCT: "RESIZE_COLUMN_GOOGLE_PRODUCT",
  RESIZE_COLUMN_REPORT_BY_DATE: "RESIZE_COLUMN_REPORT_BY_DATE",
  RESIZE_COLUMN_TOP_LIVESTREAM_GOOD: "RESIZE_COLUMN_TOP_LIVESTREAM_GOOD",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_MESSAGE:
    "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_MESSAGE",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_CONVERSATION:
    "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_CONVERSATION",
  UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_GOOGLE: "UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_GOOGLE",
  UPDATE_COLUMN_ORDER_REPORT_BY_DATE: "UPDATE_COLUMN_ORDER_REPORT_BY_DATE",
  UPDATE_COLUMN_ORDER_FACEBOOK_PRODUCT: "UPDATE_COLUMN_ORDER_FACEBOOK_PRODUCT",
  UPDATE_COLUMN_ORDER_GOOGLE_PRODUCT: "UPDATE_COLUMN_ORDER_GOOGLE_PRODUCT",
  UPDATE_COLUMN_ORDER_TOP_LIVESTREAM_GOOD: "UPDATE_COLUMN_ORDER_TOP_LIVESTREAM_GOOD",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
};

export const columnShowFacebookContentIdFilterConversation: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 140 },
    { columnName: "ad_name", width: 50 },
    // { columnName: "total_phone", width: 50 },
    { columnName: "thumb_img", width: 130 },
    { columnName: "cost_per_total_phone", width: 90 },
    { columnName: "total_qualified", width: 110 },
    { columnName: "cost_per_total_qualified", width: 100 },
    // { columnName: "fb_pixel_complete_registration", width: 50 },
    // { columnName: "cost_per_fb_pixel_complete_registration", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "ad_name",
      title: "Content ID",
      isShow: true,
    },
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    // {
    //   name: "fb_pixel_complete_registration",
    //   title: "Form",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_fb_pixel_complete_registration",
    //   title: "CP/Form",
    //   isShow: true,
    // },
    // {
    //   name: "total_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_total_phone",
    //   title: "CP/Tổng SĐT",
    //   isShow: true,
    // },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP/Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowFacebookContentIdFilterMessage: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 140 },
    { columnName: "ad_name", width: 60 },
    { columnName: "thumb_img", width: 130 },
    // { columnName: "total_phone", width: 80 },
    // { columnName: "cost_per_total_phone", width: 100 },
    { columnName: "total_qualified", width: 110 },
    { columnName: "cost_per_total_qualified", width: 100 },
    // { columnName: "messaging_conversation_started_7d", width: 70 },
    // { columnName: "cost_per_messaging_conversation_started_7d", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "ad_name",
      title: "Content ID",
      isShow: true,
    },
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    // {
    //   name: "messaging_conversation_started_7d",
    //   title: "Tin nhắn",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_messaging_conversation_started_7d",
    //   title: "CP/Tin nhắn",
    //   isShow: true,
    // },
    // {
    //   name: "total_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_total_phone",
    //   title: "CP/Tổng SĐT",
    //   isShow: true,
    // },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP/Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowTopLivestreamGood: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 100 },
    { columnName: "ad_name", width: 70 },
    { columnName: "total_revenue", width: 100 },
    { columnName: "thumb_img", width: 150 },
    { columnName: "total_orders", width: 80 },
    { columnName: "fb_pixel_complete_registration", width: 80 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 100 },
    { columnName: "total_phone", width: 70 },
    { columnName: "total_qualified", width: 80 },
    { columnName: "cost_per_total_qualified", width: 120 },
  ],
  columnsShowHeader: [
    {
      name: "ad_name",
      title: "Content ID",
      isShow: true,
    },
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "total_revenue",
      title: "Doanh thu",
      isShow: true,
    },
    {
      name: "total_orders",
      title: "Đơn hàng",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Form",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "CP/Form",
      isShow: true,
    },
    {
      name: "total_phone",
      title: "Tổng SĐT",
      isShow: true,
    },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP / Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowFacebookContentIdFilterConversationDetailTargeting: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 150 },
    { columnName: "adset_name", width: 130 },
    // { columnName: "total_revenue", width: 100 },
    // { columnName: "total_orders", width: 80 },
    // { columnName: "fb_pixel_complete_registration", width: 80 },
    // { columnName: "cost_per_fb_pixel_complete_registration", width: 100 },
    // { columnName: "total_phone", width: 70 },
    { columnName: "total_qualified", width: 120 },
    { columnName: "cost_per_total_qualified", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "adset_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    // {
    //   name: "total_revenue",
    //   title: "Doanh thu",
    //   isShow: true,
    // },
    // {
    //   name: "total_orders",
    //   title: "Đơn hàng",
    //   isShow: true,
    // },
    // {
    //   name: "fb_pixel_complete_registration",
    //   title: "Form",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_fb_pixel_complete_registration",
    //   title: "CP/Form",
    //   isShow: true,
    // },
    // {
    //   name: "total_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP / Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowFacebookContentIdFilterMessageDetailTargeting: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 150 },
    { columnName: "adset_name", width: 130 },
    // { columnName: "total_revenue", width: 100 },
    // { columnName: "total_orders", width: 80 },
    // { columnName: "messaging_conversation_started_7d", width: 80 },
    // { columnName: "cost_per_messaging_conversation_started_7d", width: 100 },
    // { columnName: "total_phone", width: 70 },
    { columnName: "total_qualified", width: 120 },
    { columnName: "cost_per_total_qualified", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "adset_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    // {
    //   name: "total_revenue",
    //   title: "Doanh thu",
    //   isShow: true,
    // },
    // {
    //   name: "total_orders",
    //   title: "Đơn hàng",
    //   isShow: true,
    // },
    // {
    //   name: "messaging_conversation_started_7d",
    //   title: "Tin nhắn",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_messaging_conversation_started_7d",
    //   title: "CP/Tin nhắn",
    //   isShow: true,
    // },
    // {
    //   name: "total_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP / Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowTopLivestreamGoodDetailTargeting: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 100 },
    { columnName: "adset_name", width: 70 },
    { columnName: "total_revenue", width: 100 },
    { columnName: "total_orders", width: 80 },
    { columnName: "fb_pixel_complete_registration", width: 80 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 100 },
    { columnName: "total_phone", width: 70 },
    { columnName: "total_qualified", width: 80 },
    { columnName: "cost_per_total_qualified", width: 120 },
  ],
  columnsShowHeader: [
    {
      name: "adset_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "total_revenue",
      title: "Doanh thu",
      isShow: true,
    },
    {
      name: "total_orders",
      title: "Đơn hàng",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Form",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "CP/Form",
      isShow: true,
    },
    {
      name: "total_phone",
      title: "Tổng SĐT",
      isShow: true,
    },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP / Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowGoogleContentId: ColumnShow = {
  columnWidths: [
    { columnName: "cost", width: 150 },
    { columnName: "ad_name", width: 50 },
    { columnName: "ladi_qualified", width: 120 },
    { columnName: "thumb_img", width: 90 },
    // { columnName: "ladi_phone", width: 70 },
    // { columnName: "cost_per_total_phone", width: 100 },
    { columnName: "cost_per_total_qualified", width: 110 },
  ],
  columnsShowHeader: [
    {
      name: "ad_name",
      title: "Content ID",
      isShow: true,
    },
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
    // {
    //   name: "ladi_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_total_phone",
    //   title: "CP/Tổng SĐT",
    //   isShow: true,
    // },
    {
      name: "cost_per_total_qualified",
      title: "CP/SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowGoogleContentIdDetailTargeting: ColumnShow = {
  columnWidths: [
    { columnName: "cost", width: 130 },
    { columnName: "ad_group_name", width: 140 },
    // { columnName: "ladi_revenue", width: 70 },
    // { columnName: "ladi_phone", width: 70 },
    // { columnName: "cost_per_total_phone", width: 100 },
    { columnName: "ladi_qualified", width: 120 },
    { columnName: "cost_per_total_qualified", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "ad_group_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "cost",
      title: "Chi phí",
      isShow: true,
    },
    // {
    //   name: "ladi_revenue",
    //   title: "Doanh thu",
    //   isShow: true,
    // },
    // {
    //   name: "ladi_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_total_phone",
    //   title: "CP/Tổng SĐT",
    //   isShow: true,
    // },
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
};

export const columnShowBuyRateByChannel: ColumnShow = {
  columnWidths: [
    { columnName: "channel", width: 150 },
    { columnName: "total", width: 90 },
    { columnName: "post_qualified", width: 130 },
    { columnName: "buy", width: 120 },
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
  ],
};

export const columnShowFacebookProduct: ColumnShow = {
  columnWidths: [
    { columnName: "product_name", width: 150 },
    { columnName: "spend", width: 90 },
    { columnName: "comment", width: 100 },
    { columnName: "total_orders", width: 130 },
    { columnName: "total_revenue", width: 130 },
    { columnName: "total_phone", width: 100 },
    { columnName: "total_qualified", width: 100 },
    { columnName: "cost_per_comment", width: 130 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 130 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 130 },
    { columnName: "cost_per_total_phone", width: 130 },
    { columnName: "cost_per_total_qualified", width: 130 },
    { columnName: "messaging_conversation_started_7d", width: 100 },
    { columnName: "fb_pixel_complete_registration", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "product_name",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "total_orders",
      title: "Tổng đơn hàng",
      isShow: true,
    },
    {
      name: "total_revenue",
      title: "Tổng doanh thu",
      isShow: true,
    },
    {
      name: "total_phone",
      title: "Tổng SĐT",
      isShow: true,
    },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Form",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "CP/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "CP/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "CP/Form",
      isShow: true,
    },
    {
      name: "cost_per_total_phone",
      title: "CP/Tổng SĐT",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP/Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowGoogleProduct: ColumnShow = {
  columnWidths: [
    { columnName: "product_name", width: 150 },
    { columnName: "cost", width: 150 },
    { columnName: "conversion", width: 100 },
    { columnName: "clicks", width: 100 },
    { columnName: "kol_koc", width: 100 },
    { columnName: "impressions", width: 100 },
    { columnName: "ladi_phone", width: 100 },
    { columnName: "ladi_qualified", width: 100 },
    { columnName: "ladi_revenue", width: 130 },
    { columnName: "ladi_orders", width: 130 },
    { columnName: "cost_per_conversion", width: 130 },
    { columnName: "cost_per_total_phone", width: 130 },
    { columnName: "cost_per_total_qualified", width: 130 },
  ],
  columnsShowHeader: [
    {
      name: "product_name",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "cost",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "conversion",
      title: "Chuyển đổi",
      isShow: true,
    },
    {
      name: "clicks",
      title: "Lượt nhấp",
      isShow: true,
    },
    {
      name: "impressions",
      title: "Hiển thị",
      isShow: true,
    },
    {
      name: "ladi_phone",
      title: "Tổng SĐT",
      isShow: true,
    },
    {
      name: "ladi_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "ladi_revenue",
      title: "Tổng doanh thu",
      isShow: true,
    },
    {
      name: "ladi_orders",
      title: "Tổng đơn hàng",
      isShow: true,
    },
    {
      name: "cost_per_conversion",
      title: "CP/Chuyển đổi",
      isShow: true,
    },
    {
      name: "cost_per_total_phone",
      title: "CP/Tổng SĐT",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP/Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "kol_koc",
      title: "KOL/ KOC",
      isShow: true,
    },
  ],
};

export const columnShowFacebookProductDetailContentId: ColumnShow = {
  columnWidths: [
    { columnName: "spend", width: 130 },
    { columnName: "ad_name", width: 70 },
    { columnName: "thumb_img", width: 130 },
    // { columnName: "total_revenue", width: 100 },
    // { columnName: "total_orders", width: 80 },
    // { columnName: "fb_pixel_complete_registration", width: 80 },
    // { columnName: "cost_per_fb_pixel_complete_registration", width: 100 },
    // { columnName: "total_phone", width: 70 },
    { columnName: "total_qualified", width: 80 },
    { columnName: "cost_per_total_qualified", width: 120 },
  ],
  columnsShowHeader: [
    {
      name: "ad_name",
      title: "Content ID",
      isShow: true,
    },
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    // {
    //   name: "total_revenue",
    //   title: "Doanh thu",
    //   isShow: true,
    // },
    // {
    //   name: "total_orders",
    //   title: "Đơn hàng",
    //   isShow: true,
    // },
    // {
    //   name: "fb_pixel_complete_registration",
    //   title: "Form",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_fb_pixel_complete_registration",
    //   title: "CP/Form",
    //   isShow: true,
    // },
    // {
    //   name: "total_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP / Tổng SĐTCL",
      isShow: true,
    },
  ],
};

export const columnShowGoogleProductDetailContentId: ColumnShow = {
  columnWidths: [
    { columnName: "cost", width: 140 },
    { columnName: "ad_name", width: 70 },
    { columnName: "thumb_img", width: 90 },
    // { columnName: "ladi_revenue", width: 100 },
    // { columnName: "ladi_phone", width: 70 },
    // { columnName: "cost_per_total_phone", width: 100 },
    { columnName: "ladi_qualified", width: 90 },
    { columnName: "cost_per_total_qualified", width: 140 },
  ],
  columnsShowHeader: [
    {
      name: "ad_name",
      title: "Content ID",
      isShow: true,
    },
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
    // {
    //   name: "ladi_revenue",
    //   title: "Doanh thu",
    //   isShow: true,
    // },
    // {
    //   name: "ladi_phone",
    //   title: "Tổng SĐT",
    //   isShow: true,
    // },
    // {
    //   name: "cost_per_total_phone",
    //   title: "CP/Tổng SĐT",
    //   isShow: true,
    // },
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
};

// Summary

export const summaryColumnFacebookContentIdMessage: SummaryItem[] = [
  { columnName: "total_revenue", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnFacebookContentIdConversation: SummaryItem[] = [
  { columnName: "total_revenue", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnFacebookContentIdConversationDetailTargeting: SummaryItem[] = [
  { columnName: "total_revenue", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnFacebookContentIdMessageDetailTargeting: SummaryItem[] = [
  { columnName: "total_revenue", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnTopLivestreamGood: SummaryItem[] = [
  { columnName: "total_revenue", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnGoogleContentId: SummaryItem[] = [
  { columnName: "cost", type: "sum" },
  { columnName: "ladi_qualified", type: "sum" },
  { columnName: "ladi_phone", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
  { columnName: "ladi_revenue", type: "sum" },
];

export const summaryColumnGoogleContentIdDetailTargeting: SummaryItem[] = [
  { columnName: "cost", type: "sum" },
  { columnName: "ladi_qualified", type: "sum" },
  { columnName: "ladi_phone", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
  { columnName: "ladi_revenue", type: "sum" },
];

export const summaryColumnTopLivestreamGoodDetailTargeting: SummaryItem[] = [
  { columnName: "total_revenue", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnFacebookProduct: SummaryItem[] = [
  { columnName: "spend", type: "sum" },
  { columnName: "comment", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "total_revenue", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
];

export const summaryColumnGoogleProduct: SummaryItem[] = [
  { columnName: "cost", type: "sum" },
  { columnName: "conversion", type: "sum" },
  { columnName: "clicks", type: "sum" },
  { columnName: "impressions", type: "sum" },
  { columnName: "ladi_phone", type: "sum" },
  { columnName: "ladi_qualified", type: "sum" },
  { columnName: "ladi_revenue", type: "sum" },
  { columnName: "ladi_orders", type: "sum" },
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnFacebookProductDetailContentId: SummaryItem[] = [
  { columnName: "total_revenue", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "total_orders", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "total_phone", type: "sum" },
  { columnName: "total_qualified", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
];

export const summaryColumnGoogleProductDetailContentId: SummaryItem[] = [
  { columnName: "cost", type: "sum" },
  { columnName: "ladi_qualified", type: "sum" },
  { columnName: "ladi_phone", type: "sum" },
  { columnName: "cost_per_total_phone", type: "sum" },
  { columnName: "cost_per_total_qualified", type: "sum" },
  { columnName: "ladi_revenue", type: "sum" },
];

export const FILTER_CHART_OPTIONS_BY_DATE: SelectOptionType[] = [
  {
    value: "revenue",
    label: "Doanh thu",
  },
  {
    value: "revenue_per_order",
    label: "Giá trị đơn (Trung bình)",
  },
  {
    value: "num_of_orders",
    label: "Số đơn hàng",
  },
  {
    value: "product_quantity",
    label: "Số sản phẩm",
  },
  {
    value: "total_spend",
    label: "Tổng chi phí quảng cáo",
  },
  {
    value: "spend_per_revenue",
    label: "Chi phí quảng cáo / Doanh thu",
  },
  {
    value: "gg_spend",
    label: "Tổng chi phí Google",
  },
  {
    value: "tt_spend",
    label: "Tổng chi phí Tiktok",
  },
  {
    value: "fb_spend",
    label: "Tổng chi phí Facebook",
  },
  {
    value: "qualified_phone",
    label: "Tổng SĐTCL",
  },
  {
    value: "spend_per_qualified_phone",
    label: "CP/Tổng SĐTCL",
  },
  {
    value: "post_qualified_exclude_crm",
    label: "Tổng SĐTCL quảng cáo (lead)",
  },
  {
    value: "spend_per_qualified_phone_exclude_crm",
    label: "CP/SĐTCL QC (lead)",
  },
  {
    value: "fb_messaging_conversation_started_7d",
    label: "Tin nhắn Facebook",
  },
  {
    value: "fb_spend_per_message",
    label: "CP/Tin nhắn Facebook",
  },
  {
    value: "fb_pixel_complete_registration",
    label: "Form Facebook",
  },
  {
    value: "fb_spend_per_conversion",
    label: "CP/Form Facebook",
  },
  {
    value: "gg_conversion",
    label: "Form Google",
  },
  {
    value: "gg_spend_per_conversion",
    label: "CP/Form Google",
  },
  {
    value: "fb_spend_messages",
    label: "Chi phí QC tin nhắn Facebook",
  },
  {
    value: "fb_inbox_phone_qualified",
    label: "SĐTCL tin nhắn Facebook",
  },
  {
    value: "fb_spend_per_qualified_phone_message",
    label: "CP/SĐTCL tin nhắn Facebook",
  },
  {
    value: "fb_spend_conversions",
    label: "Chi phí QC chuyển đổi Facebook",
  },
  {
    value: "fb_landingpage_phone_qualified",
    label: "SĐTCL chuyển đổi Facebook",
  },
  {
    value: "fb_spend_per_qualified_phone_conversion",
    label: "CP/SĐTCL chuyển đổi Facebook",
  },
  {
    value: "gg_landingpage_phone_qualified",
    label: "SĐTCL chuyển đổi Google",
  },
  {
    value: "gg_spend_per_qualified_phone_conversion",
    label: "CP/SĐTCL chuyển đổi Google",
  },
  {
    value: "total_qualified_phone_ads",
    label: "Tổng SĐTCL quảng cáo (ads)",
  },
  {
    value: "spend_per_total_qualified_phone_ads",
    label: "CP/Tổng SĐTCL quảng cáo (ads)",
  },
  {
    value: "new_customer_order",
    label: "Đơn khách mới",
  },
  {
    value: "old_customer_order",
    label: "Đơn khách cũ",
  },
  {
    value: "revenue_crm_not_appointment",
    label: "Doanh thu CRM (không hẹn)",
  },
  {
    value: "revenue_livestream",
    label: "Doanh thu livestream",
  },
  {
    value: "revenue_not_appointment",
    label: "Doanh thu (không hẹn)",
  },
  {
    value: "revenue_not_appointment_not_crm",
    label: "Doanh thu chính (không hẹn)",
  },
];

export const FILTER_CHART_OPTIONS_PERFORMANCE_MATKETER: SelectOptionType[] = [
  { value: "spend", label: "Chi phí" },
  { value: "revenue", label: "Tổng doanh thu" },
  { value: "total_phone", label: "Tổng SĐT" },
  { value: "total_qualified", label: "Tổng SĐTCL" },
];

export const FILTER_CHART_OPTIONS_BUY_RATE_BY_CHANNEL: SelectOptionType[] = [
  { value: "total", label: "Tổng" },
  { value: "post_qualified", label: "SĐTCL sau xử lí" },
  { value: "buy", label: "Có mua" },
];

export const typeFilterPerformanceMarketer = {
  TOTAL: "TOTAL",
  FACEBOOK_CONVERSION: "FACEBOOK_CONVERSION",
  FACEBOOK_MESSAGE: "FACEBOOK_MESSAGE",
  GOOGLE: "GOOGLE",
};

export const FILTER_DATA_OPTIONS_PERFORMANCE_MATKETER: SelectOptionType[] = [
  { value: typeFilterPerformanceMarketer.TOTAL, label: "Tổng" },
  { value: typeFilterPerformanceMarketer.FACEBOOK_CONVERSION, label: "Chuyển đổi Facebook" },
  { value: typeFilterPerformanceMarketer.FACEBOOK_MESSAGE, label: "Tin nhắn Facebook" },
  { value: typeFilterPerformanceMarketer.GOOGLE, label: "Google" },
];

export const MARK_SLIDER_OBJECTIVE_REVENUE = [
  { value: 1000000, label: fShortenNumber(1000000) },
  { value: 50000000, label: fShortenNumber(50000000) },
  { value: 100000000, label: fShortenNumber(100000000) },
  { value: 200000000, label: fShortenNumber(200000000) },
  { value: 300000000, label: fShortenNumber(300000000) },
  { value: 400000000, label: fShortenNumber(400000000) },
  { value: 500000000, label: fShortenNumber(500000000) },
  { value: 600000000, label: fShortenNumber(600000000) },
  { value: 700000000, label: fShortenNumber(700000000) },
  { value: 800000000, label: fShortenNumber(800000000) },
  { value: 900000000, label: fShortenNumber(900000000) },
  { value: 1000000000, label: fShortenNumber(1000000000) },
];

export const message = {
  CREATE_TARGET_SUCCESS: "Tạo mục tiêu thành công",
  CREATE_TARGET_FAILED: "Mục tiêu đã tồn tại",
  UPDATE_TARGET_SUCCESS: "Cập nhật mục tiêu thành công",
  UPDATE_TARGET_FAILED: "Cập nhật mục tiêu thất bại",
};

export const arrAttachUnitVnd = [
  "revenue",
  "return_rate",
  "revenue_crm",
  "revenue_offline",
  "revenue_livestream",
  "revenue_ecom",
  "revenue_ads",
  "revenue_per_order",
  "total_spend",
  "fb_spend",
  "gg_spend",
  "spend_per_qualified_phone_exclude_crm",
  "total_spend_per_ads_qualified",
];
