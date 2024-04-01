import { SelectOptionType } from "_types_/SelectOptionType";
import { yyyy_MM_dd } from "constants/time";
import { ColumnShow } from "_types_/FacebookType";
import { SummaryItem } from "@devexpress/dx-react-grid";
import { arrRenderFilterDateDefault } from "constants/index";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

export const tabHeader = {
  AD_ACCOUNT: "AD_ACCOUNT",
  CAMPAIGN: "CAMPAIGN",
  AD_SET: "AD_SET",
  AD: "AD",
  FANPAGE: "FANPAGE",
  POST: "POST",
  ATTIBUTES: "ATTIBUTES",
  EDIT_ATTIBUTES: "EDIT_ATTIBUTES",
};

export const contentModel = {
  FACEBOOK_CAMPAIGN: "facebookcampaign",
  FACEBOOK_ADSET: "facebookadset",
  FACEBOOK_AD: "facebookad",
};

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
  POST: "POST",
  CONTENT_ID: "CONTENT_ID",
  ATTIBUTES: "ATTIBUTES",
  ATTIBUTES_VALUE: "ATTIBUTES_VALUE",
  DIGITAL_FB: "DIGITAL_FB",
  PRODUCT: "PRODUCT",
};

// Type dispatch reducer in component
export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_POPUP: "UPDATE_POPUP",
  UPDATE_INITIAL_PARAMS: "UPDATE_INITIAL_PARAMS",
  UPDATE_DATA_POPUP: "UPDATE_DATA_POPUP",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_CAMPAIGN: "UPDATE_CAMPAIGN",
  UPDATE_AD_ACCOUNT: "UPDATE_AD_ACCOUNT",
  UPDATE_AD: "UPDATE_AD",
  UPDATE_AD_SET: "UPDATE_AD_SET",
  UPDATE_FANPAGE: "UPDATE_FANPAGE",
  UPDATE_POST: "UPDATE_POST",
  UPDATE_LIST_ATTRIBUTES: "UPDATE_LIST_ATTRIBUTES",
  UPDATE_CONTENT_ID: "UPDATE_CONTENT_ID",
  UPDATE_DATA_FILTER_CONTENT_ID: "UPDATE_DATA_FILTER_CONTENT_ID",
  UPDATE_ATTRIBUTES: "UPDATE_ATTRIBUTES",
  RESIZE_COLUMN_AD_ACCOUNT: "RESIZE_COLUMN_AD_ACCOUNT",
  RESIZE_COLUMN_CAMPAIGN: "RESIZE_COLUMN_CAMPAIGN",
  RESIZE_COLUMN_AD_SET: "RESIZE_COLUMN_AD_SET",
  RESIZE_COLUMN_AD: "RESIZE_COLUMN_AD",
  RESIZE_COLUMN_FANPAGE: "RESIZE_COLUMN_FANPAGE",
  RESIZE_COLUMN_POST: "RESIZE_COLUMN_POST",
  RESIZE_COLUMN_CONTENT_ID: "RESIZE_COLUMN_CONTENT_ID",
  RESIZE_COLUMN_ATTIBUTES: "RESIZE_COLUMN_ATTIBUTES",
  UPDATE_COLUMN_SELECTED_AD_ACCOUNT: "UPDATE_COLUMN_SELECTED_AD_ACCOUNT",
  UPDATE_COLUMN_SELECTED_CAMPAIGN: "UPDATE_COLUMN_SELECTED_CAMPAIGN",
  UPDATE_COLUMN_SELECTED_AD_SET: "UPDATE_COLUMN_SELECTED_AD_SET",
  UPDATE_COLUMN_SELECTED_AD: "UPDATE_COLUMN_SELECTED_AD",
  UPDATE_COLUMN_SELECTED_FANPAGE: "UPDATE_COLUMN_SELECTED_FANPAGE",
  UPDATE_COLUMN_ORDER_AD_ACCOUNT: "UPDATE_COLUMN_ORDER_AD_ACCOUNT",
  UPDATE_COLUMN_ORDER_CAMPAIGN: "UPDATE_COLUMN_ORDER_CAMPAIGN",
  UPDATE_COLUMN_ORDER_AD_SET: "UPDATE_COLUMN_ORDER_AD_SET",
  UPDATE_COLUMN_ORDER_AD: "UPDATE_COLUMN_ORDER_AD",
  UPDATE_COLUMN_ORDER_FANPAGE: "UPDATE_COLUMN_ORDER_FANPAGE",
  UPDATE_COLUMN_ORDER_POST: "UPDATE_COLUMN_ORDER_POST",
  UPDATE_COLUMN_ORDER_CONTENT_ID: "UPDATE_COLUMN_ORDER_CONTENT_ID",
  UPDATE_COLUMN_ORDER_ATTRIBUTES: "UPDATE_COLUMN_ORDER_ATTRIBUTES",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
};

// Show column
export const columnShowAdAccout: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "ad_account_name", width: 150 },
    { columnName: "isCheck", width: 50 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn tài khoản",
      isShow: true,
    },
    {
      name: "ad_account_name",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
  ],
};

// Ad
export const columnShowAd: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "ad_account_name", width: 150 },
    { columnName: "isCheck", width: 50 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "objective", width: 150 },
    { columnName: "adset_name", width: 150 },
    { columnName: "ad_name", width: 200 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn quảng cáo",
      isShow: true,
    },
    {
      name: "ad_account_name",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "adset_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "ad_name",
      title: "Quảng cáo",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "objective",
      title: "Mục tiêu",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
  ],
};

// Campaign
export const columnShowCampaign: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "isCheck", width: 50 },
    // { columnName: "attributes", width: 150 },
    { columnName: "objective", width: 150 },
    { columnName: "ad_account_name", width: 150 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "daily_budget", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
    { columnName: "days_from_start", width: 150 },
    { columnName: "lifetime_budget", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn chiến dịch",
      isShow: true,
    },
    {
      name: "ad_account_name",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    // {
    //   name: "attributes",
    //   title: "Thuộc tính",
    //   isShow: true,
    // },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "objective",
      title: "Mục tiêu",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "daily_budget",
      title: "Ngân sách hàng ngày",
      isShow: true,
    },
    {
      name: "lifetime_budget",
      title: "Ngân sách chiến dịch",
      isShow: true,
    },
    {
      name: "days_from_start",
      title: "Số ngày kể từ bắt đầu ",
      isShow: true,
    },
  ],
};

export const columnShowCampaignByDateDetail: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "date_start", width: 150 },
    { columnName: "total_adset", width: 150 },
    { columnName: "total_date", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "date_start",
      title: "Ngày bắt đầu",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "total_adset",
      title: "Tổng nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "total_date",
      title: "Tổng ngày",
      isShow: true,
    },
  ],
};

export const columnShowCampaignAdSetDetail: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "ad_account_name", width: 150 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "objective", width: 150 },
    { columnName: "adset_name", width: 150 },
    { columnName: "daily_budget", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
    { columnName: "lifetime_budget", width: 150 },
    { columnName: "days_from_start", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "ad_account_name",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "adset_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "objective",
      title: "Mục tiêu",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "daily_budget",
      title: "Ngân sách hàng ngày",
      isShow: true,
    },
    {
      name: "lifetime_budget",
      title: "Ngân sách chiến dịch",
      isShow: true,
    },
    {
      name: "days_from_start",
      title: "Số ngày kể từ bắt đầu ",
      isShow: true,
    },
  ],
};

// Ad set
export const columnShowAdSet: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "ad_account_name", width: 150 },
    { columnName: "isCheck", width: 50 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "objective", width: 150 },
    { columnName: "adset_name", width: 150 },
    { columnName: "daily_budget", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
    { columnName: "lifetime_budget", width: 150 },
    { columnName: "days_from_start", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "ad_account_name",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "adset_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "objective",
      title: "Mục tiêu",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "daily_budget",
      title: "Ngân sách hàng ngày",
      isShow: true,
    },
    {
      name: "lifetime_budget",
      title: "Ngân sách chiến dịch",
      isShow: true,
    },
    {
      name: "days_from_start",
      title: "Số ngày kể từ bắt đầu ",
      isShow: true,
    },
  ],
};

export const columnShowAdSetByDateDetail: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "date_start", width: 150 },
    { columnName: "total_ad", width: 150 },
    { columnName: "total_date", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "date_start",
      title: "Ngày bắt đầu",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "total_ad",
      title: "Tổng nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "total_date",
      title: "Tổng ngày",
      isShow: true,
    },
  ],
};

// Fanpage
export const columnShowFanpage: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "page_name", width: 150 },
    { columnName: "total_campaign", width: 150 },
    // { columnName: "isCheck", width: 50 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
  ],
  columnsShowHeader: [
    // {
    //   name: "isCheck",
    //   title: "Chọn trang",
    //   isShow: true
    // },
    {
      name: "page_name",
      title: "Trang",
      isShow: true,
    },
    {
      name: "total_campaign",
      title: "Tổng chiến dịch",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
  ],
};

// Post
export const columnShowPost: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "page_name", width: 150 },
    { columnName: "post_id", width: 250 },
    { columnName: "thumb_img", width: 200 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "total_post_comments", width: 150 },
    { columnName: "total_post_comments_phone", width: 200 },
    { columnName: "rate_post_comments_phone", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "post_id",
      title: "ID bài viết",
      isShow: true,
    },
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "page_name",
      title: "Trang",
      isShow: true,
    },
    {
      name: "total_post_comments",
      title: "Tổng bình luận",
      isShow: true,
    },
    {
      name: "total_post_comments_phone",
      title: "Tổng bình luận SĐT",
      isShow: true,
    },
    {
      name: "rate_post_comments_phone",
      title: "Tỉ lệ SĐT/Bình luận",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
  ],
};

export const columnShowPostDetail: ColumnShow = {
  columnWidths: [
    { columnName: "date_start", width: 200 },
    { columnName: "spend", width: 150 },
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "total_date", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "date_start",
      title: "Ngày",
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
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
  ],
};

// Attributes
export const columnShowAttributes: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "attributeId", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "attributeId",
      title: "Thuộc tính",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
  ],
};

export const columnShowCampaignDetail: ColumnShow = {
  columnWidths: [
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "ad_account_name", width: 150 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "daily_budget", width: 150 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 150 },
    { columnName: "messaging_conversation_started_7d", width: 150 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 150 },
    { columnName: "spend", width: 150 },
    { columnName: "days_from_start", width: 150 },
    { columnName: "lifetime_budget", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "ad_account_name",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "comment",
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Đăng ký form",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "daily_budget",
      title: "Ngân sách hàng ngày",
      isShow: true,
    },
    {
      name: "lifetime_budget",
      title: "Ngân sách chiến dịch",
      isShow: true,
    },
    {
      name: "days_from_start",
      title: "Số ngày kể từ bắt đầu ",
      isShow: true,
    },
  ],
};

// Show total value in report
export const summaryColumnAdAccount: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnCampaign: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "daily_budget", type: "sum" },
  { columnName: "lifetime_budget", type: "sum" },
];

export const summaryColumnAdSet: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "daily_budget", type: "sum" },
  { columnName: "lifetime_budget", type: "sum" },
];

export const summaryColumnAd: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnFanpage: SummaryItem[] = [
  // { columnName: "total_campaign", type: "sum" },
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnPost: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "total_post_comments", type: "sum" },
  { columnName: "total_post_comments_phone", type: "sum" },
];

// Attributes
export const summaryColumnAttributes: SummaryItem[] = [
  // { columnName: "total_campaign", type: "sum" },
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnCampaignDetail: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
  { columnName: "daily_budget", type: "sum" },
  { columnName: "lifetime_budget", type: "sum" },
];

export const summaryColumnPostDetail: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnCampaignByDateDetail: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
];

export const summaryColumnAdSetByDateDetail: SummaryItem[] = [
  { columnName: "comment", type: "sum" },
  { columnName: "spend", type: "sum" },
  { columnName: "cost_per_comment", type: "sum" },
  { columnName: "cost_per_messaging_conversation_started_7d", type: "sum" },
  { columnName: "cost_per_fb_pixel_complete_registration", type: "sum" },
  { columnName: "fb_pixel_complete_registration", type: "sum" },
  { columnName: "messaging_conversation_started_7d", type: "sum" },
];

// Data filter header
export const headerFilterStatus = [
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
];

export const dataRenderHeaderShare = [
  {
    style: {
      width: 180,
    },
    status: keyFilter.STATUS,
    title: "Trạng thái",
    options: headerFilterStatus,
    label: "effective_status",
    defaultValue: headerFilterStatus[0].value,
  },
  {
    style: {
      width: 180,
    },
    status: keyFilter.OBJECTIVE,
    title: "Mục tiêu",
    options: headerFilterObjecttive,
    label: "objective",
    defaultValue: headerFilterObjecttive[0].value,
  },
  ...arrRenderFilterDateDefault,
];

// Chart
export const FILTER_CHART_OPTIONS: SelectOptionType[] = [
  { value: "spend", label: "Chi phí" },
  { value: "comment", label: "Bình luận" },
  { value: "messaging_conversation_started_7d", label: "Tin nhắn" },
  { value: "fb_pixel_complete_registration", label: "Form" },
  { value: "cost_per_comment", label: "Chi phi / bình luận" },
  { value: "cost_per_messaging_conversation_started_7d", label: "Chi phí/ tin nhắn" },
  { value: "cost_per_fb_pixel_complete_registration", label: "Chi phí / form" },
];

// Message
export const message = {
  PLEASE_SELECT_LEAST_ONE_CAMPAIGN: "Vui lòng chọn ít nhất một chiến dịch",
  PLEASE_SELECT_LEAST_ONE_AD_SET: "Vui lòng chọn ít nhất một nhóm quảng cáo",
  PLEASE_SELECT_LEAST_ONE_AD: "Vui lòng chọn ít nhất một quảng cáo",
  ATTACH_ATTRIBUTE_SUCCESS: "Gắn thuộc tính thành công",
  UPDATE_ATTRIBUTE_SUCCESS: "Cập nhật thuộc tính thành công",
  ATTRIBUTE_ATTACHED: "Thuộc tính đã được gắn",
  PLESE_SELECT_ATTRIBUTE: "Vui lòng chọn thuộc tính",
  DELETE_ATTRIBUTE_SUCCESS: "Xoá thuộc tính thành công",
  DELETE_ATTRIBUTE_VALUE_SUCCESS: "Xóa giá trị của thuộc tính thành công",
  ADD_ATTRIBUTE_SUCCESS: "Thêm thuộc tính thành công",
  ADD_ATTRIBUTE_VALUE_SUCCESS: "Thêm giá trị của thuộc tính thành công",
  NOT_DELETE_ATTRIBUTE: "Không thể xóa thuộc tính",
  NOT_DELETE_ATTRIBUTE_VALUE: "Không thể xóa giá trị của thuộc tính",
  ATTRIBUTE_EXIST: "Thuộc tính đã tồn tại",
  ATTRIBUTE_VALUE_EXIST: "Giá trị của thuộc tính đã tồn tại",
  NOTE_SUCCESS: "Ghi chú thành công",
};

export const titlePopup = {
  ATTACH_ATTRIBUTES: "Gắn thuộc tính",
  UPDATE_ATTRIBUTES: "Cập nhật thuộc tính",
};

export const arrAttachUnitVnd = [
  "cost_per_messaging_conversation_started_7d",
  "cost_per_fb_pixel_complete_registration",
  "cost_per_comment",
  "spend",
  "daily_budget",
];

export const initialParams = {
  dateValue: 0,
  date_from: format(subDays(new Date(), 30), yyyy_MM_dd),
  date_to: format(subDays(new Date(), 30), yyyy_MM_dd),
};

export const columnEditExtensions = [
  { columnName: "date", editingEnabled: false },
  { columnName: "spend", editingEnabled: false },
  { columnName: "cost_per_comment", editingEnabled: false },
  { columnName: "total_date", editingEnabled: false },
  { columnName: "cost_per_messaging_conversation_started_7d", editingEnabled: false },
  { columnName: "comment", editingEnabled: false },
  { columnName: "fb_pixel_complete_registration", editingEnabled: false },
  { columnName: "messaging_conversation_started_7d", editingEnabled: false },
  { columnName: "cost_per_fb_pixel_complete_registration", editingEnabled: false },
  { columnName: "comment_phone_qualified", editingEnabled: false },
  { columnName: "comment_phone_total", editingEnabled: false },
  { columnName: "landingpage_phone_qualified", editingEnabled: false },
  { columnName: "landingpage_phone_total", editingEnabled: false },
  { columnName: "inbox_phone_qualified", editingEnabled: false },
  { columnName: "inbox_phone_total", editingEnabled: false },
  { columnName: "total_phone", editingEnabled: false },
  { columnName: "total_phone_qualified", editingEnabled: false },
  { columnName: "cost_per_total_phone", editingEnabled: false },
  { columnName: "cost_per_total_phone_qualified", editingEnabled: false },
  { columnName: "total_post_comments", editingEnabled: false },
  { columnName: "rate_post_comments_phone", editingEnabled: false },
];

export const arrAttachUnitPercent = ["rate_post_comments_phone"];

export const LIST_TAB_TABLE_DETAIL = ["date"];

export const arrTakeValueParamsHeader = ["date_from", "date_to", "dateValue"];

export const paramsDefault = {
  dateValue: 0,
  date_from: format(subDays(new Date(), 30), yyyy_MM_dd),
  date_to: format(subDays(new Date(), 30), yyyy_MM_dd),
};
