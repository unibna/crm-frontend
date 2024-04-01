import { GridColumnExtension } from "@devexpress/dx-react-grid";
import { ColumnShow } from "_types_/FacebookType";
import { SelectOptionType } from "_types_/SelectOptionType";

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
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
  UPDATE_DATA_TABLE: "UPDATE_DATA_TABLE",
  RESIZE_COLUMN_TABLE: "RESIZE_COLUMN_TABLE",
  UPDATE_COLUMN_TABLE: "UPDATE_COLUMN_TABLE",
  RESIZE_COLUMN_REPORT_SELLER_BY_DATE: "RESIZE_COLUMN_REPORT_SELLER_BY_DATE",
  UPDATE_REPORT_SELLER_BY_DATE: "UPDATE_REPORT_SELLER_BY_DATE",
  UPDATE_COLUMN_ORDER_REPORT_SELLER_BY_DATE: "UPDATE_COLUMN_ORDER_REPORT_SELLER_BY_DATE",
  RESIZE_COLUMN_REPORT_TEAM_BY_DATE: "RESIZE_COLUMN_REPORT_TEAM_BY_DATE",
  UPDATE_REPORT_TEAM_BY_DATE: "UPDATE_REPORT_TEAM_BY_DATE",
  UPDATE_COLUMN_ORDER_REPORT_TEAM_BY_DATE: "UPDATE_COLUMN_ORDER_REPORT_TEAM_BY_DATE",
};

export const reportSellerByDateColumns: ColumnShow = {
  columnsShowHeader: [
    {
      title: "Telesale",
      name: "telesale",
      isShow: true,
    },
    {
      title: "Tổng lead được chia",
      name: "total_lead_assigned",
      isShow: true,
    },
    {
      title: "Tổng lead data nóng được chia",
      name: "hot_lead_assigned",
      isShow: true,
    },
    {
      title: "Tổng lead data lạnh được chia",
      name: "cold_lead_assigned",
      isShow: true,
    },
    {
      title: "Tổng lead đã xử lý",
      name: "total_lead_processed",
      isShow: true,
    },
    {
      title: "Tổng lead data lạnh đã xử lý",
      name: "cold_lead_processed",
      isShow: true,
    },
    {
      title: "Tổng lead data lạnh có mua",
      name: "cold_lead_processed_is_buy",
      isShow: true,
    },
    {
      title: "Tỷ lệ kcl data lạnh",
      name: "cold_lead_not_qualified_ratio",
      isShow: true,
    },
    {
      title: "Tỷ lệ chốt data lạnh",
      name: "cold_lead_is_buy_ratio",
      isShow: true,
    },
    {
      title: "Tổng lead data nóng đã xử lý",
      name: "hot_lead_processed",
      isShow: true,
    },
    {
      title: "Tổng lead data nóng có mua",
      name: "hot_lead_processed_is_buy",
      isShow: true,
    },
    {
      title: "Tỷ lệ kcl data nóng",
      name: "hot_lead_not_qualified_ratio",
      isShow: true,
    },
    {
      title: "Tỷ lệ chốt data nóng",
      name: "hot_lead_is_buy_ratio",
      isShow: true,
    },
    {
      title: "Tổng doanh thu",
      name: "total_revenue",
      isShow: true,
    },
    {
      title: "Doanh thu data nóng",
      name: "hot_revenue",
      isShow: true,
    },
    {
      title: "Doanh thu data lạnh",
      name: "cold_revenue",
      isShow: true,
    },
    {
      title: "Tổng đơn hàng",
      name: "total_order",
      isShow: true,
    },
    {
      title: "Đơn hàng data nóng",
      name: "hot_order",
      isShow: true,
    },
    {
      title: "Đơn hàng data lạnh",
      name: "cold_order",
      isShow: true,
    },
    {
      title: "AOV data nóng",
      name: "hot_data_aov",
      isShow: true,
    },
    {
      title: "AOV data lạnh",
      name: "cold_data_aov",
      isShow: true,
    },
    {
      title: "Trung bình doanh thu data nóng / lead nóng",
      name: "hot_data_revenue_per_lead",
      isShow: true,
    },
    {
      title: "Trung bình doanh thu data lạnh / lead lạnh",
      name: "cold_data_revenue_per_lead",
      isShow: true,
    },
    {
      title: "Talk time",
      name: "talktime",
      isShow: true,
    },
    // {
    //   title: "Talk time TB",
    //   name: "talktime_per_tls",
    //   isShow: true,
    // },
    {
      title: "Cuộc gọi đến",
      name: "inbound",
      isShow: true,
    },
    {
      title: "Cuộc gọi đi",
      name: "outbound",
      isShow: true,
    },
  ],
  columnWidths: [
    {
      columnName: "telesale",
      width: 250,
    },
    {
      columnName: "total_lead_assigned",
      width: 150,
    },
    {
      columnName: "hot_lead_assigned",
      width: 150,
    },
    {
      columnName: "cold_lead_assigned",
      width: 150,
    },
    {
      columnName: "total_lead_processed",
      width: 150,
    },
    {
      columnName: "cold_lead_processed",
      width: 150,
    },
    {
      columnName: "cold_lead_processed_is_buy",
      width: 150,
    },
    {
      columnName: "cold_lead_not_qualified_ratio",
      width: 150,
    },
    {
      columnName: "cold_lead_is_buy_ratio",
      width: 150,
    },
    {
      columnName: "hot_lead_processed",
      width: 150,
    },
    {
      columnName: "hot_lead_processed_is_buy",
      width: 150,
    },
    {
      columnName: "hot_lead_not_qualified_ratio",
      width: 150,
    },
    {
      columnName: "hot_lead_is_buy_ratio",
      width: 150,
    },
    {
      columnName: "total_revenue",
      width: 150,
    },
    {
      columnName: "hot_revenue",
      width: 150,
    },
    {
      columnName: "cold_revenue",
      width: 150,
    },
    {
      columnName: "total_order",
      width: 150,
    },
    {
      columnName: "hot_order",
      width: 150,
    },
    {
      columnName: "cold_order",
      width: 150,
    },
    {
      columnName: "hot_data_aov",
      width: 150,
    },
    {
      columnName: "cold_data_aov",
      width: 150,
    },
    {
      columnName: "hot_data_revenue_per_lead",
      width: 150,
    },
    {
      columnName: "cold_data_revenue_per_lead",
      width: 150,
    },
    {
      columnName: "talktime",
      width: 150,
    },
    // {
    //   columnName: "talktime_per_tls",
    //   width: 150,
    // },
    {
      columnName: "lead_processed_per_tls",
      width: 150,
    },
    {
      columnName: "revenue_per_tls",
      width: 150,
    },
    {
      columnName: "inbound",
      width: 150,
    },
    {
      columnName: "outbound",
      width: 150,
    },
  ],
};

export const reportTeamByDateColumns: ColumnShow = {
  columnsShowHeader: [
    {
      title: "Ngày",
      name: "date",
      isShow: true,
    },
    {
      title: "Tổng lead được chia",
      name: "total_lead_assigned",
      isShow: true,
    },
    {
      title: "Tổng lead data nóng được chia",
      name: "hot_lead_assigned",
      isShow: true,
    },
    {
      title: "Tổng lead data lạnh được chia",
      name: "cold_lead_assigned",
      isShow: true,
    },
    {
      title: "Tổng lead đã xử lý",
      name: "total_lead_processed",
      isShow: true,
    },
    {
      title: "Tổng lead data lạnh đã xử lý",
      name: "cold_lead_processed",
      isShow: true,
    },
    {
      title: "Tổng lead data lạnh có mua",
      name: "cold_lead_processed_is_buy",
      isShow: true,
    },
    {
      title: "Tỷ lệ kcl data lạnh",
      name: "cold_lead_not_qualified_ratio",
      isShow: true,
    },
    {
      title: "Tỷ lệ chốt data lạnh",
      name: "cold_lead_is_buy_ratio",
      isShow: true,
    },
    {
      title: "Tổng lead data nóng đã xử lý",
      name: "hot_lead_processed",
      isShow: true,
    },
    {
      title: "Tổng lead data nóng có mua",
      name: "hot_lead_processed_is_buy",
      isShow: true,
    },
    {
      title: "Tỷ lệ kcl data nóng",
      name: "hot_lead_not_qualified_ratio",
      isShow: true,
    },
    {
      title: "Tỷ lệ chốt data nóng",
      name: "hot_lead_is_buy_ratio",
      isShow: true,
    },
    {
      title: "Tổng doanh thu",
      name: "total_revenue",
      isShow: true,
    },
    {
      title: "Doanh thu data nóng",
      name: "hot_revenue",
      isShow: true,
    },
    {
      title: "Doanh thu data lạnh",
      name: "cold_revenue",
      isShow: true,
    },
    {
      title: "Tổng đơn hàng",
      name: "total_order",
      isShow: true,
    },
    {
      title: "Đơn hàng data nóng",
      name: "hot_order",
      isShow: true,
    },
    {
      title: "Đơn hàng data lạnh",
      name: "cold_order",
      isShow: true,
    },
    {
      title: "AOV data nóng",
      name: "hot_data_aov",
      isShow: true,
    },
    {
      title: "AOV data lạnh",
      name: "cold_data_aov",
      isShow: true,
    },
    {
      title: "Trung bình doanh thu data nóng / lead nóng",
      name: "hot_data_revenue_per_lead",
      isShow: true,
    },
    {
      title: "Trung bình doanh thu data lạnh / lead lạnh",
      name: "cold_data_revenue_per_lead",
      isShow: true,
    },
    {
      title: "Talk time",
      name: "talktime",
      isShow: true,
    },
    {
      title: "Talk time TB",
      name: "talktime_per_tls",
      isShow: true,
    },
    {
      title: "Tổng telesale làm việc trong ngày",
      name: "total_online_tls",
      isShow: true,
    },
    {
      title: "Cuộc gọi đến",
      name: "inbound",
      isShow: true,
    },
    {
      title: "Cuộc gọi đi",
      name: "outbound",
      isShow: true,
    },
  ],
  columnWidths: [
    {
      columnName: "date",
      width: 180,
    },
    {
      columnName: "total_lead_assigned",
      width: 150,
    },
    {
      columnName: "hot_lead_assigned",
      width: 150,
    },
    {
      columnName: "cold_lead_assigned",
      width: 150,
    },
    {
      columnName: "total_lead_processed",
      width: 150,
    },
    {
      columnName: "cold_lead_processed",
      width: 150,
    },
    {
      columnName: "cold_lead_processed_is_buy",
      width: 150,
    },
    {
      columnName: "cold_lead_not_qualified_ratio",
      width: 150,
    },
    {
      columnName: "cold_lead_is_buy_ratio",
      width: 150,
    },
    {
      columnName: "hot_lead_processed",
      width: 150,
    },
    {
      columnName: "hot_lead_processed_is_buy",
      width: 150,
    },
    {
      columnName: "hot_lead_not_qualified_ratio",
      width: 150,
    },
    {
      columnName: "hot_lead_is_buy_ratio",
      width: 150,
    },
    {
      columnName: "total_revenue",
      width: 150,
    },
    {
      columnName: "hot_revenue",
      width: 150,
    },
    {
      columnName: "cold_revenue",
      width: 150,
    },
    {
      columnName: "total_order",
      width: 150,
    },
    {
      columnName: "hot_order",
      width: 150,
    },
    {
      columnName: "cold_order",
      width: 150,
    },
    {
      columnName: "hot_data_aov",
      width: 150,
    },
    {
      columnName: "cold_data_aov",
      width: 150,
    },
    {
      columnName: "hot_data_revenue_per_lead",
      width: 150,
    },
    {
      columnName: "cold_data_revenue_per_lead",
      width: 150,
    },
    {
      columnName: "talktime",
      width: 150,
    },
    {
      columnName: "talktime_per_tls",
      width: 150,
    },
    {
      columnName: "total_online_tls",
      width: 150,
    },
    {
      columnName: "inbound",
      width: 150,
    },
    {
      columnName: "outbound",
      width: 150,
    },
  ],
};

export const reportSellerByDateColumnExtensions: GridColumnExtension[] = [
  {
    columnName: "telesale",
    align: "center",
  },
  {
    columnName: "total_lead_assigned",
    align: "center",
  },
  {
    columnName: "hot_lead_assigned",
    align: "center",
  },
  {
    columnName: "cold_lead_assigned",
    align: "center",
  },
  {
    columnName: "total_lead_processed",
    align: "center",
  },
  {
    columnName: "cold_lead_processed",
    align: "center",
  },
  {
    columnName: "cold_lead_processed_is_buy",
    align: "center",
  },
  {
    columnName: "cold_lead_not_qualified_ratio",
    align: "center",
  },
  {
    columnName: "cold_lead_is_buy_ratio",
    align: "center",
  },
  {
    columnName: "hot_lead_processed",
    align: "center",
  },
  {
    columnName: "hot_lead_processed_is_buy",
    align: "center",
  },
  {
    columnName: "hot_lead_not_qualified_ratio",
    align: "center",
  },
  {
    columnName: "hot_lead_is_buy_ratio",
    align: "center",
  },
  {
    columnName: "total_revenue",
    align: "center",
  },
  {
    columnName: "hot_revenue",
    align: "center",
  },
  {
    columnName: "cold_revenue",
    align: "center",
  },
  {
    columnName: "total_order",
    align: "center",
  },
  {
    columnName: "hot_order",
    align: "center",
  },
  {
    columnName: "cold_order",
    align: "center",
  },
  {
    columnName: "hot_data_aov",
    align: "center",
  },
  {
    columnName: "cold_data_aov",
    align: "center",
  },
  {
    columnName: "hot_data_revenue_per_lead",
    align: "center",
  },
  {
    columnName: "cold_data_revenue_per_lead",
    align: "center",
  },
  {
    columnName: "talktime",
    align: "center",
  },
  {
    columnName: "talktime_per_tls",
    align: "center",
  },
  {
    columnName: "total_online_tls",
    align: "center",
  },
  {
    columnName: "inbound",
    align: "center",
  },
  {
    columnName: "outbound",
    align: "center",
  },
];

export const reportTeamByDateColumnExtensions: GridColumnExtension[] = [
  {
    columnName: "date",
    align: "center",
  },
  {
    columnName: "total_lead_assigned",
    align: "center",
  },
  {
    columnName: "hot_lead_assigned",
    align: "center",
  },
  {
    columnName: "cold_lead_assigned",
    align: "center",
  },
  {
    columnName: "total_lead_processed",
    align: "center",
  },
  {
    columnName: "cold_lead_processed",
    align: "center",
  },
  {
    columnName: "cold_lead_processed_is_buy",
    align: "center",
  },
  {
    columnName: "cold_lead_not_qualified_ratio",
    align: "center",
  },
  {
    columnName: "cold_lead_is_buy_ratio",
    align: "center",
  },
  {
    columnName: "hot_lead_processed",
    align: "center",
  },
  {
    columnName: "hot_lead_processed_is_buy",
    align: "center",
  },
  {
    columnName: "hot_lead_not_qualified_ratio",
    align: "center",
  },
  {
    columnName: "hot_lead_is_buy_ratio",
    align: "center",
  },
  {
    columnName: "total_revenue",
    align: "center",
  },
  {
    columnName: "hot_revenue",
    align: "center",
  },
  {
    columnName: "cold_revenue",
    align: "center",
  },
  {
    columnName: "total_order",
    align: "center",
  },
  {
    columnName: "hot_order",
    align: "center",
  },
  {
    columnName: "cold_order",
    align: "center",
  },
  {
    columnName: "hot_data_aov",
    align: "center",
  },
  {
    columnName: "cold_data_aov",
    align: "center",
  },
  {
    columnName: "hot_data_revenue_per_lead",
    align: "center",
  },
  {
    columnName: "cold_data_revenue_per_lead",
    align: "center",
  },
  {
    columnName: "talktime",
    align: "center",
  },
  {
    columnName: "talktime_per_tls",
    align: "center",
  },
  {
    columnName: "total_online_tls",
    align: "center",
  },
  {
    columnName: "inbound",
    align: "center",
  },
  {
    columnName: "outbound",
    align: "center",
  },
];

export const FILTER_CHART_OPTIONS_BY_DATE: SelectOptionType[] = [
  {
    label: "Tổng lead được chia",
    value: "total_lead_assigned",
  },
  {
    label: "Tổng lead data nóng được chia",
    value: "hot_lead_assigned",
  },
  {
    label: "Tổng lead data lạnh được chia",
    value: "cold_lead_assigned",
  },
  {
    label: "Tổng lead đã xử lý",
    value: "total_lead_processed",
  },
  {
    label: "Tổng lead data lạnh đã xử lý",
    value: "cold_lead_processed",
  },
  {
    label: "Tổng lead data lạnh có mua",
    value: "cold_lead_processed_is_buy",
  },
  {
    label: "Tỷ lệ kcl data lạnh",
    value: "cold_lead_not_qualified_ratio",
  },
  {
    label: "Tỷ lệ chốt data lạnh",
    value: "cold_lead_is_buy_ratio",
  },
  {
    label: "Tổng lead data nóng đã xử lý",
    value: "hot_lead_processed",
  },
  {
    label: "Tổng lead data nóng có mua",
    value: "hot_lead_processed_is_buy",
  },
  {
    label: "Tỷ lệ kcl data nóng",
    value: "hot_lead_not_qualified_ratio",
  },
  {
    label: "Tỷ lệ chốt data nóng",
    value: "hot_lead_is_buy_ratio",
  },
  {
    label: "Tổng doanh thu",
    value: "total_revenue",
    isShow: true,
  },
  {
    label: "Doanh thu data nóng",
    value: "hot_revenue",
  },
  {
    label: "Doanh thu data lạnh",
    value: "cold_revenue",
  },
  {
    label: "Tổng đơn hàng",
    value: "total_order",
  },
  {
    label: "Đơn hàng data nóng",
    value: "hot_order",
  },
  {
    label: "Đơn hàng data lạnh",
    value: "cold_order",
  },
  {
    label: "AOV data nóng",
    value: "hot_data_aov",
  },
  {
    label: "AOV data lạnh",
    value: "cold_data_aov",
  },
  {
    label: "Trung bình doanh thu data nóng / lead nóng",
    value: "hot_data_revenue_per_lead",
  },
  {
    label: "Trung bình doanh thu data lạnh / lead lạnh",
    value: "cold_data_revenue_per_lead",
  },
  {
    label: "Talk time",
    value: "talktime",
  },
  {
    label: "Talk time TB",
    value: "talktime_per_tls",
  },
  {
    label: "Tổng telesale làm việc trong ngày",
    value: "total_online_tls",
  },
  {
    label: "Cuộc gọi đến",
    value: "inbound",
  },
  {
    label: "Cuộc gọi đi",
    value: "outbound",
  },
];

export const arrayFieldFormatNumber = [
  "total_lead_assigned",
  "hot_lead_assigned",
  "cold_lead_assigned",
  "total_lead_processed",
  "cold_lead_processed",
  "hot_lead_processed",
  "total_order",
  "hot_order",
  "cold_order",
  "lead_processed_per_tls",
  "cold_lead_processed_is_buy",
  "hot_lead_processed_is_buy",
  "outbound",
  "inbound"
];

export const arrayFieldFormatCurrency = [
  "total_revenue",
  "cold_revenue",
  "hot_revenue",
  "revenue_per_tls",
  "hot_data_aov",
  "cold_data_aov",
  "hot_data_revenue_per_lead",
  "cold_data_revenue_per_lead",
];

export const arrayFieldFormatPercent = [
  "hot_lead_is_buy_ratio",
  "cold_lead_is_buy_ratio",
  "hot_lead_not_qualified_ratio",
  "cold_lead_not_qualified_ratio"
];

export const arrayFieldConvertSecondsToTimeString = [
  "talktime_per_tls",
  "talktime"
];

export const summaryColumnReportSellerByDate = [
  {
    columnName: "total_lead_assigned",
    type: "sum",
  },
  {
    columnName: "hot_lead_assigned",
    type: "sum",
  },
  {
    columnName: "cold_lead_assigned",
    type: "sum",
  },
  {
    columnName: "total_lead_processed",
    type: "sum",
  },
  {
    columnName: "cold_lead_processed",
    type: "sum",
  },
  {
    columnName: "cold_lead_processed_is_buy",
    type: "sum",
  },
  {
    columnName: "cold_lead_not_qualified_ratio",
    type: "sum",
  },
  {
    columnName: "cold_lead_is_buy_ratio",
    type: "sum",
  },
  {
    columnName: "hot_lead_processed",
    type: "sum",
  },
  {
    columnName: "hot_lead_processed_is_buy",
    type: "sum",
  },
  {
    columnName: "hot_lead_not_qualified_ratio",
    type: "sum",
  },
  {
    columnName: "hot_lead_is_buy_ratio",
    type: "sum",
  },
  {
    columnName: "total_revenue",
    type: "sum",
  },
  {
    columnName: "hot_revenue",
    type: "sum",
  },
  {
    columnName: "cold_revenue",
    type: "sum",
  },
  {
    columnName: "total_order",
    type: "sum",
  },
  {
    columnName: "hot_order",
    type: "sum",
  },
  {
    columnName: "cold_order",
    type: "sum",
  },
  {
    columnName: "hot_data_aov",
    type: "sum",
  },
  {
    columnName: "cold_data_aov",
    type: "sum",
  },
  {
    columnName: "hot_data_revenue_per_lead",
    type: "sum",
  },
  {
    columnName: "cold_data_revenue_per_lead",
    type: "sum",
  },
  {
    columnName: "talktime",
    type: "sum",
  },
  {
    columnName: "talktime_per_tls",
    type: "sum",
  },
  {
    columnName: "inbound",
    type: "sum",
  },
  {
    columnName: "outbound",
    type: "sum",
  },
];

export const summaryColumnReportTeamByDate = [
  {
    columnName: "total_lead_assigned",
    type: "sum",
  },
  {
    columnName: "hot_lead_assigned",
    type: "sum",
  },
  {
    columnName: "cold_lead_assigned",
    type: "sum",
  },
  {
    columnName: "total_lead_processed",
    type: "sum",
  },
  {
    columnName: "cold_lead_processed",
    type: "sum",
  },
  {
    columnName: "cold_lead_processed_is_buy",
    type: "sum",
  },
  {
    columnName: "cold_lead_not_qualified_ratio",
    type: "sum",
  },
  {
    columnName: "cold_lead_is_buy_ratio",
    type: "sum",
  },
  {
    columnName: "hot_lead_processed",
    type: "sum",
  },
  {
    columnName: "hot_lead_processed_is_buy",
    type: "sum",
  },
  {
    columnName: "hot_lead_not_qualified_ratio",
    type: "sum",
  },
  {
    columnName: "hot_lead_is_buy_ratio",
    type: "sum",
  },
  {
    columnName: "total_revenue",
    type: "sum",
  },
  {
    columnName: "hot_revenue",
    type: "sum",
  },
  {
    columnName: "cold_revenue",
    type: "sum",
  },
  {
    columnName: "total_order",
    type: "sum",
  },
  {
    columnName: "hot_order",
    type: "sum",
  },
  {
    columnName: "cold_order",
    type: "sum",
  },
  {
    columnName: "hot_data_aov",
    type: "sum",
  },
  {
    columnName: "cold_data_aov",
    type: "sum",
  },
  {
    columnName: "hot_data_revenue_per_lead",
    type: "sum",
  },
  {
    columnName: "cold_data_revenue_per_lead",
    type: "sum",
  },
  {
    columnName: "talktime",
    type: "sum",
  },
  {
    columnName: "talktime_per_tls",
    type: "sum",
  },
  {
    columnName: "total_online_tls",
    type: "sum",
  },
  {
    columnName: "inbound",
    type: "sum",
  },
  {
    columnName: "outbound",
    type: "sum",
  },
];
