import { ContentIdTotalType } from "_types_/ContentIdType";
import { ColumnShowDatagrid } from "_types_/FacebookType";

export const columnShowContentTotalDefault: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: [
    { columnName: "ad_name", width: 120 },
    { columnName: "buy_rate", width: 120 },
    { columnName: "kol_koc", width: 120 },
    { columnName: "total_buy_rate_processed", width: 120 },
    { columnName: "cost_per_total_qualified", width: 130 },
    { columnName: "product", width: 100 },
    { columnName: "team", width: 130 },
    { columnName: "thumb_img", width: 100 },
    { columnName: "total_expense", width: 150 },
    { columnName: "total_qualified", width: 150 },
    { columnName: "total_qualified_processed", width: 150 },
    { columnName: "total_expense_per_total_revenue", width: 150 },
    { columnName: "total_phone", width: 110 },
    { columnName: "total_phone_processed", width: 110 },
    { columnName: "classification", width: 150 },
    { columnName: "total_revenue", width: 130 },
    { columnName: "total_impressions", width: 130 },
    { columnName: "total_orders", width: 110 },
    { columnName: "status", width: 150 },
    { columnName: "content_product", width: 150 },
    { columnName: "campaign_status", width: 150 },
    { columnName: "campaign", width: 150 },
    { columnName: "processed_rate", width: 150 },
    { columnName: "adgroup_name", width: 150 },
    { columnName: "adgroup", width: 150 },

    // columnShowContentIdTotalByContentIDDetailByDate
    { columnName: "created_date_show", width: 130 },

    // columnShowContentIdTotalByCampainObjective
    { columnName: "campaign_name", width: 120 },

    // columnShowContentIdTotalByProductDetailTeam
    { columnName: "cost", width: 120 },
    { columnName: "spend", width: 120 },
    { columnName: "spend_conversion", width: 100 },
    { columnName: "spend_message", width: 100 },
    { columnName: "spend_livestream", width: 100 },

    // columnShowContentIdTotalByProductDetailObjective
    { columnName: "campaign_objective", width: 150 },

    // columnShowTotalRevenueByCampaignObject
    { columnName: "time", width: 150 },
    { columnName: "cost_per_total_qualified_avg", width: 150 },

    // columnShowSpendSegmentByCampaignObject
    { columnName: "cost_per_total_phone", width: 150 },

    // columnShowTotalRevenueByDate
    { columnName: "created_date", width: 150 },

    { columnName: "content_id", width: 250 },
  ],
  columnsShowHeader: [
    {
      name: "total_expense",
      title: "Tổng chi phí",
      isShow: true,
    },
    {
      name: "total_qualified",
      title: "Tổng SĐTCL*",
      isShow: true,
    },
    {
      name: "total_qualified_processed",
      title: "Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "CP/Tổng SĐTCL",
      isShow: true,
    },
    {
      name: "total_expense_per_total_revenue",
      title: "CP/Doanh thu",
      isShow: true,
    },
    {
      name: "total_phone",
      title: "Tổng SĐT*",
      isShow: true,
    },
    {
      name: "total_phone_processed",
      title: "Tổng SĐT",
      isShow: true,
    },
    {
      name: "total_revenue",
      title: "Tổng doanh thu",
      isShow: true,
    },
    {
      name: "total_orders",
      title: "Tổng đơn hàng",
      isShow: true,
    },
    {
      name: "buy_rate",
      title: "Tỉ lệ chốt*",
      isShow: true,
    },
    {
      name: "total_buy_rate_processed",
      title: "Tỉ lệ chốt",
      isShow: true,
    },
    {
      name: "processed_rate",
      title: "Tỉ lệ SDT đã xử lí",
      isShow: true,
    },
    {
      name: "total_impressions",
      title: "Lượt tiếp cận",
      isShow: true,
    },
    {
      name: "kol_koc",
      title: "KOL/KOC",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "total_expense",
      column: "total_expense",
      title: "Tổng chi phí",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_qualified",
      column: "total_qualified",
      title: "Tổng SĐTCL*",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_qualified_processed",
      column: "total_qualified_processed",
      title: "Tổng SĐTCL",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "cost_per_total_qualified",
      column: "cost_per_total_qualified",
      title: "CP/Tổng SĐTCL",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_expense_per_total_revenue",
      column: "total_expense_per_total_revenue",
      title: "CP/Doanh thu",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_phone",
      column: "total_phone",
      title: "Tổng SĐT*",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_phone_processed",
      column: "total_phone_processed",
      title: "Tổng SĐT",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_revenue",
      column: "total_revenue",
      title: "Tổng doanh thu",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_orders",
      column: "total_orders",
      title: "Tổng đơn hàng",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "buy_rate",
      column: "buy_rate",
      title: "Tỉ lệ chốt*",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_buy_rate_processed",
      column: "total_buy_rate_processed",
      title: "Tỉ lệ chốt",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "processed_rate",
      column: "processed_rate",
      title: "Tỉ lệ SDT đã xử lí",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "total_impressions",
      column: "total_impressions",
      title: "Lượt tiếp cận",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "kol_koc",
      column: "kol_koc",
      title: "KOL/KOC",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const columnShowContentIdTotalByContentID: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: [
    ...columnShowContentTotalDefault.columnWidths,
    { columnName: "content_type", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "content_id",
      title: "Content",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnsShowHeader,
    {
      name: "content_type",
      title: "Loại Content",
      isShow: true,
    },
    {
      name: "classification",
      title: "Rule phân loại",
      isShow: true,
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "ad_name_show",
      title: "Plan ID (Airtable)",
      column: "content_id",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "product",
      title: "Sản phẩm",
      column: "content_id",
      isShowTitle: false,
      isShow: true,
    },
    // {
    //   name: "team",
    //   title: "Team",
    //   column: "content_id",
    //   isShowTitle: false,
    //   isShow: true,
    // },
    {
      name: "ads_type",
      title: "Loại ADS",
      column: "content_id",
      isShowTitle: false,
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnShowTable,
    {
      name: "content_type",
      column: "content_type",
      title: "Loại Content",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "classification",
      column: "classification",
      isShowTitle: false,
      title: "Rule phân loại",
      isShow: true,
    },
    {
      name: "status",
      column: "status",
      isShowTitle: false,
      title: "Trạng thái",
      isShow: true,
    },
  ],
};

export const columnShowContentIdTotalByProduct: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: columnShowContentTotalDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "content_product",
      title: "Sản phẩm",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "product",
      column: "content_product",
      title: "Sản phẩm",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "team",
      column: "content_product",
      title: "Team",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnShowTable,
  ],
};

// Detail
export const columnShowContentIdTotalByContentIDDetailByDate: ColumnShowDatagrid<ContentIdTotalType> =
  {
    columnWidths: columnShowContentTotalDefault.columnWidths,
    columnsShowHeader: [
      {
        name: "created_date",
        title: "Ngày",
        isShow: true,
      },
      ...columnShowContentTotalDefault.columnsShowHeader,
    ],
    columnShowTable: [
      {
        name: "created_date",
        column: "created_date",
        title: "Ngày",
        isShowTitle: false,
        isShow: true,
      },
      ...columnShowContentTotalDefault.columnShowTable,
    ],
  };

export const columnShowContentIdTotalByCampainObjective: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: columnShowContentTotalDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "campaign",
      title: "Tên chiến dịch",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "campaign_name",
      column: "campaign",
      title: "Tên chiến dịch",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "campaign_status",
      column: "campaign",
      title: "Trạng thái",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnShowTable,
  ],
};

export const columnShowContentIdTotalByAdgroupObjective: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: columnShowContentTotalDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "adgroup",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "adgroup_name",
      column: "adgroup",
      title: "Nhóm quảng cáo",
      isShow: true,
      isShowTitle: false,
    },
    {
      name: "campaign_status",
      column: "adgroup",
      title: "Trạng thái",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnShowTable,
  ],
};

// Total by product
export const columnShowContentIdTotalByProductDetailTeam: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: columnShowContentTotalDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "team",
      title: "Team",
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnsShowHeader,
    {
      name: "cost",
      title: "Chi phí Google",
      isShow: true,
    },
    {
      name: "spend",
      title: "Chi phí Facebook",
      isShow: true,
    },
    {
      name: "spend_conversion",
      title: "Chi phí Chuyển đổi FB",
      isShow: true,
    },
    {
      name: "spend_message",
      title: "Chi phí Tin nhắn FB",
      isShow: true,
    },
    {
      name: "spend_livestream",
      title: "Chi phí Livestream FB",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "team",
      column: "team",
      title: "Team",
      isShowTitle: false,
      isShow: true,
    },
    ...columnShowContentTotalDefault.columnShowTable,
    {
      name: "cost",
      column: "cost",
      isShowTitle: false,
      title: "Chi phí Google",
      isShow: true,
    },
    {
      name: "spend",
      column: "spend",
      isShowTitle: false,
      title: "Chi phí Facebook",
      isShow: true,
    },
    {
      name: "spend_conversion",
      column: "spend_conversion",
      isShowTitle: false,
      title: "Chi phí Chuyển đổi FB",
      isShow: true,
    },
    {
      name: "spend_message",
      column: "spend_message",
      isShowTitle: false,
      title: "Chi phí Tin nhắn FB",
      isShow: true,
    },
    {
      name: "spend_livestream",
      column: "spend_livestream",
      isShowTitle: false,
      title: "Chi phí Livestream FB",
      isShow: true,
    },
  ],
};

export const columnShowContentIdTotalByProductDetailObjective: ColumnShowDatagrid<ContentIdTotalType> =
  {
    columnWidths: columnShowContentTotalDefault.columnWidths,
    columnsShowHeader: [
      {
        name: "campaign_objective",
        title: "Mục tiêu",
        isShow: true,
      },
      ...columnShowContentTotalDefault.columnsShowHeader,
      {
        name: "cost",
        title: "Chi phí Google",
        isShow: true,
      },
      {
        name: "spend",
        title: "Chi phí Facebook",
        isShow: true,
      },
      {
        name: "spend_conversion",
        title: "Chi phí Chuyển đổi FB",
        isShow: true,
      },
      {
        name: "spend_message",
        title: "Chi phí Tin nhắn FB",
        isShow: true,
      },
      {
        name: "spend_livestream",
        title: "Chi phí Livestream FB",
        isShow: true,
      },
    ],
    columnShowTable: [
      {
        name: "campaign_objective",
        title: "Mục tiêu",
        column: "campaign_objective",
        isShowTitle: false,
        isShow: true,
      },
      ...columnShowContentTotalDefault.columnShowTable,
      {
        name: "cost",
        column: "cost",
        isShowTitle: false,
        title: "Chi phí Google",
        isShow: true,
      },
      {
        name: "spend",
        column: "spend",
        isShowTitle: false,
        title: "Chi phí Facebook",
        isShow: true,
      },
      {
        name: "spend_conversion",
        column: "spend_conversion",
        isShowTitle: false,
        title: "Chi phí Chuyển đổi FB",
        isShow: true,
      },
      {
        name: "spend_message",
        column: "spend_message",
        isShowTitle: false,
        title: "Chi phí Tin nhắn FB",
        isShow: true,
      },
      {
        name: "spend_livestream",
        column: "spend_livestream",
        isShowTitle: false,
        title: "Chi phí Livestream FB",
        isShow: true,
      },
    ],
  };

// Total by contentid - overview
export const columnShowTotalRevenueByCampaignObject: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: columnShowContentTotalDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "time",
      title: "Thời gian",
      isShow: true,
    },
    {
      name: "total_expense",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "total_qualified",
      title: "SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "Chi phí / SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified_avg",
      title: "Chi phí / SĐTCL TB",
      isShow: true,
    },
    {
      name: "total_expense_per_total_revenue",
      title: "CP/Doanh thu",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "time",
      column: "time",
      isShowTitle: false,
      title: "Thời gian",
      isShow: true,
    },
    {
      name: "total_expense",
      column: "total_expense",
      isShowTitle: false,
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "total_qualified",
      column: "total_qualified",
      isShowTitle: false,
      title: "SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      column: "cost_per_total_qualified",
      isShowTitle: false,
      title: "Chi phí / SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified_avg",
      column: "cost_per_total_qualified_avg",
      isShowTitle: false,
      title: "Chi phí / SĐTCL TB",
      isShow: true,
    },
    {
      name: "total_expense_per_total_revenue",
      column: "total_expense_per_total_revenue",
      isShowTitle: false,
      title: "CP/Doanh thu",
      isShow: true,
    },
  ],
};

export const columnShowSpendSegmentByCampaignObject: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: columnShowContentTotalDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "total_expense",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "total_revenue",
      title: "Doanh thu",
      isShow: true,
    },
    {
      name: "total_qualified",
      title: "SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "Chi phí / SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_phone",
      title: "Chi phí / SĐT",
      isShow: true,
    },
    {
      name: "total_expense_per_total_revenue",
      title: "CP/Doanh thu",
      isShow: true,
    },
    {
      name: "total_impressions",
      title: "Lượt tiếp cận",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "total_expense",
      column: "total_expense",
      isShowTitle: false,
      title: "Chi phí",
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
      name: "total_qualified",
      column: "total_qualified",
      isShowTitle: false,
      title: "SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      column: "cost_per_total_qualified",
      isShowTitle: false,
      title: "Chi phí / SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_phone",
      column: "cost_per_total_phone",
      isShowTitle: false,
      title: "Chi phí / SĐT",
      isShow: true,
    },
    {
      name: "total_expense_per_total_revenue",
      column: "total_expense_per_total_revenue",
      isShowTitle: false,
      title: "CP/Doanh thu",
      isShow: true,
    },
    {
      name: "total_impressions",
      column: "total_impressions",
      isShowTitle: false,
      title: "Lượt tiếp cận",
      isShow: true,
    },
  ],
};

export const columnShowTotalRevenueByDate: ColumnShowDatagrid<ContentIdTotalType> = {
  columnWidths: columnShowContentTotalDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "created_date",
      title: "Thời gian",
      isShow: true,
    },
    {
      name: "total_expense",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "total_qualified",
      title: "SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      title: "Chi phí / SĐTCL",
      isShow: true,
    },
    {
      name: "total_expense_per_total_revenue",
      title: "CP/Doanh thu",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "created_date",
      column: "created_date",
      isShowTitle: false,
      title: "Thời gian",
      isShow: true,
    },
    {
      name: "total_expense",
      column: "total_expense",
      isShowTitle: false,
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "total_qualified",
      column: "total_qualified",
      isShowTitle: false,
      title: "SĐTCL",
      isShow: true,
    },
    {
      name: "cost_per_total_qualified",
      column: "cost_per_total_qualified",
      isShowTitle: false,
      title: "Chi phí / SĐTCL",
      isShow: true,
    },
    {
      name: "total_expense_per_total_revenue",
      column: "total_expense_per_total_revenue",
      isShowTitle: false,
      title: "CP/Doanh thu",
      isShow: true,
    },
  ],
};
