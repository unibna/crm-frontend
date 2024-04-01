import { SettingsValueProps } from "_types_/SettingType";
import {
  STATUS_ROLE_DASHBOARD,
  STATUS_ROLE_PRODUCT,
  STATUS_ROLE_SETTINGS,
  STATUS_ROLE_SHIPPING,
  STATUS_ROLE_TRANSPORTATION,
  STATUS_ROLE_WAREHOUSE,
} from "./rolesTab";
import { SelectOptionType } from "_types_/SelectOptionType";

export const TANENT_URL = {
  HABT: "https://habt.skycom.vn",
  JP24: "https://jp24.skycom.vn",
};

export const HEIGHT_DEVICE = window.innerHeight;
export const WIDTH__DEVICE = window.innerWidth;
export const HEIGHT_HEADER_BAR_APP = 40;
export const HEIGHT_PAGINATION_TABLE = 80;
export const HEIGHT_PAGINATION_TABLE_DETAIL = 150;

export const NONE = "Chưa có";

export const numberRegex = /^\d+$/;

//eslint-disable-next-line
export const PHONE_REGEX = /^([\+84|84|0]+(2|3|5|7|8|9|1[2|6|8|9]))+([0-9]{8}|[0-9]{9})\b/;

export const COMMAS_REGEX = /\B(?=(\d{3})+(?!\d))/g;

export const appConfig = {
  APPLICATION_ENV: JSON.stringify("development"),
};

type StatusType = "warning" | "error" | "success" | "info";

export const CANCEL = "Cancel";

export const INIT_ATTRIBUTE_OPTIONS: SelectOptionType[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chưa có", value: "none" },
];

export const statusNotification: {
  WARNING: StatusType;
  ERROR: StatusType;
  SUCCESS: StatusType;
  INFO: StatusType;
} = {
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
  INFO: "info",
};

export const STATUS_SYNC: any = {
  OH: "Đang chờ",
  IP: "Đang xử lý",
  RJ: "Từ chối",
  CO: "Hoàn thành",
  WAITING: "Đang chờ",
  IN_PROCESS: "Đang xử lý",
  COMPLETED: "Hoàn thành",
  ERROR: "Từ chối",
  ER: "Dữ liệu kém",
  PP: "Normal",
  AP: "Ads",
  LP: "Live",
  ACTIVE: "Đang kinh doanh",
  INACTIVE: "Ngừng kinh doanh",
  "1": "Hoạt động",
  "2": "Vô hiệu hóa",
  "3": "Không ổn định",
  "7": "Rủi ro đang chờ xem xét",
  "8": "Đang chờ xử lý",
  "9": "Trong thời gian gia hạn",
  "100": "Đang chờ đóng cửa",
  "101": "Đã đóng cửa",
  "201": "Bất kỳ hoạt động",
  "202": "Bất kỳ đóng cửa",
};

export const MONEY_UNIT = "đ";

export const TABLE_HEIGHT_IN_VITUAL_MODE = 350;
export const FIELD_HEIGHT_IN_TABLE = 71;

export const DEFAULT_COLUMN_PROPS = {
  align: "left",
  width: 150,
  disableColumnMenu: true,
};

export const EMPTY_OPTION = { label: "", value: "" };

export const keySaveStorage = {
  REPORT_CONTENT_ID: "REPORT_CONTENT_ID",
  REPORT_GOOGLE: "REPORT_GOOGLE",
};

export const defaultSettings: SettingsValueProps = {
  themeMode: "light",
  themeDirection: "ltr",
  themeColor: "default",
  themeLayout: "vertical",
  themeStretch: false,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const HEADER = {
  MOBILE_HEIGHT: 56,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 20,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 70 - 32,
};
export const FOOTER = {
  HEIGHT: 20,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

export const OBJECT_BY_CHANNEL = {
  web: "Landing page",
  phone: "Hotline",
  staff: "CRM",
  fb: "Livestream",
  shopee: "Shopee",
  tiki: "Tiki",
  lazada: "Lazada",
  harapos: "Harapos",
  pos: "Pos",
  harasocial: "Offline",
};

export const NULL_OPTION = { label: "Chưa có", value: "none" };

export const FULL_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Chưa có", value: "none" },
];

export const ALL_OPTION = { label: "Tất cả", value: "all" };

export enum TYPE_FORM_FIELD {
  TEXTFIELD = "TEXTFIELD",
  UPLOAD_IMAGE = "UPLOAD_IMAGE",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  COLOR = "COLOR",
  SINGLE_SELECT = "SINGLE_SELECT",
  DATE = "DATE",
  NUMBER = "NUMBER",
  DATE_TIME = "DATE_TIME",
  SWITCH = "SWITCH",
  UPLOAD_AVATAR = "UPLOAD_AVATAR",
}

export enum TYPE_DATA {
  STATUS = "STATUS",
  VND = "VND",
  DATE_TIME = "DATE_TIME",
  DATE = "DATE",
  TEXTFIELD = "TEXTFIELD",
  LINK = "LINK",
  LABEL = "LABEL",
  TEXT = "TEXT",
  TITLE = "TITLE",
  PHONE = "PHONE",
}

export const VND = "vnđ";
export const USD = "usd";

export const objectiveFacebook = {
  MESSAGES: ["MESSAGES", "OUTCOME_ENGAGEMENT", "LINK_CLICKS"],
  CONVERSIONS: ["CONVERSIONS", "OUTCOME_SALES", "OUTCOME_LEADS"],
};

export const objectiveTiktok = {
  MESSAGES: ["MESSAGES", "OUTCOME_ENGAGEMENT", "LINK_CLICKS"],
  CONVERSIONS: ["CONVERSIONS", "OUTCOME_SALES", "OUTCOME_LEADS"],
};

export const HEADER_PAGE_HEIGHT = 56;

export const ORDER_LINK = `${window.location.origin}/orders`;

export const PAGE_SIZES = [10, 30, 50, 100, 200, 500];

export const SANTA_CURSOR =
  "data:image/png;base64,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";

export const FILTER_GROUPS = [
  {
    name: "Người",
    labels: ["handle_by", "order_created", "created_by", "upload_by"],
    values: [],
  },
  {
    name: "Ngày",
    labels: [""],
    values: [],
  },
  {
    name: "Trạng thái",
    labels: [
      "carrier_status",
      "is_cod_transferred",
      "status",
      "tracking_status",
      "handle_status",
      "lead_status",
      "is_follow",
      "printed_status",
      "is_printed",
      "is_cross_sale",
      "is_confirm_exports",
      "is_confirm_imports",
      "is_deleted",
      "is_confirm_transfer",
      "is_confirm_stocktakings",
    ],
    values: [],
  },
  {
    name: "Lý do",
    labels: [
      "late_reason",
      "wait_return_reason",
      "returning_reason",
      "handle_reason",
      "returned_reason",
      "bad_data_reason",
      "fail_reason",
      "reason_exports",
      "reason_imports",
      "reason_transfer",
      "reason_stocktakings",
      "reasons_created",
    ],
    values: [],
  },
  {
    name: "Hướng xử lý",
    labels: ["late_action", "wait_return_action", "returning_action", "returned_action"],
    values: [],
  },
  {
    name: "Xếp hạng",
    labels: ["cpa_ranking", "cpr_ranking"],
    values: [],
  },
  {
    name: "Digital",
    labels: ["digital_fb", "digital_gg"],
    values: [],
  },
  {
    name: "Khác",
    labels: [""],
    values: [],
  },
];

export const TITLE_PAGE = {
  // General
  [STATUS_ROLE_DASHBOARD.DASHBOARD]: "Dashboard",
  [STATUS_ROLE_DASHBOARD.MKT_DASHBOARD]: "Dashboard MKT",
  [STATUS_ROLE_DASHBOARD.SALE_DASHBOARD]: "Dashboard Sale",

  // Setting
  SETTING: "Cấu hình",
  [STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT]: "Tài khoản nhân sự",
  [STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT]: "Tài khoản Facebook BM",
  [STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT]: "Tài khoản Facebook quảng cáo",
  [STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT]: "Tài khoản Fanpage",
  [STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM]: "Tài khoản Google BM",
  [STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT]: "Tài khoản Google CT",
  [STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT]: "Tài khoản Tiktok Shop",
  [STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT]: "Tài khoản Lazada",
  [STATUS_ROLE_SETTINGS.TIKI_ACCOUNT]: "Tài khoản Tiki",
  [STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT]: "Tài khoản Shopee",
  [STATUS_ROLE_SETTINGS.ZALO_ACCOUNT]: "Tài khoản Zalo",
  [STATUS_ROLE_SETTINGS.ROLE]: "Quyền",
  [STATUS_ROLE_SETTINGS.ATTRIBUTE]: "Thuộc tính",

  // Shipping
  SHIPPING: "Vận đơn",
  SHIPPING_STATUS: "Trạng thái vận đơn",
  [STATUS_ROLE_SHIPPING.ALL]: "Tất cả phiếu giao hàng",
  [STATUS_ROLE_SHIPPING.PICKING]: "Chờ lấy hàng",
  [STATUS_ROLE_SHIPPING.DELIVERING]: "Đang giao hàng",
  [STATUS_ROLE_SHIPPING.RETURNING]: "Đang hoàn",
  [STATUS_ROLE_SHIPPING.RETURNED]: "Đã hoàn",
  [STATUS_ROLE_SHIPPING.SUCCESS]: "Giao thành công",
  [STATUS_ROLE_SHIPPING.LOST]: "Thất lạc",
  [STATUS_ROLE_SHIPPING.CANCELLED]: "Đã hủy",
  [STATUS_ROLE_SHIPPING.WAIT_DELIVERY]: "Chờ giao lại",
  [STATUS_ROLE_SHIPPING.ATTRIBUTES]: "Thuộc tính",
  [STATUS_ROLE_SHIPPING.REPORT]: "Báo cáo vận đơn",
  [STATUS_ROLE_SHIPPING.COMPLETED]: "Chưa có mã vận đơn",

  // Warehouse
  [STATUS_ROLE_WAREHOUSE.IMPORTS]: "Nhập hàng",
  [STATUS_ROLE_WAREHOUSE.LIST_WAREHOUSE]: "Danh sách kho",
  [STATUS_ROLE_WAREHOUSE.EXPORTS]: "Xuất hàng",
  [STATUS_ROLE_WAREHOUSE.TRANSFER]: "Chuyển hàng",
  [STATUS_ROLE_WAREHOUSE.STOCKTAKING]: "Kiểm hàng",
  // [STATUS_ROLE_WAREHOUSE.ATTRIBUTES]: "Thuộc tính",
  [STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY]: "Báo cáo tồn kho",
  [STATUS_ROLE_WAREHOUSE.SCAN_LOGS]: "Lịch sử quét",
  [STATUS_ROLE_WAREHOUSE.SHEET]: "Phiếu kho",

  // Product
  [STATUS_ROLE_PRODUCT.LIST_PRODUCT]: "Danh sách sản phẩm",
  [STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]: "Thương mại điện tử",

  // Transportation
  TRANSPORTATION: "Chăm sóc vận đơn",
  REPORT_TRANSPORTATION: "Báo cáo chăm sóc vận đơn",

  //Lead
  LEAD: "Lead Center",

  //cdp
  CDP: "CDP",
  CDP_USER: "Tài khoản khách hàng",
  EXTERNAL_USERS: "MKT target",
  CDP_REPORT: "Báo cáo khách hàng",

  // order
  ORDER: "Đơn hàng",
  ORDER_STATUS: "Trạng thái đơn hàng",

  // promotion
  PROMOTION: "Khuyến mãi",
};

export enum ORGANIZATION_ID {
  HABT_SKYCOM = "f2c5665a-b853-4889-8d08-f2e951b21c28",
  JP24 = "a8e62e1d-5d7a-4b56-9330-602ac151b3c8",
}

export enum HISTORY_ACTIONS {
  CREATE = "+",
  ADD = "add",
  UPDATE = "~",
  PRINT = "~PRINTED",
  CONFIRM = "~CONFIRMED",
  CANCEL = "~CANCELLED",
}

export enum ActionType {
  UPDATE_PARAMS = "UPDATE_PARAMS",
  UPDATE_TAGS = "UPDATE_TAGS",
  UPDATE_LOADING = "UPDATE_LOADING",
  UPDATE_POPUP = "UPDATE_POPUP",
  UPDATE_DATA = "UPDATE_DATA",
  UPDATE_DATA_TOTAL_TABLE = "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER = "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_FILTER = "UPDATE_DATA_FILTER",
  UPDATE_DATA_TOTAL = "UPDATE_DATA_TOTAL",
  UPDATE_COLUMNS_REPORT = "UPDATE_COLUMNS_REPORT",
  UPDATE_REPORT = "UPDATE_REPORT",
  RESIZE_COLUMN_REPORT = "RESIZE_COLUMN_REPORT",
  RESIZE_COLUMN_COMPLETED = "RESIZE_COLUMN_COMPLETED",
  UPDATE_COLUMN_ORDER_REPORT = "UPDATE_COLUMN_ORDER_REPORT",
  UPDATE_TOTAL_ROW = "UPDATE_TOTAL_ROW",
  UPDATE_SHOW_FULL_TABLE = "UPDATE_SHOW_FULL_TABLE",
  UPDATE_FETCHED = "UPDATE_FETCHED",
}

export const HISTORY_ACTION_TYPES = [
  { value: HISTORY_ACTIONS.UPDATE, label: "Cập nhật", color: "primary" },
  { value: HISTORY_ACTIONS.CREATE, label: "Tạo", color: "default" },
  { value: HISTORY_ACTIONS.ADD, label: "Tạo", color: "default" },
  { value: HISTORY_ACTIONS.PRINT, label: "In", color: "info" },
  { value: HISTORY_ACTIONS.CONFIRM, label: "Xác nhận", color: "success" },
  { value: HISTORY_ACTIONS.CANCEL, label: "Hủy", color: "error" },
];

export const DOMAIN_URL = window.location.origin;

export const SX_PADDING_FORM_FULL_WIDTH_MODAL = [1, 2, 4, 8, 16, 32];

export const KEY_CODE = {
  COPY: 67,
  PASTE: 86,
  CUT: 88,
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

export const KOL_NAME_OPTIONS: SelectOptionType[] = [
  ALL_OPTION,
  { label: "Thanh Thủy", value: "Thanh Thủy" },
  { label: "Vân Trang", value: "Vân Trang" },
  { label: "Kha ly", value: "Kha ly" },
  { label: "Như Quỳnh", value: "Như Quỳnh" },
  { label: "Hồng Đào", value: "Hồng Đào" },
  { label: "Hồng Vân", value: "Hồng Vân" },
  { label: "Mỹ Duyên", value: "Mỹ Duyên" },
  { label: "Đại Nghĩa", value: "Đại Nghĩa" },
  { label: "Dương Cẩm Lynh", value: "Dương Cẩm Lynh" },
  { label: "Lan Hương", value: "Lan Hương" },
  { label: "Thanh Hương", value: "Thanh Hương" },
  { label: "Hoài An", value: "Hoài An" },
];
