import { ColumnShow } from "_types_/FacebookType";
import { SummaryItem } from "@devexpress/dx-react-grid";
import { TYPE_FORM_FIELD } from "constants/index";
import { arrRenderFilterDateDefault } from "constants/index";

export const tabHeader = {
  FANPAGE: "FANPAGE",
  POST: "POST",
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
  POST_TYPE: "POST_TYPE",
};

// Type dispatch reducer in component
export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_FANPAGE: "UPDATE_FANPAGE",
  UPDATE_POST: "UPDATE_POST",
  RESIZE_COLUMN_FANPAGE: "RESIZE_COLUMN_FANPAGE",
  RESIZE_COLUMN_POST: "RESIZE_COLUMN_POST",
  UPDATE_COLUMN_SELECTED_FANPAGE: "UPDATE_COLUMN_SELECTED_AD_ACCOUNT",
  UPDATE_COLUMN_ORDER_FANPAGE: "UPDATE_COLUMN_ORDER_FANPAGE",
  UPDATE_COLUMN_ORDER_POST: "UPDATE_COLUMN_ORDER_POST",
  UPDATE_DATA_FILTER_POST: "UPDATE_DATA_FILTER_POST",
  UPDATE_DATA_FILTER_FANPAGE: "UPDATE_DATA_FILTER_FANPAGE",
};

// Show column
export const columnShowFanpage: ColumnShow = {
  columnWidths: [
    { columnName: "page_name", width: 250 },
    { columnName: "total_comment", width: 150 },
    { columnName: "total_comment_containing_phone", width: 150 },
    { columnName: "total_user_inbox", width: 150 },
    { columnName: "total_user_inbox_containing_phone", width: 150 },
    { columnName: "total_unique_phone", width: 150 },
    { columnName: "total_unique_comment_phone", width: 150 },
    { columnName: "total_unique_inbox_phone", width: 150 },
    { columnName: "total_unique_comment_phone", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "page_name",
      title: "Trang",
      isShow: true,
    },
    {
      name: "total_comment",
      title: "Tổng bình luận",
      isShow: true,
    },
    {
      name: "total_comment_containing_phone",
      title: "Comment chứa sđt",
      isShow: true,
    },
    {
      name: "total_user_inbox",
      title: "Tổng user đã inbox",
      isShow: true,
    },
    {
      name: "total_user_inbox_containing_phone",
      title: "Tổng user inbox có để sđt",
      isShow: true,
    },
    {
      name: "total_unique_inbox_phone",
      title: "Tổng sđt từ inbox sau khi lọc trùng",
      isShow: true,
    },
    {
      name: "total_unique_comment_phone",
      title: "Tổng sđt từ commment sau khi lọc trùng",
      isShow: true,
    },
    {
      name: "total_unique_phone",
      title: "Tổng sđt từ comment, inbox sau khi lọc trùng",
      isShow: true,
    },
  ],
};

export const columnShowPost: ColumnShow = {
  columnWidths: [
    { columnName: "created_date", width: 150 },
    { columnName: "thumb_img", width: 250 },
    { columnName: "post_type", width: 150 },
    { columnName: "fanpage_name", width: 150 },
    { columnName: "total_comment", width: 150 },
    { columnName: "total_comment_containing_phone", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "created_date",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "thumb_img",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "post_type",
      title: "Loại bài viết",
      isShow: true,
    },
    {
      name: "fanpage_name",
      title: "Trang",
      isShow: true,
    },
    {
      name: "total_comment",
      title: "Tổng bình luận",
      isShow: true,
    },
    {
      name: "total_comment_containing_phone",
      title: "Comment chứa sđt",
      isShow: true,
    },
  ],
};

// Show total value in report
export const summaryColumnFanpage: SummaryItem[] = [
  { columnName: "total_comment", type: "sum" },
  { columnName: "total_comment_containing_phone", type: "sum" },
  { columnName: "total_user_inbox", type: "sum" },
  { columnName: "total_user_inbox_containing_phone", type: "sum" },
  { columnName: "total_unique_phone", type: "sum" },
  { columnName: "total_unique_comment_phone", type: "sum" },
  { columnName: "total_unique_inbox_phone", type: "sum" },
];

export const summaryColumnPost: SummaryItem[] = [
  { columnName: "total_comment", type: "sum" },
  { columnName: "total_comment_containing_phone", type: "sum" },
];

// Data filter header
export const headerFilterPostType = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Normal",
    value: "PP",
  },
  {
    label: "Ads",
    value: "AP",
  },
  {
    label: "Live",
    value: "LP",
  },
];

export const dataRenderHeaderShare = [
  {
    style: {
      width: 180,
    },
    status: keyFilter.POST_TYPE,
    title: "Loại bài viết",
    options: headerFilterPostType,
    label: "post_type",
    defaultValue: headerFilterPostType[0].value,
  },
  ...arrRenderFilterDateDefault,
];

// Message
export const message = {
  PLEASE_SELECT_LEAST_ONE_CAMPAIGN: "Vui lòng chọn ít nhất một chiến dịch",
  PLEASE_SELECT_LEAST_ONE_AD_SET: "Vui lòng chọn ít nhất một nhóm quảng cáo",
  PLEASE_SELECT_LEAST_ONE_AD: "Vui lòng chọn ít nhất một quảng cáo",
};

export const LIST_TAB_TABLE_DETAIL = ["date"];
