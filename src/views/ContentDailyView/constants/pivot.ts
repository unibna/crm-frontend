import { ColumnShowDatagrid } from "_types_/FacebookType";

export enum PIVOT {
  AD_NAME = "ad_name",
  CAMPAIGN_NAME = "campaign_name",
}

export const FILTER_PIVOT = [
  {
    label: "Ad name",
    value: PIVOT.AD_NAME,
  },
  {
    label: "Campaign name",
    value: PIVOT.CAMPAIGN_NAME,
  },
];

// COLUMN
export const columnShowContentDailyDefault: ColumnShowDatagrid<any> = {
  columnWidths: [
    { columnName: "product", width: 150 },
    { columnName: "cost_per_comment", width: 150 },
    { columnName: "comment_qualified", width: 150 },
    { columnName: "kol_koc", width: 150 },
    { columnName: "ladi_qualified", width: 150 },
    { columnName: "ladi_phone", width: 120 },
    { columnName: "content_creator", width: 100 },
    { columnName: "content_designer", width: 100 },
    { columnName: "digital_fb", width: 120 },
    { columnName: "comment_phone", width: 150 },
    { columnName: "inbox_qualified", width: 150 },
    { columnName: "inbox_phone", width: 120 },
    { columnName: "ad_name", width: 80 },
    { columnName: "thumb_img", width: 200 },
    { columnName: "daily_budget", width: 120 },
    { columnName: "cost_per_messaging_conversation_started_7d", width: 150 },
    { columnName: "comment", width: 100 },
    { columnName: "total_phone", width: 80 },
    { columnName: "total_qualified", width: 150 },
    { columnName: "cost_per_total_phone", width: 150 },
    { columnName: "cost_per_total_qualified", width: 150 },
    { columnName: "fb_pixel_complete_registration", width: 100 },
    { columnName: "messaging_conversation_started_7d", width: 100 },
    { columnName: "cost_per_fb_pixel_complete_registration", width: 120 },
    { columnName: "spend", width: 120 },
    { columnName: "cpl_1", width: 120 },
    { columnName: "cpl_3", width: 120 },
    { columnName: "cpl_7", width: 120 },
    { columnName: "total_revenue", width: 150 },
    { columnName: "total_orders", width: 120 },
    { columnName: "impressions", width: 150 },
    { columnName: "post_engagement", width: 150 },
    { columnName: "video_view", width: 150 },
    { columnName: "link_click", width: 150 },
    { columnName: "reach", width: 150 },
    { columnName: "engagement_rate", width: 150 },
    { columnName: "view_rate", width: 150 },
    { columnName: "clickthrough_rate", width: 150 },
    { columnName: "15s_watch_rate", width: 150 },
    { columnName: "avg_watch_time", width: 150 },
    { columnName: "classification", width: 150 },

    { columnName: "content_id", width: 300 },
    { columnName: "created_date", width: 150 },
    { columnName: "campaign_name", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      title: "Form",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      title: "Chi phí/Form",
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
      name: "15s_watch_rate",
      title: "Tỉ lệ người xem từ 15s",
      isShow: true,
    },
    {
      name: "avg_watch_time",
      title: "Thời gian xem TB",
      isShow: true,
    },
    {
      name: "impressions",
      title: "Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "post_engagement",
      title: "Lượt tương tác QC",
      isShow: true,
    },
    {
      name: "video_view",
      title: "Lượt xem video",
      isShow: true,
    },
    {
      name: "link_click",
      title: "Clicks",
      isShow: true,
    },
    {
      name: "reach",
      title: "Người tiếp cận",
      isShow: true,
    },
    {
      name: "engagement_rate",
      title: "Lượt tương tác QC/Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "view_rate",
      title: "Lượt xem video/Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "clickthrough_rate",
      title: "Clicks/Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "spend",
      column: "spend",
      isShowTitle: false,
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "fb_pixel_complete_registration",
      column: "fb_pixel_complete_registration",
      isShowTitle: false,
      title: "Form",
      isShow: true,
    },
    {
      name: "cost_per_fb_pixel_complete_registration",
      column: "cost_per_fb_pixel_complete_registration",
      isShowTitle: false,
      title: "Chi phí/Form",
      isShow: true,
    },
    {
      name: "comment",
      column: "comment",
      isShowTitle: false,
      title: "Bình luận",
      isShow: true,
    },
    {
      name: "cost_per_comment",
      column: "cost_per_comment",
      isShowTitle: false,
      title: "Chi phí/Bình luận",
      isShow: true,
    },
    {
      name: "15s_watch_rate",
      column: "15s_watch_rate",
      isShowTitle: false,
      title: "Tỉ lệ người xem từ 15s",
      isShow: true,
    },
    {
      name: "avg_watch_time",
      column: "avg_watch_time",
      isShowTitle: false,
      title: "Thời gian xem TB",
      isShow: true,
    },
    {
      name: "impressions",
      column: "impressions",
      isShowTitle: false,
      title: "Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "post_engagement",
      column: "post_engagement",
      isShowTitle: false,
      title: "Lượt tương tác QC",
      isShow: true,
    },
    {
      name: "video_view",
      column: "video_view",
      isShowTitle: false,
      title: "Lượt xem video",
      isShow: true,
    },
    {
      name: "link_click",
      column: "link_click",
      isShowTitle: false,
      title: "Clicks",
      isShow: true,
    },
    {
      name: "reach",
      column: "reach",
      isShowTitle: false,
      title: "Người tiếp cận",
      isShow: true,
    },
    {
      name: "engagement_rate",
      column: "engagement_rate",
      isShowTitle: false,
      title: "Lượt tương tác QC/Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "view_rate",
      column: "view_rate",
      isShowTitle: false,
      title: "Lượt xem video/Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "clickthrough_rate",
      column: "clickthrough_rate",
      isShowTitle: false,
      title: "Clicks/Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "messaging_conversation_started_7d",
      column: "messaging_conversation_started_7d",
      isShowTitle: false,
      title: "Tin nhắn",
      isShow: true,
    },
    {
      name: "cost_per_messaging_conversation_started_7d",
      column: "cost_per_messaging_conversation_started_7d",
      isShowTitle: false,
      title: "Chi phí/Tin nhắn",
      isShow: true,
    },
  ],
};

export const columnShowOverviewByContentDaily: ColumnShowDatagrid<any> = {
  columnWidths: columnShowContentDailyDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "content_id",
      title: "Content",
      isShow: true,
    },
    // ...columnShowContentDailyDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "ad_name",
      column: "content_id",
      isShowTitle: false,
      title: "Plan ID (Airtable)",
      isShow: true,
    },
    {
      name: "body",
      title: "Nội dung",
      column: "content_id",
      isShow: true,
      isShowTitle: false,
    },
    // ...columnShowContentDailyDefault.columnShowTable,
  ],
};

export const columnShowOverviewByCampaign: ColumnShowDatagrid<any> = {
  columnWidths: columnShowContentDailyDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "campaign_name",
      title: "Tên chiến dịch",
      isShow: true,
    },
    // ...columnShowContentDailyDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "campaign_name",
      column: "campaign_name",
      isShowTitle: false,
      title: "Tên chiến dịch",
      isShow: true,
    },
    // ...columnShowContentDailyDefault.columnShowTable,
  ],
};

export const columnShowPivot = {
  [PIVOT.AD_NAME]: columnShowOverviewByContentDaily,
  [PIVOT.CAMPAIGN_NAME]: columnShowOverviewByCampaign,
};
