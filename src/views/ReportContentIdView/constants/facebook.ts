import { ContentIdFacebookType } from "_types_/ContentIdType";
import { ColumnShowDatagrid } from "_types_/FacebookType";

export const columnShowContentIdFacebookDefault: ColumnShowDatagrid<ContentIdFacebookType> = {
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
      name: "total_qualified",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "Chi phí/Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "total_revenue",
      title: "Doanh thu",
      isShow: true,
    },
    {
      name: "total_orders",
      title: "Tổng đơn hàng",
      isShow: true,
    },
    {
      name: "total_phone",
      title: "Tổng SĐT",
      isShow: true,
    },
    {
      name: "cost_per_total_phone",
      title: "Chi phí/Tổng SĐT",
      isShow: true,
    },
    {
      name: "ladi_qualified",
      title: "SĐTCL từ landing page",
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
      name: "comment_qualified",
      title: "SĐTCL từ Comment",
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
      name: "inbox_qualified",
      title: "SĐTCL từ Inbox",
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
    {
      name: "comment_phone",
      title: "Tổng SĐT từ Comment",
      isShow: true,
    },
    {
      name: "inbox_phone",
      title: "Tổng SĐT từ Inbox",
      isShow: true,
    },
    {
      name: "ladi_phone",
      title: "Tổng SĐT từ landing page",
      isShow: true,
    },
    {
      name: "kol_koc",
      title: "KOL/ KOC",
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
      name: "total_qualified",
      column: "total_qualified",
      isShowTitle: false,
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      column: "cost_per_total_qualified",
      isShowTitle: false,
      title: "Chi phí/Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "total_revenue",
      column: "total_revenue",
      isShowTitle: false,
      title: "Doanh thu",
      isShow: true,
    },
    {
      name: "total_orders",
      column: "total_orders",
      isShowTitle: false,
      title: "Tổng đơn hàng",
      isShow: true,
    },
    {
      name: "total_phone",
      column: "total_phone",
      isShowTitle: false,
      title: "Tổng SĐT",
      isShow: true,
    },
    {
      name: "cost_per_total_phone",
      column: "cost_per_total_phone",
      isShowTitle: false,
      title: "Chi phí/Tổng SĐT",
      isShow: true,
    },
    {
      name: "ladi_qualified",
      column: "ladi_qualified",
      isShowTitle: false,
      title: "SĐTCL từ landing page",
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
      name: "comment_qualified",
      column: "comment_qualified",
      isShowTitle: false,
      title: "SĐTCL từ Comment",
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
      name: "inbox_qualified",
      column: "inbox_qualified",
      isShowTitle: false,
      title: "SĐTCL từ Inbox",
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
    {
      name: "comment_phone",
      column: "comment_phone",
      isShowTitle: false,
      title: "Tổng SĐT từ Comment",
      isShow: true,
    },
    {
      name: "inbox_phone",
      column: "inbox_phone",
      isShowTitle: false,
      title: "Tổng SĐT từ Inbox",
      isShow: true,
    },
    {
      name: "ladi_phone",
      column: "ladi_phone",
      isShowTitle: false,
      title: "Tổng SĐT từ landing page",
      isShow: true,
    },
    {
      name: "kol_koc",
      column: "kol_koc",
      isShowTitle: false,
      title: "KOL/ KOC",
      isShow: true,
    },
  ],
};

export const columnShowContentIdFacebookByContentId: ColumnShowDatagrid<ContentIdFacebookType> = {
  columnWidths: columnShowContentIdFacebookDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "content_id",
      title: "Content",
      isShow: true,
    },
    ...columnShowContentIdFacebookDefault.columnsShowHeader,
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
      name: "product",
      column: "content_id",
      title: "Sản phẩm",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "body",
      title: "Nội dung",
      column: "content_id",
      isShow: true,
      isShowTitle: false,
    },
    ...columnShowContentIdFacebookDefault.columnShowTable,
  ],
};

export const columnShowContentIdFacebookFilterConversation: ColumnShowDatagrid<ContentIdFacebookType> =
  {
    columnWidths: columnShowContentIdFacebookDefault.columnWidths,
    columnsShowHeader: [
      {
        name: "content_id",
        title: "Content",
        isShow: true,
      },
      ...columnShowContentIdFacebookDefault.columnsShowHeader,
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
        name: "product",
        column: "content_id",
        title: "Sản phẩm",
        isShow: true,
        isShowTitle: false,
      },
      {
        name: "body",
        title: "Nội dung",
        column: "content_id",
        isShow: true,
        isShowTitle: false,
      },
      ...columnShowContentIdFacebookDefault.columnShowTable,
    ],
  };

export const columnShowContentIdFacebookFilterMessage: ColumnShowDatagrid<ContentIdFacebookType> = {
  columnWidths: columnShowContentIdFacebookDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "content_id",
      title: "Content",
      isShow: true,
    },
    ...columnShowContentIdFacebookDefault.columnsShowHeader,
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
      name: "product",
      column: "content_id",
      title: "Sản phẩm",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "body",
      title: "Nội dung",
      column: "content_id",
      isShow: true,
      isShowTitle: false,
    },
    ...columnShowContentIdFacebookDefault.columnShowTable,
  ],
};

// Detail

export const columnShowContentIdFacebookPostDetail: ColumnShowDatagrid<ContentIdFacebookType> = {
  columnWidths: columnShowContentIdFacebookDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "content_id",
      title: "Content",
      isShow: true,
    },
    ...columnShowContentIdFacebookDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "page_name",
      title: "Page",
      column: "content_id",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "body",
      title: "Nội dung",
      column: "content_id",
      isShow: true,
      isShowTitle: false,
    },
    ...columnShowContentIdFacebookDefault.columnShowTable,
  ],
};

export const columnShowContentIdFacebookByDateDetail: ColumnShowDatagrid<ContentIdFacebookType> = {
  columnWidths: columnShowContentIdFacebookDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "created_date",
      title: "Ngày",
      isShow: true,
    },
    ...columnShowContentIdFacebookDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "created_date",
      column: "created_date",
      isShowTitle: false,
      title: "Ngày",
      isShow: true,
    },
    ...columnShowContentIdFacebookDefault.columnShowTable,
  ],
};

export const columnShowContentIdFacebookCampaignDetail: ColumnShowDatagrid<ContentIdFacebookType> =
  {
    columnWidths: columnShowContentIdFacebookDefault.columnWidths,
    columnsShowHeader: [
      {
        name: "campaign_name",
        title: "Tên chiến dịch",
        isShow: true,
      },
      ...columnShowContentIdFacebookDefault.columnsShowHeader,
    ],
    columnShowTable: [
      {
        name: "campaign_name",
        column: "campaign_name",
        isShowTitle: false,
        title: "Tên chiến dịch",
        isShow: true,
      },
      ...columnShowContentIdFacebookDefault.columnShowTable,
    ],
  };
