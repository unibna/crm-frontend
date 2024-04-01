import { ContentDailyDefaultType, ContentDailyOverviewType } from "_types_/ContentDailyType";
import { ColumnShowDatagrid } from "_types_/FacebookType";

export const columnShowContentDailyDefault: ColumnShowDatagrid<ContentDailyDefaultType> = {
  columnWidths: [
    { columnName: "cost", width: 120 },
    { columnName: "engagements", width: 120 },
    { columnName: "impressions", width: 120 },
    { columnName: "reach", width: 120 },
    { columnName: "views", width: 120 },
    { columnName: "CPV", width: 120 },
    { columnName: "CPE", width: 120 },
    { columnName: "CPM", width: 120 },
    { columnName: "CPR", width: 120 },
    { columnName: "campaign_name", width: 320 },
    { columnName: "content_id", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "cost",
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "engagements",
      title: "Engagements",
      isShow: true,
    },
    {
      name: "impressions",
      title: "Impressions",
      isShow: true,
    },
    {
      name: "reach",
      title: "Reach",
      isShow: true,
    },
    {
      name: "views",
      title: "Views",
      isShow: true,
    },
    {
      name: "CPV",
      title: "CPV",
      isShow: true,
    },
    {
      name: "CPE",
      title: "CPE",
      isShow: true,
    },
    {
      name: "CPM",
      title: "CPM",
      isShow: true,
    },
    {
      name: "CPR",
      title: "CPR",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "cost",
      column: "cost",
      isShowTitle: false,
      title: "Chi phí",
      isShow: true,
    },
    {
      name: "engagements",
      column: "engagements",
      isShowTitle: false,
      title: "Engagements",
      isShow: true,
    },
    {
      name: "impressions",
      column: "impressions",
      isShowTitle: false,
      title: "Impressions",
      isShow: true,
    },
    {
      name: "reach",
      column: "reach",
      isShowTitle: false,
      title: "Reach",
      isShow: true,
    },
    {
      name: "views",
      column: "views",
      isShowTitle: false,
      title: "Views",
      isShow: true,
    },
    {
      name: "CPV",
      column: "CPV",
      isShowTitle: false,
      title: "CPV",
      isShow: true,
    },
    {
      name: "CPE",
      column: "CPE",
      isShowTitle: false,
      title: "CPE",
      isShow: true,
    },
    {
      name: "CPM",
      column: "CPM",
      isShowTitle: false,
      title: "CPM",
      isShow: true,
    },
    {
      name: "CPR",
      column: "CPR",
      isShowTitle: false,
      title: "CPR",
      isShow: true,
    },
  ],
};

export const columnShowOverviewByContentDaily: ColumnShowDatagrid<ContentDailyOverviewType> = {
  columnWidths: columnShowContentDailyDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "content_id",
      title: "Content",
      isShow: true,
    },
    ...columnShowContentDailyDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "ad_name",
      column: "content_id",
      isShowTitle: false,
      title: "Plan ID (Airtable)",
      isShow: true,
    },
    ...columnShowContentDailyDefault.columnShowTable,
  ],
};

export const columnShowOverviewByCampaign: ColumnShowDatagrid<ContentDailyOverviewType> = {
  columnWidths: columnShowContentDailyDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "campaign_name",
      title: "Tên chiến dịch",
      isShow: true,
    },
    ...columnShowContentDailyDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "campaign_name",
      column: "campaign_name",
      isShowTitle: false,
      title: "Tên chiến dịch",
      isShow: true,
    },
    ...columnShowContentDailyDefault.columnShowTable,
  ],
};
