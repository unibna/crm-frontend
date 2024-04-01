import { ColumnShowDatagrid } from "_types_/FacebookType";
import { getStorage, deleteStorage } from "utils/asyncStorageUtil";
import { STATUS_SYNC, TYPE_FORM_FIELD } from "constants/index";
import {
  AccountType,
  AccountTypeDefault,
  AdAccountType,
  CustomerAccountType,
  FacebookAccountType,
  FanpageAccountType,
  GoogleAccountType,
  LazadaAccountType,
  RoleType,
  ShopeeAccountType,
  SkylinkAccountType,
  TiktokAccountType,
  TiktokAdsAccountType,
  TiktokAdvertiserUserType,
  TiktokBmAccountType,
  UserHistoryType,
  ZaloAccountType,
} from "_types_/AccountType";

import FacebookIcon from "@mui/icons-material/Facebook";
import CampaignIcon from "@mui/icons-material/Campaign";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import GroupIcon from "@mui/icons-material/Group";
import BallotIcon from "@mui/icons-material/Ballot";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import WebIcon from "@mui/icons-material/Web";

import { PATH_DASHBOARD } from "routes/paths";
import { ROLE_TAB, STATUS_ROLE_SETTINGS } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";
import { LabelColor } from "components/Labels/Span";
import { UserType } from "_types_/UserType";

const FACEBOOK_DEV_ID = import.meta.env.REACT_APP_FACEBOOK_DEV_ID;

export const MAX_TIME_LOAD_DATA = 90000;
export const MAX_COUNT_SYNC = 200;
export const USER_TYPE_TIKTOK = {
  "0": "Seller",
  "1": "Creator",
};
export const SHOP_TYPE_TIKTOK = {
  "1": "Global",
  "2": "Local",
};

export enum TitlePopupHandle {
  CREATE_ACCOUNT_SKYLINK = "Tạo tài khoản nhân sự",
  EDIT_ACCOUNT_SKYLINK = "Chỉnh sửa tài khoản nhân sự",
  CREATE_GROUP_ACCOUNT = "Tạo nhóm tài khoản",
}

export enum TypeHandle {
  CREATE_ACCOUNT_SKYLINK = "CREATE_ACCOUNT_SKYLINK",
  EDIT_ACCOUNT_SKYLINK = "EDIT_ACCOUNT_SKYLINK",
  CREATE_GROUP_ACCOUNT = "CREATE_GROUP_ACCOUNT",
}

export const contentRenderDefault: any = {
  [TitlePopupHandle.CREATE_ACCOUNT_SKYLINK]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "email",
      label: "Email",
      placeholder: "Nhập email",
      required: true,
      typeInput: "email",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "phone",
      label: "SĐT",
      placeholder: "Nhập sđt",
      typeInput: "number",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "password",
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu",
      required: true,
      typeInput: "password",
    },
  ],
  [TitlePopupHandle.EDIT_ACCOUNT_SKYLINK]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Họ và tên",
      placeholder: "Nhập họ và tên",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "phone",
      label: "SĐT",
      placeholder: "Nhập sđt",
      typeInput: "number",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "password",
      label: "Mật khẩu",
      placeholder: "Nhập mật khẩu",
    },
  ],
  [TitlePopupHandle.CREATE_GROUP_ACCOUNT]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên nhóm",
      placeholder: "Nhập tên nhóm",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.COLOR,
      name: "color",
      label: "Chọn màu *",
      placeholder: "Chọn màu cho nhóm",
      nameOptional: "name",
    },
  ],
};

export const MESSAGE_TOAST = {
  CREAT_USER_SUCCESS: "Tạo thành công!",
  ERROR_CREATE_USER: "Lỗi tạo tài khoản!",
  ACCOUNT_USER_EXIST: "Tài khoản đã tồn tại!",
  UPDATE_USER_SUCCESS: "Cập nhật thành công!",
  ERROR_UPDATE_USER: "Lỗi cập nhật tài khoản!",
  DELETE_USER_SUCCESS: "Xóa thành công!",
  ERROR_DELETE_USER: "Lỗi xóa tài khoản!",
};

export const statusSync = {
  OH: "OH",
  IP: "IP",
  RJ: "RJ",
  CO: "CO",
  ER: "ER",
  WAITING: "WAITING",
  IN_PROCESS: "IN_PROCESS",
  COMPLETED: "COMPLETED",
  ERROR: "ERROR",
  "1": "1",
  "2": "2",
};

export const COLOR_STATUS_SYNC = {
  [statusSync.OH]: "primary",
  [statusSync.IP]: "warning",
  [statusSync.RJ]: "error",
  [statusSync.CO]: "success",
  [statusSync.ER]: "default",
  [statusSync.WAITING]: "primary",
  [statusSync.IN_PROCESS]: "warning",
  [statusSync.ERROR]: "error",
  [statusSync.COMPLETED]: "success",
  [statusSync[1]]: "success",
  [statusSync[2]]: "error",
};

export const keySaveTimeOnLocal = {
  TIME_SYNC_FACEBOOK_ACCOUNT: "TIME_SYNC_FACEBOOK_ACCOUNT",
  TIME_SYNC_AD_ACCOUNT: "TIME_SYNC_AD_ACCOUNT",
  TIME_SYNC_FANPAGE: "TIME_SYNC_FANPAGE",
  TIME_SYNC_GOOGLE_ACCOUNT: "TIME_SYNC_GOOGLE_ACCOUNT",
  TIME_SYNC_CUSTOMER: "TIME_SYNC_CUSTOMER",
  TIME_SYNC_ZALO: "TIME_SYNC_ZALO",
  TIME_SYNC_TITOK: "TIME_SYNC_TITOK",
  TIME_SYNC_SHOPEE: "TIME_SYNC_SHOPEE",
};

export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_NAME: "UPDATE_NAME",
  UPDATE_TAB_HEADER: "UPDATE_TAB_HEADER",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_PARAMS_FILTER: "UPDATE_PARAMS_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_AD_ACCOUNT: "UPDATE_AD_ACCOUNT",
  UPDATE_GOOGLE_ACCOUNT: "UPDATE_GOOGLE_ACCOUNT",
  UPDATE_CUSTOMER_ACCOUNT: "UPDATE_CUSTOMER_ACCOUNT",
  UPDATE_SKYLINK_ACCOUNT: "UPDATE_SKYLINK_ACCOUNT",
  UPDATE_ZALO_ACCOUNT: "UPDATE_ZALO_ACCOUNT",
  UPDATE_FANPAGE: "UPDATE_FANPAGE",
  UPDATE_ACCOUNT: "UPDATE_ACCOUNT",
  UPDATE_TIKTOK_ACCOUNT: "UPDATE_TIKTOK_ACCOUNT",
  UPDATE_TIKI_ACCOUNT: "UPDATE_TIKI_ACCOUNT",
  UPDATE_LAZADA_ACCOUNT: "UPDATE_LAZADA_ACCOUNT",
  UPDATE_SHOPEE_ACCOUNT: "UPDATE_SHOPEE_ACCOUNT",
  UPDATE_POPUP: "UPDATE_POPUP",
  UPDATE_ROLES: "UPDATE_ROLES",
  RESIZE_COLUMN_AD_ACCOUNT: "RESIZE_COLUMN_AD_ACCOUNT",
  RESIZE_COLUMN_GOOGLE_ACCOUNT: "RESIZE_COLUMN_GOOGLE_ACCOUNT",
  RESIZE_COLUMN_CUSTOMER_ACCOUNT: "RESIZE_COLUMN_CUSTOMER_ACCOUNT",
  RESIZE_COLUMN_FANPAGE: "RESIZE_COLUMN_FANPAGE",
  RESIZE_COLUMN_ACCOUNT: "RESIZE_COLUMN_ACCOUNT",
  RESIZE_COLUMN_ZALO_ACCOUNT: "RESIZE_COLUMN_ZALO_ACCOUNT",
  RESIZE_COLUMN_SKYLINK_ACCOUNT: "RESIZE_COLUMN_SKYLINK_ACCOUNT",
  RESIZE_COLUMN_TIKTOK_ACCOUNT: "RESIZE_COLUMN_TIKTOK_ACCOUNT",
  RESIZE_COLUMN_LAZADA_ACCOUNT: "RESIZE_COLUMN_LAZADA_ACCOUNT",
  RESIZE_COLUMN_TIKI_ACCOUNT: "RESIZE_COLUMN_TIKI_ACCOUNT",
  RESIZE_COLUMN_SHOPEE_ACCOUNT: "RESIZE_COLUMN_SHOPEE_ACCOUNT",
  RESIZE_COLUMN_ROLES: "RESIZE_COLUMN_ROLES",
  UPDATE_COLUMN_ORDER_AD_ACCOUNT: "UPDATE_COLUMN_ORDER_AD_ACCOUNT",
  UPDATE_COLUMN_ORDER_CAMPAIGN: "UPDATE_COLUMN_ORDER_CAMPAIGN",
  UPDATE_COLUMN_ORDER_GOOGLE_ACCOUNT: "UPDATE_COLUMN_ORDER_GOOGLE_ACCOUNT",
  UPDATE_COLUMN_ORDER_CUSTOMER_ACCOUNT: "UPDATE_COLUMN_ORDER_CUSTOMER_ACCOUNT",
  UPDATE_COLUMN_ORDER_ZALO_ACCOUNT: "UPDATE_COLUMN_ORDER_ZALO_ACCOUNT",
  UPDATE_COLUMN_ORDER_FANPAGE: "UPDATE_COLUMN_ORDER_FANPAGE",
  UPDATE_COLUMN_ORDER_ACCOUNT: "UPDATE_COLUMN_ORDER_ACCOUNT",
  UPDATE_COLUMN_ORDER_SKYLINK_ACCOUNT: "UPDATE_COLUMN_ORDER_SKYLINK_ACCOUNT",
  UPDATE_COLUMN_ORDER_TIKTOK_ACCOUNT: "UPDATE_COLUMN_ORDER_TIKTOK_ACCOUNT",
  UPDATE_COLUMN_ORDER_LAZADA_ACCOUNT: "UPDATE_COLUMN_ORDER_LAZADA_ACCOUNT",
  UPDATE_COLUMN_ORDER_TIKI_ACCOUNT: "UPDATE_COLUMN_ORDER_TIKI_ACCOUNT",
  UPDATE_COLUMN_ORDER_SHOPEE_ACCOUNT: "UPDATE_COLUMN_ORDER_SHOPEE_ACCOUNT",
  UPDATE_COLUMN_ORDER_ROLES: "UPDATE_COLUMN_ORDER_ROLES",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_SKYLINK_USERS: "UPDATE_SKYLINK_USERS",
  UPDATE_SEARCH_INPUT: "UPDATE_SEARCH_INPUT",
};

// Column
export const columnShowAccountDefault: ColumnShowDatagrid<AccountTypeDefault> = {
  columnWidths: [
    { columnName: "is_active", width: 120 },
    { columnName: "is_export_data", width: 150 },
    { columnName: "operation", width: 100 },

    { columnName: "account", width: 350 },
    { columnName: "info", width: 250 },
    { columnName: "name", width: 150 },
    { columnName: "status_sync_show", width: 180 },
    { columnName: "time_refresh_data", width: 300 },

    { columnName: "operation_refresh", width: 100 },
    { columnName: "sync_is_active", width: 120 },
    { columnName: "fb_account", width: 150 },
    { columnName: "ad_account_name", width: 200 },
    { columnName: "ad_account_status", width: 150 },
    { columnName: "sync_habt", width: 120 },
    { columnName: "sync_jp24", width: 120 },

    { columnName: "currency_code", width: 150 },
    { columnName: "time_zone", width: 150 },
    { columnName: "gg_account", width: 150 },
    { columnName: "customer_id", width: 150 },
    { columnName: "account_name", width: 150 },
    { columnName: "created", width: 150 },
    { columnName: "modified", width: 150 },
    { columnName: "description", width: 150 },
    { columnName: "is_verified", width: 150 },

    // Tiktok Bm
    { columnName: "is_activate", width: 150 },
    { columnName: "created", width: 150 },
    { columnName: "email", width: 150 },
    { columnName: "display_name", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "status_sync_show",
      title: "Trạng thái đồng bộ",
      isShow: true,
    },
    {
      name: "time_refresh_data",
      title: "Thời gian đồng bộ gần nhất",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "status_sync_show",
      title: "Trạng thái đồng bộ",
      isShow: true,
      column: "status_sync_show",
      isShowTitle: false,
    },
    {
      name: "time_refresh_data",
      title: "Thời gian đồng bộ gần nhất",
      isShow: true,
      column: "time_refresh_data",
      isShowTitle: false,
    },
  ],
};

export const columnSkylinkAccount: ColumnShowDatagrid<SkylinkAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "account",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "info",
      title: "Thông tin",
      isShow: true,
    },
    {
      name: "is_active",
      title: "Trạng thái hoạt động",
      isShow: true,
    },
    {
      name: "is_export_data",
      title: "Xuất file email",
      isShow: true,
    },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "name",
      title: "Họ và tên",
      isShow: true,
      column: "account",
      isShowTitle: false,
    },
    {
      name: "email",
      title: "Email",
      isShow: true,
      column: "account",
      isShowTitle: false,
    },
    {
      name: "last_login",
      title: "Lần đăng nhập cuối",
      isShow: true,
      column: "account",
    },
    {
      name: "phone",
      title: "Số điện thoại",
      isShow: true,
      column: "info",
      isShowTitle: false,
    },
    {
      name: "role",
      title: "Quyền",
      isShow: true,
      column: "info",
    },
    {
      name: "department",
      title: "Phòng ban",
      isShow: true,
      column: "info",
    },
    {
      name: "operation",
      column: "operation",
      title: "Thao tác",
      isShowTitle: false,
      isShow: true,
    },
  ],
};

export const columnShowFacebookAccount: ColumnShowDatagrid<FacebookAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "name",
      title: "Tài khoản",
      isShow: true,
    },
    ...columnShowAccountDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "name",
      title: "Tài khoản",
      isShow: true,
      column: "name",
      isShowTitle: false,
    },
    ...columnShowAccountDefault.columnShowTable,
  ],
};

export const columnShowAdAccount: ColumnShowDatagrid<AdAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "sync_is_active",
      title: "Đồng bộ",
      isShow: true,
    },
    {
      name: "sync_habt",
      title: "Đồng bộ HABT",
      isShow: true,
      tenantName: "habt",
    },
    {
      name: "sync_jp24",
      title: "Đồng bộ JP24",
      isShow: true,
      tenantName: "jp24",
    },
    {
      name: "ad_account_name",
      title: "Tên",
      isShow: true,
    },
    {
      name: "ad_account_status",
      title: "Trạng thái tài khoản",
      isShow: true,
    },
    ...columnShowAccountDefault.columnsShowHeader,
    {
      name: "fb_account",
      title: "Tài khoản",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "sync_habt",
      column: "sync_habt",
      isShowTitle: false,
      title: "Đồng bộ HABT",
      isShow: true,
    },
    {
      name: "sync_jp24",
      column: "sync_jp24",
      isShowTitle: false,
      title: "Đồng bộ JP24",
      isShow: true,
    },
    {
      name: "ad_account_name",
      column: "ad_account_name",
      isShowTitle: false,
      title: "Tên",
      isShow: true,
    },
    {
      name: "ad_account_status",
      column: "ad_account_status",
      isShowTitle: false,
      title: "Trạng thái tài khoản",
      isShow: true,
    },
    ...columnShowAccountDefault.columnShowTable,
    {
      name: "fb_account",
      column: "fb_account",
      isShowTitle: false,
      title: "Tài khoản",
      isShow: true,
    },
  ],
};

export const columnShowFanpage: ColumnShowDatagrid<FanpageAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "sync_is_active",
      title: "Đồng bộ",
      isShow: true,
    },
    {
      name: "sync_habt",
      title: "Đồng bộ HABT",
      isShow: true,
      tenantName: "habt",
    },
    {
      name: "sync_jp24",
      title: "Đồng bộ JP24",
      isShow: true,
      tenantName: "jp24",
    },
    {
      name: "name",
      title: "Tên",
      isShow: true,
    },
    {
      name: "fb_account",
      title: "Tài khoản",
      isShow: true,
    },
    ...columnShowAccountDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "sync_habt",
      column: "sync_habt",
      isShowTitle: false,
      title: "Đồng bộ HABT",
      isShow: true,
    },
    {
      name: "sync_jp24",
      column: "sync_jp24",
      isShowTitle: false,
      title: "Đồng bộ JP24",
      isShow: true,
    },
    {
      name: "name",
      column: "name",
      isShowTitle: false,
      title: "Tên",
      isShow: true,
    },
    {
      name: "fb_account",
      column: "fb_account",
      isShowTitle: false,
      title: "Tài khoản",
      isShow: true,
    },
    ...columnShowAccountDefault.columnShowTable,
  ],
};

export const columnShowGoogleAccount: ColumnShowDatagrid<GoogleAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "name",
      title: "Tài khoản",
      isShow: true,
    },
    ...columnShowAccountDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "name",
      column: "name",
      isShowTitle: false,
      title: "Tên",
      isShow: true,
    },
    ...columnShowAccountDefault.columnShowTable,
  ],
};

export const columnShowCustomerAccount: ColumnShowDatagrid<CustomerAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "sync_is_active",
      title: "Đồng bộ",
      isShow: true,
    },
    {
      name: "sync_habt",
      title: "Đồng bộ HABT",
      isShow: true,
      tenantName: "habt",
    },
    {
      name: "sync_jp24",
      title: "Đồng bộ JP24",
      isShow: true,
      tenantName: "jp24",
    },
    {
      name: "name",
      title: "Khách hàng",
      isShow: true,
    },
    ...columnShowAccountDefault.columnsShowHeader,
    {
      name: "currency_code",
      title: "Loại tiền tệ",
      isShow: true,
    },
    {
      name: "time_zone",
      title: "Mốc thời gian",
      isShow: true,
    },
    {
      name: "customer_id",
      title: "ID Customer",
      isShow: true,
    },
    {
      name: "gg_account",
      title: "Tài khoản Google",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "sync_is_active",
      column: "sync_is_active",
      isShowTitle: false,
      title: "Đồng bộ",
      isShow: true,
    },
    {
      name: "sync_habt",
      column: "sync_habt",
      isShowTitle: false,
      title: "Đồng bộ HABT",
      isShow: true,
    },
    {
      name: "sync_jp24",
      column: "sync_jp24",
      isShowTitle: false,
      title: "Đồng bộ JP24",
      isShow: true,
    },
    {
      name: "name",
      column: "name",
      isShowTitle: false,
      title: "Khách hàng",
      isShow: true,
    },
    ...columnShowAccountDefault.columnShowTable,
    {
      name: "currency_code",
      column: "currency_code",
      isShowTitle: false,
      title: "Loại tiền tệ",
      isShow: true,
    },
    {
      name: "time_zone",
      column: "time_zone",
      isShowTitle: false,
      title: "Mốc thời gian",
      isShow: true,
    },
    {
      name: "customer_id",
      column: "customer_id",
      isShowTitle: false,
      title: "ID Customer",
      isShow: true,
    },
    {
      name: "gg_account",
      column: "gg_account",
      isShowTitle: false,
      title: "Tài khoản Google",
      isShow: true,
    },
  ],
};

export const columnShowZaloAccount: ColumnShowDatagrid<ZaloAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "account_name",
      title: "Tên",
      isShow: true,
    },
    {
      name: "created",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "modified",
      title: "Ngày cập nhật",
      isShow: true,
    },
    {
      name: "description",
      title: "Mô tả",
      isShow: true,
    },
    {
      name: "is_verified",
      title: "Trạng thái kích hoạt",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "name",
      column: "account_name",
      isShowTitle: false,
      title: "Tên",
      isShow: true,
    },
    {
      name: "created",
      column: "created",
      isShowTitle: false,
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "modified",
      column: "modified",
      isShowTitle: false,
      title: "Ngày cập nhật",
      isShow: true,
    },
    {
      name: "description",
      column: "description",
      isShowTitle: false,
      title: "Mô tả",
      isShow: true,
    },
    {
      name: "is_verified",
      column: "is_verified",
      isShowTitle: false,
      title: "Trạng thái kích hoạt",
      isShow: true,
    },
  ],
};

export const columnShowTiktokBmAccount: ColumnShowDatagrid<TiktokBmAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "created",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "display_name",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "email",
      title: "Email",
      isShow: true,
    },
    {
      name: "is_activate",
      title: "Active",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "created",
      column: "created",
      isShowTitle: false,
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "display_name",
      column: "display_name",
      isShowTitle: false,
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "email",
      column: "email",
      isShowTitle: false,
      title: "Email",
      isShow: true,
    },
    {
      name: "is_activate",
      column: "is_activate",
      isShowTitle: false,
      title: "Active",
      isShow: true,
    },
  ],
};

export const columnShowTiktokAdsAccount: ColumnShowDatagrid<TiktokAdsAccountType> = {
  columnWidths: columnShowAccountDefault.columnWidths,
  columnsShowHeader: [
    {
      name: "sync_is_active",
      title: "Đồng bộ",
      isShow: true,
    },
    {
      name: "sync_habt",
      title: "Đồng bộ HABT",
      isShow: true,
      tenantName: "habt",
    },
    {
      name: "sync_jp24",
      title: "Đồng bộ JP24",
      isShow: true,
      tenantName: "jp24",
    },
    {
      name: "name",
      title: "Tên",
      isShow: true,
    },
    ...columnShowAccountDefault.columnsShowHeader,
  ],
  columnShowTable: [
    {
      name: "sync_habt",
      column: "sync_habt",
      isShowTitle: false,
      title: "Đồng bộ HABT",
      isShow: true,
    },
    {
      name: "sync_jp24",
      column: "sync_jp24",
      isShowTitle: false,
      title: "Đồng bộ JP24",
      isShow: true,
    },
    {
      name: "name",
      column: "name",
      isShowTitle: false,
      title: "Tên",
      isShow: true,
    },
    ...columnShowAccountDefault.columnShowTable,
  ],
};

export const columnShowTiktokAccount: ColumnShowDatagrid<TiktokAccountType> = {
  columnWidths: [
    { columnName: "shops", width: 250 },
    { columnName: "seller", width: 250 },
    { columnName: "status", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "seller",
      title: "Seller",
      isShow: true,
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "shops",
      title: "Shop",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "seller_name",
      title: "Tên seller",
      isShow: true,
      column: "seller",
      isShowTitle: false,
    },
    {
      name: "created",
      title: "Ngày tạo",
      isShow: true,
      column: "seller",
    },
    {
      name: "refresh_token_expire_in",
      title: "Ngày hết hạn",
      isShow: true,
      column: "seller",
    },
    {
      name: "seller_base_region",
      title: "Quốc gia",
      isShow: true,
      column: "seller",
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
      column: "status",
      isShowTitle: false,
    },
    {
      name: "shop_name",
      title: "Tên shop",
      isShow: true,
      column: "shops",
      isShowTitle: false,
    },
    {
      name: "created",
      title: "Ngày tạo",
      isShow: true,
      column: "shops",
    },
    {
      name: "operation_resync",
      title: "Đồng bộ lại",
      isShow: true,
      column: "shops",
    },
  ],
};

export const columnShowLazadaAccount: ColumnShowDatagrid<LazadaAccountType> = {
  columnWidths: [
    { columnName: "account", width: 400 },
    { columnName: "status", width: 150 },
    { columnName: "time", width: 300 },
  ],
  columnsShowHeader: [
    {
      name: "account",
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "time",
      title: "Thời gian",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "name",
      title: "Tên shop",
      isShow: true,
      column: "account",
      isShowTitle: false,
    },
    {
      name: "email",
      title: "Email",
      isShow: true,
      column: "account",
    },
    {
      name: "name_company",
      title: "Công ty",
      isShow: true,
      column: "account",
    },
    {
      name: "location",
      title: "Địa chỉ",
      isShow: true,
      column: "account",
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
      column: "status",
      isShowTitle: false,
    },
    {
      name: "created_at",
      title: "Thời gian tạo",
      isShow: true,
      column: "time",
    },
    {
      name: "modified_at",
      title: "Thời gian chỉnh sửa",
      isShow: true,
      column: "time",
    },
    {
      name: "refresh_token_expired_at",
      title: "Thời gian hết hạn",
      isShow: true,
      column: "time",
    },
    {
      name: "authorized_at",
      title: "Thời gian đồng bộ",
      isShow: true,
      column: "time",
    },
    {
      name: "operation_resync",
      title: "Đồng bộ lại",
      isShow: true,
      column: "shops",
    },
  ],
};

export const columnShowShopeeAccount: ColumnShowDatagrid<ShopeeAccountType> = {
  columnWidths: [
    { columnName: "shop", width: 400 },
    { columnName: "info", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "shop",
      title: "Shop",
      isShow: true,
    },
    {
      name: "info",
      title: "Thông tin",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "shop_name",
      title: "Tên shop",
      isShow: true,
      column: "shop",
      isShowTitle: false,
    },
    {
      name: "expire_in",
      title: "Thời gian hết hạn",
      isShow: true,
      column: "shop",
    },
    {
      name: "region",
      title: "Quốc gia",
      isShow: true,
      column: "shop",
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
      column: "info",
      isShowTitle: false,
    },
    {
      name: "operation_resync",
      title: "Đồng bộ lại",
      isShow: true,
      column: "info",
    },
  ],
};

export const columnShowRoles: ColumnShowDatagrid<RoleType> = {
  columnWidths: [
    { columnName: "name", width: 240 },
    { columnName: "code", width: 200 },
    { columnName: "route", width: 300 },
    { columnName: "operation", width: 200 },
  ],
  columnsShowHeader: [
    {
      name: "name",
      title: "Tên nhóm",
      isShow: true,
    },
    {
      name: "code",
      title: "Mã nhóm",
      isShow: true,
    },
    {
      name: "route",
      title: "Đường dẫn mặc định",
      isShow: true,
    },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "name",
      column: "name",
      isShowTitle: false,
      title: "Tên nhóm",
      isShow: true,
    },
    {
      name: "code",
      column: "code",
      isShowTitle: false,
      title: "Mã nhóm",
      isShow: true,
    },
    {
      name: "route",
      column: "route",
      isShowTitle: false,
      title: "Đường dẫn mặc định",
      isShow: true,
    },
    {
      name: "operation",
      column: "operation",
      isShowTitle: false,
      title: "Thao tác",
      isShow: true,
    },
  ],
};

// Detail
export const columnShowUserHistory: ColumnShowDatagrid<UserHistoryType> = {
  columnWidths: [
    {
      columnName: "history_date",
      width: 170,
    },
    {
      columnName: "history_user",
      width: 170,
    },
    {
      columnName: "history_type",
      width: 170,
    },
    {
      columnName: "history_change_reason",
      width: 170,
    },
    {
      columnName: "name",
      width: 170,
    },
    {
      columnName: "phone",
      width: 170,
    },
    {
      columnName: "group_permission",
      width: 170,
    },
    {
      columnName: "department",
      width: 170,
    },
    {
      columnName: "status",
      width: 170,
    },
    {
      columnName: "is_export_data",
      width: 170,
    },
  ],
  columnsShowHeader: [
    {
      name: "history_date",
      title: "Ngày cập nhật",
      isShow: true,
    },
    {
      name: "history_user",
      title: "Người cập nhật",
      isShow: true,
    },
    {
      name: "history_type",
      title: "Loại cập nhật",
      isShow: true,
    },
    {
      name: "history_change_reason",
      title: "Lí do cập nhật",
      isShow: true,
    },
    {
      name: "name",
      title: "Tên",
      isShow: true,
    },
    {
      name: "phone",
      title: "SĐT",
      isShow: true,
    },
    {
      name: "group_permission",
      title: "Quyền",
      isShow: true,
    },
    {
      name: "department",
      title: "Phòng ban",
      isShow: true,
    },
    {
      name: "status",
      title: "Trạng thái hoạt động",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "history_date",
      column: "history_date",
      isShowTitle: false,
      title: "Ngày cập nhật",
      isShow: true,
    },
    {
      name: "history_user",
      column: "history_user",
      isShowTitle: false,
      title: "Người cập nhật",
      isShow: true,
    },
    {
      name: "history_type",
      column: "history_type",
      isShowTitle: false,
      title: "Loại cập nhật",
      isShow: true,
    },
    {
      name: "history_change_reason",
      column: "history_change_reason",
      isShowTitle: false,
      title: "Lí do cập nhật",
      isShow: true,
    },
    {
      name: "name",
      column: "name",
      isShowTitle: false,
      title: "Tên",
      isShow: true,
    },
    {
      name: "phone",
      column: "phone",
      isShowTitle: false,
      title: "SĐT",
      isShow: true,
    },
    {
      name: "group_permission",
      column: "group_permission",
      isShowTitle: false,
      title: "Quyền",
      isShow: true,
    },
    {
      name: "department",
      column: "department",
      isShowTitle: false,
      title: "Phòng ban",
      isShow: true,
    },
    {
      name: "status",
      column: "status",
      isShowTitle: false,
      title: "Trạng thái hoạt động",
      isShow: true,
    },
  ],
};

export const message = {
  DELETE_USER_SUCCESS: "Xóa tài khoản thành công",
  DELETE_USER_FAILED: "Xoá tài khoản thất bại",
  ADD_ACCOUNT_SUCCESS: "Thêm tài khoản thành công",
  ADD_ACCOUNT_FAILED: "Thêm tài khoản thất bại",
  LOGIN_ZALO: {
    success: "Đăng nhập thành công",
    error: "Đăng nhập thất bại",
    error_0001: "Xác thực Zalo code không thành công",
    error_0002: "Lỗi khi lấy Access Token của Zalo Oa",
    error_0003: "Lỗi khi lấy thông tin OA từ Zalo",
  },
  SYNC_SUCCESS: "Đồng bộ thành công",
  SYNC_FAILED: "Đồng bộ thất bại",
  MESSAGE_POPUP_TUNR_ON_AD_ACCOUNT:
    "Dữ liệu Facebook Marketing của bạn sẽ được đồng bộ tất cả hoặc trong 90 ngày gần nhất bao gồm cả ngày hôm nay:  Ad Account(all), Campaign(all), Ad Set(all), Ad(all), Ad Insight(90d)",
  MESSAGE_POPUP_TUNR_OFF_AD_ACCOUNT:
    "Dữ liệu Facebook Marketing của Ad Account này sẽ được xóa tất cả: Campaign(all), Ad Set(all), Ad(all), Ad Insight(all)",
  MESSAGE_POPUP_TUNR_ON_FANPAGE:
    "Dữ liệu Facebook Fanpage của bạn sẽ được đồng bộ tất cả hoặc trong 90 ngày gần nhất bao gồm cả ngày hôm nay:  Page Post(90d), Live Post(90d), Ad Post(90d), Comment(all), Convervation(90d), Message(all)",
  MESSAGE_POPUP_TUNR_OFF_FANPAGE:
    "Dữ liệu Facebook Fanpage của Page này sẽ được xóa tất cả: Page Post(all), Live Post(all), Ad Post(all), Comment(all), Convervation(all), Message(all)",
  MESSAGE_POPUP_TUNR_ON_CUSTOMER:
    "Dữ liệu Google Customer của bạn sẽ được đồng bộ tất cả hoặc trong 90 ngày gần nhất bao gồm cả ngày hôm nay:  Customer(all), Campaign(all), Ad Group(all), Ad(all)",
  MESSAGE_POPUP_TUNR_OFF_CUSTOMER:
    "Dữ liệu Goole Customer của Customer này sẽ được xóa tất cả: Customer(all), Campaign(all), Ad Group(all), Ad(all)",
  MESSAGE_POPUP_SYNC_PRODUCT_TIKTOK:
    "Dữ liệu sản phẩm từ bên sàn Tiktok của shop này sẽ được đồng bộ lại",
  MESSAGE_POPUP_SYNC_PRODUCT_SHOPEE:
    "Dữ liệu sản phẩm từ bên sàn Shopee của shop này sẽ được đồng bộ lại",
  TIME_SYNC_PRODUCT_TIKTOK: "Hãy đồng bộ lại sau 5 phút",
  TIME_SYNC_PRODUCT_SHOPEE: "Hãy đồng bộ lại sau 5 phút",
  UPDATE_SUCCESS: "Cập nhật thành công",
  UPDATE_FAILED: "Cập nhật thất bại",
  UPLOAD_IMAGE: "Tải hình ảnh thành công",
};

export const optionActive = [
  {
    value: "all",
    label: "Tất cả",
  },
  {
    value: true,
    label: "Hoạt động",
  },
  {
    value: false,
    label: "Ngừng hoạt động",
  },
];

export const SETTINGS_HEADER = ["user"];

export const FACEBOOK_REFRESH_TOKEN_URL = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${FACEBOOK_DEV_ID}&redirect_uri=${
  //
  import.meta.env.REACT_APP_URL_DATA
}/facebook/login/&auth_type=rerequest&state=mPnBRC1qxapOAxQpWmjy4NofbgxCmXSj&scope=read_insights,pages_show_list,ads_management,ads_read,business_management,pages_messaging,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_ads,public_profile`;

export const LAZADA_REFRESH_TOKEN_URL = `${
  import.meta.env.REACT_APP_SKYCOM_API
}/lazada/connectors/oauth_url?callback_url=`;

export const ZALO_REFRESH_TOKEN_URL = `${
  import.meta.env.REACT_APP_API_URL
}/app/zalo/connect/?frontend_callback_url=`;

export const SECRET_KEY_STORAGE_ZALO = "secretCodeZalo";

export const checkLocalStorage = (key: string, time: number = 30) => {
  const timeLocal = getStorage(key);

  if (timeLocal) {
    const newDate: any = new Date();
    const newDate2: any = new Date(timeLocal);
    const count = Math.round((((newDate - newDate2) % 86400000) % 3600000) / 60000);

    if (count < time) {
      return true;
    } else {
      deleteStorage(key);
      return false;
    }
  }

  return false;
};

export const typeHandlePopupSkylinkAccount = {
  CREATE: "Tạo",
  UPDATE: "Cập nhật",
  ATTACH_ROLE_ACCOUNT: "Thêm",
};

export const titlePopupHandle = {
  ADD_DEPARTMENT: "Thêm phòng ban",
  EDIT_DEPARTMENT: "Chỉnh sửa phòng ban",
};

export const typeHandle = {
  DEPARTMENT: "DEPARTMENT",
};

export const mapLabels: {
  name: string;
  title: string;
}[] = [
  {
    name: "image",
    title: "Avatar",
  },
  {
    name: "name",
    title: "Tên",
  },
  {
    name: "phone",
    title: "SĐT",
  },
  {
    name: "group_permission",
    title: "Quyền",
  },
  {
    name: "department",
    title: "Phòng ban",
  },
  {
    name: "is_staff",
    title: "Nhân viên",
  },
  {
    name: "is_superuser",
    title: "Super Admin",
  },
  {
    name: "is_active",
    title: "Trạng thái hoạt động",
  },
  {
    name: "is_export_data",
    title: "Xuất file",
  },
  {
    name: "password",
    title: "Password",
  },
];

// Props table default
const arrColumnEditLabel = [
  "ad_account_status",
  "status_sync_show",
  "status",
  "is_staff",
  "is_superuser",
  "history_type",
];

const arrDateTime = [
  "time_refresh_data",
  "authorized_at",
  "refresh_token_expired_at",
  "created_at",
  "modified_at",
  "expire_in",
  "last_login",
  "history_date",
  "created",
  "created_shop",
  "refresh_token_expire_in",
  "modified",
];

const arrColumnThumbImg = ["shop", "account_name"];

const arrColumnOptional = ["operation_resync", "seller_name", "shop_name"];

const arrColumnAvatar = ["account"];

const arrHandleList = ["shops"];

const arrColumnBool = ["is_verified", "is_activate"];

export const arrColumnShowInfo = [
  "status_sync_show",
  "time_refresh_data",
  "name",
  "fb_account",

  // Ad account
  "ad_account_name",
  "ad_account_status",
  "fb_account",

  // Facebook Account
  // Lazada Account
  "account",
  "status",
  "time",

  // Shopee Account
  "shop",
  "info",

  // Tiktok Account
  "seller",
  "shops",

  // Zalo Account
  "account_name",
  "created",
  "modified",
  "description",
  "is_verified",

  // Role
  "code",
  "route",

  // User History
  "history_date",
  "history_user",
  "history_type",
  "history_change_reason",
  "phone",
  "group_permission",
  "department",

  // Tiktok BM
  "created_at",
  "display_name",
  "email",
  "is_activate",
];

export const propsTableDefault: any = {
  arrColumnEditLabel,
  arrDateTime,
  arrColumnThumbImg,
  arrColumnOptional,
  arrColumnAvatar,
  arrHandleList,
  arrColumnBool,
};

export const handleDataItem = (item: AccountType | AdAccountType | TiktokAdvertiserUserType) => {
  return {
    status_sync_show: {
      value: STATUS_SYNC[item?.status_sync || ""],
      color: COLOR_STATUS_SYNC[item?.status_sync || ""] as LabelColor,
    },
    ad_account_status: {
      value: STATUS_SYNC[item?.status as keyof typeof STATUS_SYNC],
      color: COLOR_STATUS_SYNC[item?.status as keyof typeof COLOR_STATUS_SYNC] as LabelColor,
    },
  };
};

export const TAB_HEADER_SETTING = (user: Partial<UserType> | null, roles: any) => [
  {
    label: "Tài khoản nhân sự",
    icon: <SupervisedUserCircleIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT]
    ),
  },
  {
    icon: <FacebookIcon />,
    label: "Tài khoản Facebook BM",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT]
    ),
  },
  {
    icon: <CampaignIcon />,
    label: "Tài khoản Facebook quảng cáo",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT]
    ),
  },
  {
    icon: <WebIcon />,
    label: "Tài khoản Fanpage",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT]
    ),
  },
  {
    icon: <SupervisorAccountIcon />,
    label: "Tài khoản Google BM",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM]
    ),
  },
  {
    icon: <AccountBoxIcon />,
    label: "Tài khoản Google CT",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT]
    ),
  },
  {
    icon: <BallotIcon />,
    label: "Tài khoản Tiktok BM",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT]
    ),
  },
  {
    icon: <BallotIcon />,
    label: "Tài khoản Tiktok Ads",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT]
    ),
  },
  {
    icon: <GroupIcon />,
    label: "Tài khoản Tiktok Shop",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT]
    ),
  },
  {
    icon: <LoyaltyIcon />,
    label: "Tài khoản Lazada",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT]
    ),
  },
  {
    icon: <BallotIcon />,
    label: "Tài khoản Shopee",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT]
    ),
  },
  {
    icon: <EmojiEmotionsIcon />,
    label: "Tài khoản Zalo",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.ZALO_ACCOUNT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.ZALO_ACCOUNT]
    ),
  },
  {
    icon: <ManageAccountsIcon />,
    label: "Quyền",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SETTINGS][STATUS_ROLE_SETTINGS.ROLE]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SETTINGS]?.[STATUS_ROLE_SETTINGS.ROLE]
    ),
  },
];
