import { ColumnShow } from "_types_/FacebookType";
import { SummaryItem } from "@devexpress/dx-react-grid";
import { SelectOptionType } from "_types_/SelectOptionType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import isPlainObject from "lodash/isPlainObject";
import reduce from "lodash/reduce";
import { TYPE_FORM_FIELD } from "constants/index";
import { PATH_DASHBOARD } from "routes/paths";
import { ROLE_TAB, STATUS_ROLE_GOOGLE } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";

//icons
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import GroupIcon from "@mui/icons-material/Group";
import CampaignIcon from "@mui/icons-material/Campaign";
import { UserType } from "_types_/UserType";

export const tabHeader = {
  CUSTOMER: "CUSTOMER",
  CAMPAIGN: "CAMPAIGN",
  AD_GROUP: "AD_GROUP",
  AD: "AD",
  CONTENT_ID: "CONTENT_ID",
};

export const contentModel = {
  FACEBOOK_CAMPAIGN: "facebookcampaign",
  FACEBOOK_ADSET: "facebookadset",
  FACEBOOK_AD: "facebookad",
};

export const keyFilter = {
  STATUS: "STATUS",
  OBJECTIVE: "OBJECTIVE",
  CUSTOMER: "CUSTOMER",
  CAMPAIGN: "CAMPAIGN",
  AD_GROUP: "AD_GROUP",
  AD: "AD",
  CONTENT_CREATOR: "CONTENT_CREATOR",
  TEAM: "TEAM",
  DESIGNER: "DESIGNER",
  FANPAGE: "FANPAGE",
  POST: "POST",
  CONTENT_ID: "CONTENT_ID",
  ATTIBUTES: "ATTIBUTES",
  ATTIBUTES_VALUE: "ATTIBUTES_VALUE",
  DIGITAL_GG: "DIGITAL_GG",
  PRODUCT: "PRODUCT",
};

// Type dispatch reducer in component
export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_SHOW_FULL_TABLE: "UPDATE_SHOW_FULL_TABLE",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_CAMPAIGN: "UPDATE_CAMPAIGN",
  UPDATE_CUSTOMER: "UPDATE_CUSTOMER",
  UPDATE_AD: "UPDATE_AD",
  UPDATE_AD_GROUP: "UPDATE_AD_GROUP",
  UPDATE_CONTENT_ID: "UPDATE_CONTENT_ID",
  UPDATE_DATA_FILTER_CONTENT_ID: "UPDATE_DATA_FILTER_CONTENT_ID",
  UPDATE_DATA_FILTER_CAMPAIGN: "UPDATE_DATA_FILTER_CAMPAIGN",
  UPDATE_DATA_FILTER_AD_GROUP: "UPDATE_DATA_FILTER_AD_GROUP",
  UPDATE_DATA_FILTER_AD: "UPDATE_DATA_FILTER_AD",
  RESIZE_COLUMN_CUSTOMER: "RESIZE_COLUMN_CUSTOMER",
  RESIZE_COLUMN_CAMPAIGN: "RESIZE_COLUMN_CAMPAIGN",
  RESIZE_COLUMN_AD_GROUP: "RESIZE_COLUMN_AD_GROUP",
  RESIZE_COLUMN_AD: "RESIZE_COLUMN_AD",
  RESIZE_COLUMN_CONTENT_ID: "RESIZE_COLUMN_CONTENT_ID",
  UPDATE_COLUMN_SELECTED_CUSTOMER: "UPDATE_COLUMN_SELECTED_CUSTOMER",
  UPDATE_COLUMN_SELECTED_CAMPAIGN: "UPDATE_COLUMN_SELECTED_CAMPAIGN",
  UPDATE_COLUMN_SELECTED_AD_GROUP: "UPDATE_COLUMN_SELECTED_AD_GROUP",
  UPDATE_COLUMN_SELECTED_AD: "UPDATE_COLUMN_SELECTED_AD",
  UPDATE_COLUMN_ORDER_CUSTOMER: "UPDATE_COLUMN_ORDER_CUSTOMER",
  UPDATE_COLUMN_ORDER_CAMPAIGN: "UPDATE_COLUMN_ORDER_CAMPAIGN",
  UPDATE_COLUMN_ORDER_AD_GROUP: "UPDATE_COLUMN_ORDER_AD_GROUP",
  UPDATE_COLUMN_ORDER_AD: "UPDATE_COLUMN_ORDER_AD",
  UPDATE_COLUMN_ORDER_CONTENT_ID: "UPDATE_COLUMN_ORDER_CONTENT_ID",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
};

// Show column
export const columnShowCustomer: ColumnShow = {
  columnWidths: [
    { columnName: "customer_name", width: 150 },
    { columnName: "total_campaign", width: 100 },
    { columnName: "total_ad_group", width: 120 },
    { columnName: "total_ad", width: 100 },
    { columnName: "total_date", width: 100 },
    { columnName: "cost", width: 150 },
    { columnName: "cost_per_conversion", width: 150 },
    { columnName: "conversion", width: 100 },
    { columnName: "clicks", width: 100 },
    { columnName: "kol_koc", width: 100 },
    { columnName: "impressions", width: 100 },
    { columnName: "isCheck", width: 50 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn tài khoản",
      isShow: true,
    },
    {
      name: "customer_name",
      title: "Khách hàng",
      isShow: true,
    },
    {
      name: "cost",
      title: "Chi phí",
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
      name: "total_campaign",
      title: "Tổng chiến dịch",
      isShow: true,
    },
    {
      name: "total_ad_group",
      title: "Tổng nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "total_ad",
      title: "Tổng quảng cáo",
      isShow: true,
    },
    {
      name: "total_date",
      title: "Tổng ngày",
      isShow: true,
    },
  ],
};

export const columnShowAd: ColumnShow = {
  columnWidths: [
    { columnName: "customer_name", width: 150 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "campaign_channel_type", width: 150 },
    { columnName: "ad_group_name", width: 150 },
    { columnName: "ad_group_type", width: 150 },
    { columnName: "ad_name", width: 100 },
    { columnName: "ad_type", width: 150 },
    { columnName: "total_date", width: 100 },
    { columnName: "cost", width: 150 },
    { columnName: "cost_per_conversion", width: 150 },
    { columnName: "conversion", width: 100 },
    { columnName: "clicks", width: 100 },
    { columnName: "kol_koc", width: 100 },
    { columnName: "impressions", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "customer_name",
      title: "Khách hàng",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "campaign_channel_type",
      title: "Loại chiến dịch",
      isShow: true,
    },
    {
      name: "ad_group_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "ad_group_type",
      title: "Loại nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "ad_name",
      title: "Quảng cáo",
      isShow: true,
    },
    {
      name: "ad_type",
      title: "Loại quảng cáo",
      isShow: true,
    },
    {
      name: "cost",
      title: "Chi phí",
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
      name: "total_date",
      title: "Tổng ngày",
      isShow: true,
    },
  ],
};

export const columnShowCampaign: ColumnShow = {
  columnWidths: [
    { columnName: "customer_name", width: 150 },
    { columnName: "isCheck", width: 50 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "campaign_channel_type", width: 150 },
    { columnName: "total_ad_group", width: 140 },
    { columnName: "total_date", width: 100 },
    { columnName: "cost", width: 150 },
    { columnName: "cost_per_conversion", width: 150 },
    { columnName: "conversion", width: 100 },
    { columnName: "clicks", width: 100 },
    { columnName: "kol_koc", width: 100 },
    { columnName: "impressions", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn chiến dịch",
      isShow: true,
    },
    {
      name: "customer_name",
      title: "Khách hàng",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "campaign_channel_type",
      title: "Loại chiến dịch",
      isShow: true,
    },
    {
      name: "cost",
      title: "Chi phí",
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
      name: "total_ad_group",
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

export const columnShowAdGroup: ColumnShow = {
  columnWidths: [
    { columnName: "customer_name", width: 150 },
    { columnName: "isCheck", width: 50 },
    { columnName: "campaign_name", width: 150 },
    { columnName: "campaign_channel_type", width: 150 },
    { columnName: "ad_group_name", width: 150 },
    { columnName: "total_date", width: 100 },
    { columnName: "total_ad", width: 100 },
    { columnName: "ad_group_type", width: 150 },
    { columnName: "cost", width: 150 },
    { columnName: "cost_per_conversion", width: 150 },
    { columnName: "conversion", width: 100 },
    { columnName: "clicks", width: 100 },
    { columnName: "kol_koc", width: 100 },
    { columnName: "impressions", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "customer_name",
      title: "Khách hàng",
      isShow: true,
    },
    {
      name: "campaign_name",
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "campaign_channel_type",
      title: "Loại chiến dịch",
      isShow: true,
    },
    {
      name: "ad_group_name",
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "ad_group_type",
      title: "Loại nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "cost",
      title: "Chi phí",
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
      name: "total_ad",
      title: "Tổng quảng cáo",
      isShow: true,
    },
    {
      name: "total_date",
      title: "Tổng ngày",
      isShow: true,
    },
  ],
};

export const columnShowCampaignActivitiesDetail: ColumnShow = {
  columnWidths: [
    { columnName: "user_email", width: 180 },
    { columnName: "client_type", width: 220 },
    { columnName: "change_date_time", width: 220 },
    { columnName: "change_resource_type", width: 130 },
    { columnName: "extra_data", width: 250 },
    { columnName: "resource_change_operation", width: 180 },
  ],
  columnsShowHeader: [
    {
      name: "user_email",
      title: "Người thay đổi",
      isShow: true,
    },
    {
      name: "client_type",
      title: "Nền tảng",
      isShow: true,
    },
    {
      name: "change_date_time",
      title: "Thời gian thay đổi",
      isShow: true,
    },
    {
      name: "change_resource_type",
      title: "Loại",
      isShow: true,
    },
    {
      name: "extra_data",
      title: "Nguồn",
      isShow: true,
    },
    {
      name: "resource_change_operation",
      title: "Thao tác thay đổi",
      isShow: true,
    },
  ],
};

export const columnShowAdGroupActivitiesDetail: ColumnShow = {
  columnWidths: [
    { columnName: "user_email", width: 180 },
    { columnName: "client_type", width: 220 },
    { columnName: "change_date_time", width: 220 },
    { columnName: "change_resource_type", width: 130 },
    { columnName: "extra_data", width: 250 },
    { columnName: "resource_change_operation", width: 180 },
  ],
  columnsShowHeader: [
    {
      name: "user_email",
      title: "Người thay đổi",
      isShow: true,
    },
    {
      name: "client_type",
      title: "Nền tảng",
      isShow: true,
    },
    {
      name: "change_date_time",
      title: "Thời gian thay đổi",
      isShow: true,
    },
    {
      name: "change_resource_type",
      title: "Loại",
      isShow: true,
    },
    {
      name: "extra_data",
      title: "Nguồn",
      isShow: true,
    },
    {
      name: "resource_change_operation",
      title: "Thao tác thay đổi",
      isShow: true,
    },
  ],
};

// Show total value in report
export const summaryColumnCustomer: SummaryItem[] = [
  { columnName: "clicks", type: "sum" },
  { columnName: "kol_koc", type: "sum" },
  { columnName: "conversion", type: "sum" },
  { columnName: "cost", type: "sum" },
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "impressions", type: "sum" },
];

export const summaryColumnCampaign: SummaryItem[] = [
  { columnName: "clicks", type: "sum" },
  { columnName: "kol_koc", type: "sum" },
  { columnName: "conversion", type: "sum" },
  { columnName: "cost", type: "sum" },
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "impressions", type: "sum" },
];

export const summaryColumnAdGroup: SummaryItem[] = [
  { columnName: "clicks", type: "sum" },
  { columnName: "kol_koc", type: "sum" },
  { columnName: "conversion", type: "sum" },
  { columnName: "cost", type: "sum" },
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "impressions", type: "sum" },
];

export const summaryColumnAd: SummaryItem[] = [
  { columnName: "clicks", type: "sum" },
  { columnName: "kol_koc", type: "sum" },
  { columnName: "conversion", type: "sum" },
  { columnName: "cost", type: "sum" },
  { columnName: "cost_per_conversion", type: "sum" },
  { columnName: "impressions", type: "sum" },
];

// Data filter header
export const headerFilterStatus = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đang hoạt động",
    value: "ENABLED",
  },
  {
    label: "Không hoạt động",
    value: "NONE_ENABLED",
  },
];

export const headerFilterObjecttiveCampaign = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "DISPLAY",
    value: "DISPLAY",
  },
  {
    label: "HOTEL",
    value: "HOTEL",
  },
  {
    label: "LOCAL",
    value: "LOCAL",
  },
  {
    label: "MULTI_CHANNEL",
    value: "MULTI_CHANNEL",
  },
  {
    label: "SEARCH",
    value: "SEARCH",
  },
  {
    label: "SHOPPING",
    value: "SHOPPING",
  },
  {
    label: "Smart",
    value: "SMART",
  },
  {
    label: "Unknown",
    value: "UNKNOWN",
  },
  {
    label: "Unspecified",
    value: "UNSPECIFIED",
  },
  {
    label: "Video",
    value: "VIDEO",
  },
];

export const headerFilterObjecttiveAdGroup = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "DISPLAY_STANDARD",
    value: "DISPLAY_STANDARD",
  },
  {
    label: "HOTEL_ADS",
    value: "HOTEL_ADS",
  },
  {
    label: "PROMOTED_HOTEL_ADS",
    value: "PROMOTED_HOTEL_ADS",
  },
  {
    label: "SEARCH_DYNAMIC_ADS",
    value: "SEARCH_DYNAMIC_ADS",
  },
  {
    label: "SEARCH_STANDARD",
    value: "SEARCH_STANDARD",
  },
  {
    label: "SHOPPING_COMPARISON_LISTING_ADS",
    value: "SHOPPING_COMPARISON_LISTING_ADS",
  },
  {
    label: "SHOPPING_PRODUCT_ADS",
    value: "SHOPPING_PRODUCT_ADS",
  },
  {
    label: "SHOPPING_SMART_ADS",
    value: "SHOPPING_SMART_ADS",
  },
  {
    label: "UNKNOWN",
    value: "UNKNOWN",
  },
  {
    label: "VIDEO_BUMPER",
    value: "VIDEO_BUMPER",
  },
  {
    label: "VIDEO_EFFICIENT_REACH",
    value: "VIDEO_EFFICIENT_REACH",
  },
  {
    label: "VIDEO_NON_SKIPPABLE_IN_STREAM",
    value: "VIDEO_NON_SKIPPABLE_IN_STREAM",
  },
  {
    label: "VIDEO_OUTSTREAM",
    value: "VIDEO_OUTSTREAM",
  },
  {
    label: "VIDEO_RESPONSIVE",
    value: "VIDEO_RESPONSIVE",
  },
  {
    label: "VIDEO_TRUE_VIEW_IN_DISPLAY",
    value: "VIDEO_TRUE_VIEW_IN_DISPLAY",
  },
  {
    label: "VIDEO_TRUE_VIEW_IN_STREAM",
    value: "VIDEO_TRUE_VIEW_IN_STREAM",
  },
];

export const headerFilterObjecttiveAd = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "APP_AD",
    value: "APP_AD",
  },
  {
    label: "APP_ENGAGEMENT_AD",
    value: "APP_ENGAGEMENT_AD",
  },
  {
    label: "CALL_ONLY_AD",
    value: "CALL_ONLY_AD",
  },
  {
    label: "DYNAMIC_HTML5_AD",
    value: "DYNAMIC_HTML5_AD",
  },
  {
    label: "EXPANDED_DYNAMIC_SEARCH_AD",
    value: "EXPANDED_DYNAMIC_SEARCH_AD",
  },
  {
    label: "EXPANDED_TEXT_AD",
    value: "EXPANDED_TEXT_AD",
  },
  {
    label: "GMAIL_AD",
    value: "GMAIL_AD",
  },
  {
    label: "HOTEL_AD",
    value: "HOTEL_AD",
  },
  {
    label: "HTML5_UPLOAD_AD",
    value: "HTML5_UPLOAD_AD",
  },
  {
    label: "IMAGE_AD",
    value: "IMAGE_AD",
  },
  {
    label: "LEGACY_APP_INSTALL_AD",
    value: "LEGACY_APP_INSTALL_AD",
  },
  {
    label: "LEGACY_RESPONSIVE_DISPLAY_AD",
    value: "LEGACY_RESPONSIVE_DISPLAY_AD",
  },
  {
    label: "LOCAL_AD",
    value: "LOCAL_AD",
  },
  {
    label: "RESPONSIVE_DISPLAY_AD",
    value: "RESPONSIVE_DISPLAY_AD",
  },
  {
    label: "RESPONSIVE_SEARCH_AD",
    value: "RESPONSIVE_SEARCH_AD",
  },
  {
    label: "SHOPPING_COMPARISON_LISTING_AD",
    value: "SHOPPING_COMPARISON_LISTING_AD",
  },
  {
    label: "SHOPPING_PRODUCT_AD",
    value: "SHOPPING_PRODUCT_AD",
  },
  {
    label: "SHOPPING_SMART_AD",
    value: "SHOPPING_SMART_AD",
  },
  {
    label: "TEXT_AD",
    value: "TEXT_AD",
  },
  {
    label: "UNKNOWN",
    value: "UNKNOWN",
  },
  {
    label: "UNSPECIFIED",
    value: "UNSPECIFIED",
  },
  {
    label: "VIDEO_AD",
    value: "VIDEO_AD",
  },
  {
    label: "VIDEO_BUMPER_AD",
    value: "VIDEO_BUMPER_AD",
  },
  {
    label: "VIDEO_NON_SKIPPABLE_IN_STREAM_AD",
    value: "VIDEO_NON_SKIPPABLE_IN_STREAM_AD",
  },
  {
    label: "VIDEO_OUTSTREAM_AD",
    value: "VIDEO_OUTSTREAM_AD",
  },
  {
    label: "VIDEO_RESPONSIVE_AD",
    value: "VIDEO_RESPONSIVE_AD",
  },
  {
    label: "VIDEO_TRUEVIEW_DISCOVERY_AD",
    value: "VIDEO_TRUEVIEW_DISCOVERY_AD",
  },
  {
    label: "VIDEO_TRUEVIEW_IN_STREAM_AD",
    value: "VIDEO_TRUEVIEW_IN_STREAM_AD",
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
];

// Chart
export const FILTER_CHART_OPTIONS: SelectOptionType[] = [
  { value: "total_campaign", label: "Tổng chiến dịch" },
  { value: "total_ad_group", label: "Tổng nhóm quảng cáo" },
  { value: "total_ad", label: "Tổng quảng cáo" },
  { value: "cost", label: "Chi phí" },
  { value: "cost_per_conversion", label: "Chi phí/Lượt chuyển đổi" },
  { value: "conversion", label: "Số lượng chuyển đổi" },
  { value: "clicks", label: "Lượt nhấp" },
  { value: "impressions", label: "Hiển thị" },
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
};

export const arrRenderFilterDateDefault = [
  {
    type: TYPE_FORM_FIELD.DATE,
    title: "Thời gian",
    keyDateFrom: "date_from",
    keyDateTo: "date_to",
    keyDateValue: "dateValue",
  },
];

export const LIST_TAB_TABLE_DETAIL = ["date"];

export const handleResourceData = (
  change_resource_type: string,
  old_resource: any,
  new_resource: any,
  changed_fields: string
) => {
  const changeResourceType = getObjectPropSafely(() => change_resource_type.split(".")[1])
    .toLowerCase()
    .replace(/(?:_)\w/g, (value: string) => value.toUpperCase())
    .replace(/_/g, "");
  const oldResource = getObjectPropSafely(() => JSON.parse(old_resource.replaceAll("\n", "")));
  const newResource = getObjectPropSafely(() => JSON.parse(new_resource.replaceAll("\n", "")));
  const changedFields = getObjectPropSafely(() => changed_fields.split(",")) || [];

  return reduce(
    changedFields,
    (prevArr: any, current: any) => {
      const newCurrent = current.split(".");

      const newValue = reduce(
        newCurrent,
        (prevRes: any, currentRef: any) => {
          return prevRes[currentRef] || "";
        },
        newResource[changeResourceType]
      );

      const oldValue = reduce(
        newCurrent,
        (prevRes: any, currentRef: any) => {
          return prevRes[currentRef] || "";
        },
        oldResource[changeResourceType]
      );

      return [
        ...prevArr,
        {
          new_value: `${
            isPlainObject(newValue)
              ? `${newValue.name || ""} - ${newValue.id || ""}`
              : /0{6,}/g.test(newValue)
              ? +newValue / 1000000
              : newValue || ""
          }`,
          old_value: `${
            isPlainObject(oldValue)
              ? `${oldValue.name || ""} - ${oldValue.id || ""}`
              : /0{6,}/g.test(oldValue)
              ? +oldValue / 1000000
              : oldValue || ""
          }`,
        },
      ];
    },
    []
  );
};

export const TAB_HEADER_REPORT_GOOGLE = (user: Partial<UserType> | null, roles: any) => [
  {
    label: "Tài khoản khách hàng",
    icon: <AccountBoxIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.GOOGLE][STATUS_ROLE_GOOGLE.CUSTOMER_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.CUSTOMER_ACCOUNT]
    ),
  },
  {
    label: "Chiến dịch",
    path: `/${PATH_DASHBOARD[ROLE_TAB.GOOGLE][STATUS_ROLE_GOOGLE.CAMPAIGN_GOOGLE]}`,
    icon: <CampaignIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.CAMPAIGN_GOOGLE]
    ),
  },
  {
    icon: <GroupIcon />,
    label: "Nhóm quảng cáo",
    path: `/${PATH_DASHBOARD[ROLE_TAB.GOOGLE][STATUS_ROLE_GOOGLE.ADGROUP_GOOGLE]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.ADGROUP_GOOGLE]
    ),
  },
  {
    icon: <NewspaperIcon />,
    label: "Quảng cáo",
    path: `/${PATH_DASHBOARD[ROLE_TAB.GOOGLE][STATUS_ROLE_GOOGLE.AD_GOOGLE]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.GOOGLE]?.[STATUS_ROLE_GOOGLE.AD_GOOGLE]
    ),
  },
];
