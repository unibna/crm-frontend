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
  UPDATE_COLUMN_ORDER: "UPDATE_COLUMN_ORDER",
  RESIZE_COLUMN_TABLE: "RESIZE_COLUMN_TABLE",
  UPDATE_COLUMN_TABLE: "UPDATE_COLUMN_TABLE",
  RESIZE_COLUMN_REPORT_SELLER_BY_DATE: "RESIZE_COLUMN_REPORT_SELLER_BY_DATE",
  UPDATE_REPORT_SELLER_BY_DATE: "UPDATE_REPORT_SELLER_BY_DATE",
  UPDATE_COLUMN_ORDER_REPORT_SELLER_BY_DATE: "UPDATE_COLUMN_ORDER_REPORT_SELLER_BY_DATE",
  RESIZE_COLUMN_REPORT_TEAM_BY_DATE: "RESIZE_COLUMN_REPORT_TEAM_BY_DATE",
  UPDATE_REPORT_TEAM_BY_DATE: "UPDATE_REPORT_TEAM_BY_DATE",
  UPDATE_COLUMN_ORDER_REPORT_TEAM_BY_DATE: "UPDATE_COLUMN_ORDER_REPORT_TEAM_BY_DATE",
  CHANGE_COLUMN: "CHANGE_COLUMN",
};

export const arrayTableRanking = [
  {
    tableName: "rankingByTotalRevenue",
    titleHeaderTable: "Top tổng doanh thu",
    propertyOrdering: "total_actual",
  },
  {
    tableName: "rankingByCRMRevenue",
    titleHeaderTable: "Top doanh thu CRM",
    propertyOrdering: "crm_revenue",
  },
  {
    tableName: "rankingByCrossSaleRevenue",
    titleHeaderTable: "Top doanh thu cross-sale",
    propertyOrdering: "cross_sale_amount",
  },
];

export const arrayTableRankingSummaryColumns = {
  rankingByTotalRevenue: [{ columnName: "revenue", type: "sum" }],
  rankingByCRMRevenue: [{ columnName: "crm_revenue", type: "sum" }],
  rankingByCrossSaleRevenue: [{ columnName: "cross_sale_revenue", type: "sum" }],
};

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
    label: "Tổng telesale làm việc trong ngày",
    value: "total_telesale",
  },
];

export const arrayFieldFormatNumber = [
  "total_lead_processed",
  "cold_lead_processed",
  "hot_lead_processed",
  "talktime",
  "lead_processed_per_tls",
];

export const arrayFieldFormatCurrency = [
  "cold_revenue",
  "hot_revenue",
  "total_revenue",
  "revenue_per_tls",
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
];

export const totalRevenueColumns: ColumnShow = {
  columnsShowHeader: [
    {
      title: "Doanh thu",
      name: "total_revenue",
      isShow: true,
    },
    {
      title: "Tỉ lệ chốt",
      name: "buy_ratio",
      isShow: true,
    },
    {
      title: "AOV",
      name: "aov",
      isShow: true,
    },
    {
      title: "SĐT chất lượng",
      name: "qualified_lead",
      isShow: true,
    },
    {
      title: "SĐT đã xử lý",
      name: "processed_lead",
      isShow: true,
    },
    {
      title: "Khách hàng",
      name: "total_customer",
      isShow: true,
    },
    {
      title: "Tổng lead",
      name: "total_lead",
      isShow: true,
    },
    {
      title: "Tổng đơn hàng",
      name: "total_order",
      isShow: true,
    },
  ],
  columnWidths: [
    {
      columnName: "total_revenue",
      width: 150,
    },
    {
      columnName: "buy_ratio",
      width: 150,
    },
    {
      columnName: "aov",
      width: 150,
    },
    {
      columnName: "assigned_date",
      width: 150,
    },
    {
      columnName: "qualified_lead",
      width: 150,
    },
    {
      columnName: "processed_lead",
      width: 150,
    },
    {
      columnName: "total_customer",
      width: 150,
    },
    {
      columnName: "total_lead",
      width: 150,
    },
    {
      columnName: "total_order",
      width: 150,
    },
  ],
};

export const summaryColumnTotalRevenue = [
  {
    columnName: "total_revenue",
    type: "sum",
  },
  {
    columnName: "buy_ratio",
    type: "sum",
  },
  {
    columnName: "aov",
    type: "sum",
  },
  {
    columnName: "qualified_lead",
    type: "sum",
  },
];

export const revenueDimensions = [
  { value: "all", label: "Tất cả" },
  {
    label: "Ngày chia số",
    value: "assigned_date",
  },
  {
    label: "Kênh bán hàng",
    value: "order_channel",
  },
  {
    label: "Kênh lead",
    value: "lead_channel",
  },
  {
    label: "Ngày tạo",
    value: "created_date",
  },
  {
    label: "Ngày xử lý",
    value: "processed_date",
  },
  {
    label: "Telesale",
    value: "telesale",
  },
];

export const totalReportColumns: ColumnShow = {
  columnsShowHeader: [
    {
      title: "Ngày chia số",
      name: "assigned_date",
      isShow: true,
    },
    {
      title: "Kênh bán hàng",
      name: "order_channel",
      isShow: true,
    },
    {
      title: "Kênh lead",
      name: "lead_channel",
      isShow: true,
    },
    {
      title: "Ngày tạo",
      name: "created_date",
      isShow: true,
    },
    {
      title: "Ngày xử lý",
      name: "processed_date",
      isShow: true,
    },
    {
      title: "Telesale",
      name: "telesale",
      isShow: true,
    },
    {
      title: "Doanh thu",
      name: "total_revenue",
      isShow: true,
    },
    {
      title: "Tỉ lệ chốt",
      name: "buy_ratio",
      isShow: true,
    },
    {
      title: "AOV",
      name: "aov",
      isShow: true,
    },
    {
      title: "SĐT chất lượng",
      name: "qualified_lead",
      isShow: true,
    },
    {
      title: "SĐT đã xử lý",
      name: "processed_lead",
      isShow: true,
    },
    {
      title: "Khách hàng",
      name: "total_customer",
      isShow: true,
    },
    {
      title: "Tổng lead",
      name: "total_lead",
      isShow: true,
    },
    {
      title: "Tổng đơn hàng",
      name: "total_order",
      isShow: true,
    },
  ],
  columnWidths: [
    {
      columnName: "total_revenue",
      width: 150,
    },
    {
      columnName: "buy_ratio",
      width: 150,
    },
    {
      columnName: "aov",
      width: 150,
    },
    {
      columnName: "assigned_date",
      width: 150,
    },
    {
      columnName: "qualified_lead",
      width: 150,
    },
    {
      columnName: "processed_lead",
      width: 150,
    },
    {
      columnName: "total_customer",
      width: 150,
    },
    {
      columnName: "total_lead",
      width: 150,
    },
    {
      columnName: "total_order",
      width: 150,
    },
    {
      columnName: "assigned_date",
      width: 150,
    },
    {
      columnName: "order_channel",
      width: 150,
    },
    {
      columnName: "lead_channel",
      width: 150,
    },
    {
      columnName: "created_date",
      width: 150,
    },
    {
      columnName: "processed_date",
      width: 150,
    },
    {
      columnName: "telesale",
      width: 150,
    },
  ],
};

export const summaryColumnTotalReport = [
  {
    columnName: "total_revenue",
    type: "sum",
  },
  {
    columnName: "buy_ratio",
    type: "sum",
  },
  {
    columnName: "aov",
    type: "sum",
  },
  {
    columnName: "qualified_lead",
    type: "sum",
  },
  {
    columnName: "processed_lead",
    type: "sum",
  },
  {
    columnName: "total_customer",
    type: "sum",
  },
  {
    columnName: "total_lead",
    type: "sum",
  },
  {
    columnName: "total_order",
    type: "sum",
  },
];

export const FILTER_CHART_TOTAL_OPTIONS_BY_DATE: SelectOptionType[] = [
  // {
  //   label: "Ngày chia số",
  //   value: "assigned_date",
  // },
  // {
  //   label: "Kênh bán hàng",
  //   value: "order_channel",
  // },
  // {
  //   label: "Kênh lead",
  //   value: "lead_channel",
  // },
  // {
  //   label: "Ngày tạo",
  //   value: "created_date",
  // },
  // {
  //   label: "Ngày xử lý",
  //   value: "processed_date",
  // },
  // {
  //   label: "Telesale",
  //   value: "telesale",
  // },
  {
    label: "Doanh thu",
    value: "total_revenue",
  },
  {
    label: "Tỉ lệ chốt",
    value: "buy_ratio",
  },
  {
    label: "AOV",
    value: "aov",
  },
  {
    label: "SĐT chất lượng",
    value: "qualified_lead",
  },
  {
    label: "SĐT đã xử lý",
    value: "processed_lead",
  },
  {
    label: "Khách hàng",
    value: "total_customer",
  },
  {
    label: "Tổng lead",
    value: "total_lead",
  },
  {
    label: "Tổng đơn hàng",
    value: "total_order",
  },
];
