import { ContentIdTiktokType } from "_types_/ContentIdType";
import { ColumnShowDatagrid } from "_types_/FacebookType";

export const columnShowContentIdTiktokDefault: ColumnShowDatagrid<ContentIdTiktokType> = {
  columnWidths: [
    { columnName: "phone_total", width: 150 },
    { columnName: "phone_qualified", width: 150 },
    { columnName: "spend", width: 150 },
    { columnName: "cost_per_conversion", width: 150 },
    { columnName: "conversion", width: 150 },
    { columnName: "clicks", width: 150 },
    { columnName: "kol_koc", width: 100 },
    { columnName: "impressions", width: 150 },
    { columnName: "cost_per_phone_total", width: 150 },
    { columnName: "cost_per_phone_qualified", width: 150 },

    { columnName: "created_date", width: 150 },
    { columnName: "content_id", width: 250 },

    // columnShowContentIdGoogleCampaignDetail
    { columnName: "classification", width: 150 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "campaign_budget", width: 150 },
    { columnName: "campaign_start_date", width: 150 },
    { columnName: "campaign_end_date", width: 150 },
    { columnName: "phone_revenue", width: 130 },
    { columnName: "ladi_orders", width: 130 },
  ],
  columnsShowHeader: [
    {
      name: "spend",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "phone_revenue",
      title: "Doanh thu",
      isShow: true,
    },
    {
      name: "phone_qualified",
      title: "SĐTCL landing page",
      isShow: true,
    },
    {
      name: "cost_per_phone_qualified",
      title: "Chi phí/SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_conversion",
      title: "Chi phí/Lượt chuyển đổi",
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
      name: "kol_koc",
      title: "KOL/ KOC",
      isShow: true,
    },
    {
      name: "impressions",
      title: "Hiển thị",
      isShow: true,
    },
    {
      name: "phone_total",
      title: "Tổng SĐT landing page",
      isShow: true,
    },
    {
      name: "cost_per_phone_total",
      title: "Chi phí/Tổng SĐT",
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
      name: "phone_revenue",
      column: "phone_revenue",
      isShowTitle: false,
      title: "Doanh thu",
      isShow: true,
    },
    {
      name: "phone_qualified",
      column: "phone_qualified",
      isShowTitle: false,
      title: "SĐTCL landing page",
      isShow: true,
    },
    {
      name: "cost_per_phone_qualified",
      column: "cost_per_phone_qualified",
      isShowTitle: false,
      title: "Chi phí/SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_conversion",
      column: "cost_per_conversion",
      isShowTitle: false,
      title: "Chi phí/Lượt chuyển đổi",
      isShow: true,
    },
    {
      name: "conversion",
      column: "conversion",
      isShowTitle: false,
      title: "Chuyển đổi",
      isShow: true,
    },
    {
      name: "clicks",
      column: "clicks",
      isShowTitle: false,
      title: "Lượt nhấp",
      isShow: true,
    },
    {
      name: "kol_koc",
      column: "kol_koc",
      isShowTitle: false,
      title: "KOL/ KOC",
      isShow: true,
    },
    {
      name: "impressions",
      column: "impressions",
      isShowTitle: false,
      title: "Hiển thị",
      isShow: true,
    },
    {
      name: "phone_total",
      column: "phone_total",
      isShowTitle: false,
      title: "Tổng SĐT landing page",
      isShow: true,
    },
    {
      name: "cost_per_phone_total",
      column: "cost_per_phone_total",
      isShowTitle: false,
      title: "Chi phí/Tổng SĐT",
      isShow: true,
    },
  ],
};

export const columnShowContentIdTiktok: ColumnShowDatagrid<ContentIdTiktokType> = {
  columnWidths: columnShowContentIdTiktokDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "content_id",
      title: "Content",
      isShow: true,
    },
    ...columnShowContentIdTiktokDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "ad_name",
      column: "content_id",
      isShowTitle: false,
      title: "Content ID",
      isShow: true,
    },
    {
      name: "product",
      column: "content_id",
      isShowTitle: false,
      title: "Sản phẩm",
      isShow: true,
    },
    ...columnShowContentIdTiktokDefault.columnShowTable,
  ],
};

export const columnShowContentIdTiktokByDateDetail: ColumnShowDatagrid<ContentIdTiktokType> = {
  columnWidths: columnShowContentIdTiktokDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "created_date",
      title: "Ngày",
      isShow: true,
    },
    ...columnShowContentIdTiktokDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "created_date",
      column: "created_date",
      isShowTitle: false,
      title: "Ngày",
      isShow: true,
    },
    ...columnShowContentIdTiktokDefault.columnShowTable,
  ],
};

export const columnShowContentIdTiktokCampaignDetail: ColumnShowDatagrid<ContentIdTiktokType> = {
  columnWidths: columnShowContentIdTiktokDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    ...columnShowContentIdTiktokDefault.columnsShowHeader,
    {
      name: "classification",
      title: "Rule phân loai",
      isShow: true,
    },
    {
      name: "ladi_orders",
      title: "Đơn hàng",
      isShow: true,
    },
    {
      name: "campaign_budget",
      title: "Ngân sách",
      isShow: true,
    },
    {
      name: "campaign_start_date",
      title: "Thời gian bắt đầu",
      isShow: true,
    },
    {
      name: "campaign_end_date",
      title: "Thời gian kết thúc",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "campaign_name",
      title: "Chiến dịch",
      column: "campaign_name",
      isShowTitle: false,
      isShow: true,
    },
    ...columnShowContentIdTiktokDefault.columnShowTable,
    {
      name: "classification",
      column: "classification",
      isShowTitle: false,
      title: "Rule phân loại",
      isShow: true,
    },
    {
      name: "ladi_orders",
      column: "ladi_orders",
      isShowTitle: false,
      title: "Đơn hàng",
      isShow: true,
    },
    {
      name: "campaign_budget",
      column: "campaign_budget",
      isShowTitle: false,
      title: "Ngân sách",
      isShow: true,
    },
    {
      name: "campaign_start_date",
      column: "campaign_start_date",
      isShowTitle: false,
      title: "Thời gian bắt đầu",
      isShow: true,
    },
    {
      name: "campaign_end_date",
      column: "campaign_end_date",
      isShowTitle: false,
      title: "Thời gian kết thúc",
      isShow: true,
    },
  ],
};
