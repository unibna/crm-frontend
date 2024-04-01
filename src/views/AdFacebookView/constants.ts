import { ColumnShow } from "_types_/FacebookType";
export type StatusSyncType = "OH" | "IP" | "RJ" | "CO";

export const statusSync = {
  OH: "OH",
  IP: "IP",
  RJ: "RJ",
  CO: "CO",
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
};

export const TYPE_EXTRA_DATA = {
  TARGETS_SPEC: 'targets_spec',
  RUN_STATUS: 'run_status',
  PAYMENT_AMOUNT: 'payment_amount',
  NAME: 'name',
  COMPOSITE_DATA: 'composite_data',
  PIXEL: 'pixel',
  OPTIMIZATION_GOAL: 'optimization_goal',
  DURATION: 'duration',
  FOUR: '4',
  BID_TYPE: 'bid_type'
}

// Type dispatch reducer in component
export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_PARAMS_FILTER: "UPDATE_PARAMS_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_CAMPAIGN: "UPDATE_CAMPAIGN",
  UPDATE_AD_ACCOUNT: "UPDATE_AD_ACCOUNT",
  UPDATE_AD: "UPDATE_AD",
  UPDATE_AD_INSIGHT: "UPDATE_AD_INSIGHT",
  UPDATE_AD_SET: "UPDATE_AD_SET",
  UPDATE_FANPAGE: "UPDATE_FANPAGE",
  UPDATE_POST: "UPDATE_POST",
  UPDATE_CONTENT_ID: "UPDATE_CONTENT_ID",
  RESIZE_COLUMN_AD_ACCOUNT: "RESIZE_COLUMN_AD_ACCOUNT",
  RESIZE_COLUMN_CAMPAIGN: "RESIZE_COLUMN_CAMPAIGN",
  RESIZE_COLUMN_AD_SET: "RESIZE_COLUMN_AD_SET",
  RESIZE_COLUMN_AD: "RESIZE_COLUMN_AD",
  RESIZE_COLUMN_AD_INSIGHT: "RESIZE_COLUMN_AD_INSIGHT",
  RESIZE_COLUMN_FANPAGE: "RESIZE_COLUMN_FANPAGE",
  RESIZE_COLUMN_POST: "RESIZE_COLUMN_POST",
  RESIZE_COLUMN_CONTENT_ID: "RESIZE_COLUMN_CONTENT_ID",
  UPDATE_COLUMN_SELECTED_AD_ACCOUNT: "UPDATE_COLUMN_SELECTED_AD_ACCOUNT",
  UPDATE_COLUMN_SELECTED_CAMPAIGN: "UPDATE_COLUMN_SELECTED_CAMPAIGN",
  UPDATE_COLUMN_SELECTED_AD_SET: "UPDATE_COLUMN_SELECTED_AD_SET",
  UPDATE_COLUMN_SELECTED_AD: "UPDATE_COLUMN_SELECTED_AD",
  UPDATE_COLUMN_ORDER_AD_ACCOUNT: "UPDATE_COLUMN_ORDER_AD_ACCOUNT",
  UPDATE_COLUMN_ORDER_CAMPAIGN: "UPDATE_COLUMN_ORDER_CAMPAIGN",
  UPDATE_COLUMN_ORDER_AD_SET: "UPDATE_COLUMN_ORDER_AD_SET",
  UPDATE_COLUMN_ORDER_AD: "UPDATE_COLUMN_ORDER_AD",
  UPDATE_COLUMN_ORDER_AD_INSIGHT: "UPDATE_COLUMN_ORDER_AD_INSIGHT",
  UPDATE_COLUMN_ORDER_FANPAGE: "UPDATE_COLUMN_ORDER_FANPAGE",
  UPDATE_COLUMN_ORDER_POST: "UPDATE_COLUMN_ORDER_POST",
  UPDATE_COLUMN_ORDER_CONTENT_ID: "UPDATE_COLUMN_ORDER_CONTENT_ID",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
};

export const columnShowCampaign: ColumnShow = {
  columnWidths: [
    { columnName: "campaign_name", width: 200 },
    { columnName: "objective", width: 150 },
    { columnName: "effective_status", width: 200 },
    { columnName: "daily_budget", width: 200 },
    { columnName: "lifetime_budget", width: 200 },
    { columnName: "start_time", width: 150 },
    { columnName: "stop_time", width: 150 },
    { columnName: "updated_time", width: 150 },
    { columnName: "created_time", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "created_time",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "updated_time",
      title: "Ngày cập nhật",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "objective",
      title: "Mục tiêu",
      isShow: true,
    },
    {
      name: "effective_status",
      title: "Trạng thái hiệu lực",
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
      name: "start_time",
      title: "Ngày bắt đầu",
      isShow: true,
    },
    {
      name: "stop_time",
      title: "Ngày kết thúc",
      isShow: true,
    },
  ],
};

export const columnShowAdSet: ColumnShow = {
  columnWidths: [
    { columnName: "campaign_name", width: 300 },
    { columnName: "campaign_objective", width: 150 },
    { columnName: "adset_name", width: 150 },
    { columnName: "effective_status", width: 150 },
    { columnName: "updated_time", width: 150 },
    { columnName: "created_time", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "created_time",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "updated_time",
      title: "Ngày cập nhật",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "campaign_objective",
      title: "Mục tiêu chiến dịch",
      isShow: true,
    },
    {
      name: "adset_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "effective_status",
      title: "Trạng thái hiệu lực",
      isShow: true,
    },
  ],
};

export const columnShowAd: ColumnShow = {
  columnWidths: [
    { columnName: "thumb_img", width: 300 },
    { columnName: "campaign_name", width: 350 },
    { columnName: "campaign_objective", width: 150 },
    { columnName: "adset_name", width: 150 },
    { columnName: "ad_name", width: 150 },
    { columnName: "effective_status", width: 150 },
    { columnName: "updated_time", width: 150 },
    { columnName: "created_time", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "created_time",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "updated_time",
      title: "Ngày cập nhật",
      isShow: true,
    },
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "campaign_objective",
      title: "Mục tiêu chiến dịch",
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
      name: "effective_status",
      title: "Trạng thái hiệu lực",
      isShow: true,
    },
  ],
};

export const columnShowAdInsight: ColumnShow = {
  columnWidths: [
    { columnName: "ad_account_name", width: 200 },
    { columnName: "campaign_name", width: 200 },
    { columnName: "adset_name", width: 200 },
    { columnName: "ad_name", width: 200 },
    { columnName: "objective", width: 150 },
    { columnName: "spend", width: 150 },
    { columnName: "impressions", width: 200 },
    { columnName: "comment", width: 200 },
    { columnName: "messaging_first_reply", width: 200 },
    { columnName: "messaging_conversation_started_7d", width: 200 },
    { columnName: "fb_pixel_complete_registration", width: 200 },
    { columnName: "date_start", width: 150 },
    { columnName: "date_stop", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "ad_account_name",
      title: "Tài khoản quảng cáo",
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
      name: "impressions",
      title: "Số lần hiển thị",
      isShow: true,
    },
    {
      name: "comment",
      title: "Nhận xét",
      isShow: true,
    },
    {
      name: "messaging_first_reply",
      title: "Tin nhắn của khách mới",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Đăng ký form trên web",
      isShow: true,
    },
    {
      name: "date_start",
      title: "Ngày bắt đầu",
      isShow: true,
    },
    {
      name: "date_stop",
      title: "Ngày dừng lại",
      isShow: true,
    },
  ],
};

export const columnShowDetailActivitiesCampaign: ColumnShow = {
  columnWidths: [
    { columnName: "actor_name", width: 170 },
    { columnName: "date_time_in_timezone", width: 170 },
    { columnName: "translated_event_type", width: 200 },
    { columnName: "extra_data", width: 340 },
  ],
  columnsShowHeader: [
    {
      name: "translated_event_type",
      title: "Hoạt động",
      isShow: true,
    },
    {
      name: "extra_data",
      title: "Mục đã thay đổi",
      isShow: true,
    },
    {
      name: "actor_name",
      title: "Người thay đổi",
      isShow: true,
    },
    {
      name: "date_time_in_timezone",
      title: "Ngày và giờ",
      isShow: true,
    }
  ],
};

export const columnShowDetailActivitiesAdSet: ColumnShow = {
  columnWidths: [
    { columnName: "actor_name", width: 170 },
    { columnName: "date_time_in_timezone", width: 170 },
    { columnName: "translated_event_type", width: 200 },
    { columnName: "extra_data", width: 340 },
  ],
  columnsShowHeader: [
    {
      name: "translated_event_type",
      title: "Hoạt động",
      isShow: true,
    },
    {
      name: "extra_data",
      title: "Mục đã thay đổi",
      isShow: true,
    },
    {
      name: "actor_name",
      title: "Người thay đổi",
      isShow: true,
    },
    {
      name: "date_time_in_timezone",
      title: "Ngày và giờ",
      isShow: true,
    }
  ],
};

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
    label: "status",
    defaultValue: headerFilterStatus[0].value,
  },
  {
    style: {
      width: 180,
    },
    status: keyFilter.OBJECTIVE,
    title: "Mục tiêu",
    options: headerFilterObjecttive,
    label: "time",
    defaultValue: headerFilterObjecttive[0].value,
  },
];
