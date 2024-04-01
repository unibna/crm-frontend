import { ACCOUNTANT_PATH } from "routes/paths";
import {
  GENERAL_ROLES,
  PROMOTION_ROLES,
  ROLE_TAB,
  STATUS_ROLE_AIRTABLE,
  STATUS_ROLE_ATTRIBUTE,
  STATUS_ROLE_CDP,
  STATUS_ROLE_CONTENT_DAILY,
  STATUS_ROLE_CONTENT_ID,
  STATUS_ROLE_DASHBOARD,
  STATUS_ROLE_DATA_FLOW,
  STATUS_ROLE_FACEBOOK,
  STATUS_ROLE_GOOGLE,
  STATUS_ROLE_LEAD,
  STATUS_ROLE_MANAGE_FILE,
  STATUS_ROLE_ORDERS,
  STATUS_ROLE_PRODUCT,
  STATUS_ROLE_REPORT_REVENUE,
  STATUS_ROLE_SETTINGS,
  STATUS_ROLE_SHIPPING,
  STATUS_ROLE_SKYCOM_TABLE,
  STATUS_ROLE_TRANSPORTATION,
  STATUS_ROLE_WAREHOUSE,
  STATUS_ROLE_ZALO,
  TypeRenderComponent,
} from "./rolesTab";
import vi from "locales/vi.json";

export const ROLE_RENDER: TypeRenderComponent[] = [
  {
    group: "General",
    label: "Chung",
    name: ROLE_TAB.GENERAL,
    roles: [
      {
        name: GENERAL_ROLES.EXPORT_EXCEL,
        label: "Export file",
      },
    ],
  },
  {
    group: "General",
    label: "Dashboard",
    name: ROLE_TAB.DASHBOARD,
    roles: [
      {
        name: STATUS_ROLE_DASHBOARD.DASHBOARD,
        label: "Dashboard",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_DASHBOARD.MKT_DASHBOARD,
        label: "Dashboard Marketing",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_DASHBOARD.SALE_DASHBOARD,
        label: "Dashboard Sale",
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "General",
    label: "Cấu hình",
    name: ROLE_TAB.SETTINGS,
    roles: [
      {
        name: STATUS_ROLE_SETTINGS.SKYLINK_ACCOUNT,
        label: "Tài khoản",
      },
      {
        name: STATUS_ROLE_SETTINGS.FACEBOOK_ACCOUNT,
        label: "Tài khoản Facebook BM",
      },
      {
        name: STATUS_ROLE_SETTINGS.AD_FACEBOOK_ACCOUNT,
        label: "Tài khoản quảng cáo Facebook",
      },
      {
        name: STATUS_ROLE_SETTINGS.FANPAGE_ACCOUNT,
        label: "Tài khoản Fanpage",
      },
      {
        name: STATUS_ROLE_SETTINGS.GOOGLE_ACCOUNT_BM,
        label: "Tài khoản Google BM",
      },
      {
        name: STATUS_ROLE_SETTINGS.CUSTOMER_ACCOUNT,
        label: "Tài khoản Google CT",
      },
      {
        name: STATUS_ROLE_SETTINGS.TIKTOK_ACCOUNT,
        label: "Tài khoản Tiktok Shop",
      },
      {
        name: STATUS_ROLE_SETTINGS.TIKTOK_BM_ACCOUNT,
        label: "Tài khoản Tiktok BM",
      },
      {
        name: STATUS_ROLE_SETTINGS.TIKTOK_ADS_ACCOUNT,
        label: "Tài khoản Tiktok Ads",
      },
      {
        name: STATUS_ROLE_SETTINGS.LAZADA_ACCOUNT,
        label: "Tài khoản Lazada",
      },
      {
        name: STATUS_ROLE_SETTINGS.TIKI_ACCOUNT,
        label: "Tài khoản Tiki",
      },
      {
        name: STATUS_ROLE_SETTINGS.SHOPEE_ACCOUNT,
        label: "Tài khoản Shopee",
      },
      {
        name: STATUS_ROLE_SETTINGS.ZALO_ACCOUNT,
        label: "Tài khoản Zalo",
      },
      {
        name: STATUS_ROLE_SETTINGS.CDP_CARD,
        label: "Thẻ CDP",
      },
      {
        name: STATUS_ROLE_SETTINGS.ROLE,
        label: "Quyền",
      },
    ],
  },
  {
    group: "Marketing",
    label: "Content ID",
    name: ROLE_TAB.CONTENT_ID,
    roles: [
      {
        name: STATUS_ROLE_CONTENT_ID.TOTAL,
        label: "Tổng",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_CONTENT_ID.FACEBOOK,
        label: "Facebook",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_CONTENT_ID.GOOGLE,
        label: "Google",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_CONTENT_ID.PHONE_LEAD,
        label: "Số điện thoại",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_CONTENT_ID.ATTACH_PHONE,
        label: "Gán số điện thoại",
      },
      {
        name: STATUS_ROLE_CONTENT_ID.TIKTOK,
        label: "Tiktok",
      },
      {
        name: STATUS_ROLE_CONTENT_ID.PIVOT,
        label: "Pivot",
      },
      {
        name: STATUS_ROLE_CONTENT_ID.ATTRIBUTES,
        label: "Thuộc tính",
      },
    ],
  },
  {
    group: "Marketing",
    label: "Content Daily",
    name: ROLE_TAB.CONTENT_DAILY,
    roles: [
      {
        name: STATUS_ROLE_CONTENT_DAILY.OVERVIEW,
        label: "Tổng quan",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_CONTENT_DAILY.PIVOT,
        label: "Pivot table",
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "Marketing",
    label: "Facebook",
    name: ROLE_TAB.FACEBOOK,
    roles: [
      {
        name: STATUS_ROLE_FACEBOOK.AD_FACEBOOK,
        label: "Thông tin Facebook Ads",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_FACEBOOK.AD_FANPAGE,
        label: "Thông tin Fanpage Ads",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_FACEBOOK.REPORT_AD_FACEBOOK,
        label: "Báo cáo Facebook Ads",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_FACEBOOK.REPORT_AD_FANPAGE,
        label: "Báo cáo Fanpage Ads",
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "Marketing",
    label: "Google",
    name: ROLE_TAB.GOOGLE,
    roles: [
      {
        name: STATUS_ROLE_GOOGLE.CUSTOMER_ACCOUNT,
        label: "Tài khoản khách hàng",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_GOOGLE.CAMPAIGN_GOOGLE,
        label: "Chiến dịch",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_GOOGLE.ADGROUP_GOOGLE,
        label: "Nhóm quảng cáo",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_GOOGLE.AD_GOOGLE,
        label: "Quảng cáo",
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "Management",
    label: "Lead Center",
    name: ROLE_TAB.LEAD,
    roles: [
      {
        name: STATUS_ROLE_LEAD.ADD_LEAD,
        label: "Thêm Lead",
        isShowRadioRead: false,
      },
      {
        name: STATUS_ROLE_LEAD.STATUS,
        label: "Xử lý Lead",
      },
      {
        name: STATUS_ROLE_LEAD.HANDLE_BY,
        label: "Chia số",
        isShowRadioRead: false,
      },
      {
        name: STATUS_ROLE_LEAD.DATA_STATUS,
        label: "Trạng thái dữ liệu",
      },
      {
        name: STATUS_ROLE_LEAD.REPORT_DAILY_HANDLE_BY,
        label: "Báo cáo chia số hằng ngày",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_LEAD.IMPORT_LEAD_EXCEL,
        label: "Tạo Lead bằng file",
        isShowRadioRead: false,
      },
      {
        name: STATUS_ROLE_LEAD.VOIP,
        label: "Cuộc gọi",
      },
      {
        name: STATUS_ROLE_LEAD.REPORT,
        label: "Báo cáo",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_LEAD.ACCOUNTS,
        label: "Tài khoản",
      },
      {
        name: STATUS_ROLE_LEAD.SPAM_CHECK,
        label: "Spam check",
      },
    ],
  },
  {
    group: "Management",
    label: "Sale online report",
    name: ROLE_TAB.SALE_ONLINE_REPORT,
    roles: [
      {
        name: STATUS_ROLE_DASHBOARD.SALE_ONLINE_REPORT,
        label: "Báo cáo online",
      },
    ],
  },
  {
    group: "Management",
    label: "Zalo",
    name: ROLE_TAB.ZALO,
    roles: [
      {
        name: STATUS_ROLE_ZALO.DASHBOARD,
        label: "Tổng thể",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_ZALO.FOLLOWER_ACCOUNT,
        label: "Tài khoản quan tâm",
      },
      {
        name: STATUS_ROLE_ZALO.NOTIFICATION,
        label: "Thông báo",
      },
    ],
  },
  {
    group: "Management",
    label: "Chăm sóc vận đơn",
    name: ROLE_TAB.TRANSPORTATION,
    roles: [
      {
        name: STATUS_ROLE_TRANSPORTATION.ADD_HANDLE_BY,
        label: "Chia số",
      },
      {
        name: STATUS_ROLE_TRANSPORTATION.STATUS,
        label: "Trạng thái",
      },
      {
        name: STATUS_ROLE_TRANSPORTATION.REPORT_ASSIGNED,
        label: "Báo cáo",
      },
    ],
  },
  {
    group: "Management",
    label: "CDP",
    name: ROLE_TAB.CDP,
    roles: [
      {
        name: STATUS_ROLE_CDP.USERS,
        label: "Danh sách khách hàng",
      },
      {
        name: STATUS_ROLE_CDP.REPORTS,
        label: "Báo cáo hạng",
      },
      {
        name: STATUS_ROLE_CDP.ADD,
        label: "Thêm khách hàng",
      },
      {
        name: STATUS_ROLE_CDP.HANDLE,
        label: "Xử lý",
      },
      {
        name: STATUS_ROLE_CDP.PHONE,
        label: "Số điện thoại khách hàng",
      },
      {
        name: STATUS_ROLE_CDP.CUSTOMER_CARE_STAFF,
        label: "Người chăm sóc",
      },
    ],
  },
  {
    group: "Management",
    label: "Đơn hàng",
    name: ROLE_TAB.ORDERS,
    roles: [
      {
        name: STATUS_ROLE_ORDERS.HANDLE,
        label: "Xử lý đơn",
      },
      {
        name: STATUS_ROLE_ORDERS.PRINT,
        label: "In đơn",
      },
      {
        name: STATUS_ROLE_ORDERS.SHIPPING,
        label: "Giao hàng",
      },
      {
        name: STATUS_ROLE_ORDERS.CANCEL,
        label: "Huỷ đơn",
      },
      {
        name: STATUS_ROLE_ORDERS.CONFIRM,
        label: "Xác nhận đơn",
        isShowRadioRead: false,
      },
      {
        name: STATUS_ROLE_ORDERS.PAYMENT,
        label: "Thanh toán",
      },
      {
        name: STATUS_ROLE_ORDERS.UPLOAD_PAYMENT_CHECK,
        label: "Upload file đối soát",
      },
    ],
  },
  {
    group: "Management",
    label: "Báo cáo doanh thu",
    name: ROLE_TAB.REPORT_REVENUE,
    roles: [
      {
        name: STATUS_ROLE_REPORT_REVENUE.BY_DATE,
        label: vi.by_date,
      },
      {
        name: STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL,
        label: vi.by_channel,
      },
      {
        name: STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY,
        label: vi.by_buyer,
      },
      {
        name: STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT,
        label: vi.by_product,
      },
      {
        name: STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE,
        label: vi.by_province,
      },
    ],
  },
  {
    group: "Management",
    label: "Vận chuyển",
    name: ROLE_TAB.SHIPPING,
    roles: [
      {
        name: STATUS_ROLE_SHIPPING.COMPLETED,
        label: "Chưa có mã vận đơn",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.ALL,
        label: "Tất cả phiếu giao hàng",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.PICKING,
        label: "Chờ lấy hàng",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.DELIVERING,
        label: "Đang giao hàng",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.RETURNING,
        label: "Đang hoàn",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.RETURNED,
        label: "Đã hoàn",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.SUCCESS,
        label: "Giao thành công",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.CANCELLED,
        label: "Giao thành huỷ",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.LOST,
        label: "Đơn lỗi",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.WAIT_DELIVERY,
        label: "Chờ giao lại",
        isShowRadioReadWrite: false,
      },
      {
        name: STATUS_ROLE_SHIPPING.REPORT,
        label: "Báo cáo",
        isShowRadioReadWrite: false,
      },
    ],
  },
  {
    group: "Management",
    label: "Sản phẩm",
    name: ROLE_TAB.PRODUCT,
    roles: [
      {
        name: STATUS_ROLE_PRODUCT.LIST_PRODUCT,
        label: "Danh sách sản phẩm",
      },
      {
        name: STATUS_ROLE_PRODUCT.CREATE_PRODUCT,
        label: "Tạo sản phẩm",
      },
      {
        name: STATUS_ROLE_PRODUCT.MAP_ECOMMERCE,
        label: "TMDT",
      },
    ],
  },
  {
    group: "Management",
    label: "Kế toán",
    name: ROLE_TAB.ACCOUNTANT,
    roles: [
      {
        name: ACCOUNTANT_PATH.REPORT,
        label: "Báo cáo",
        isShowRadioReadWrite: false,
      },
      {
        name: ACCOUNTANT_PATH.COLLATION,
        label: "Đối soát",
      },
    ],
  },
  {
    group: "Management",
    label: "Khuyến mãi",
    name: ROLE_TAB.PROMOTION,
    roles: [
      {
        name: PROMOTION_ROLES.STATUS,
        label: "Trạng thái",
      },
      {
        name: PROMOTION_ROLES.HANDLE,
        label: "Xử lý",
      },
    ],
  },
  {
    group: "Management",
    label: "Kho",
    name: ROLE_TAB.WAREHOUSE,
    roles: [
      {
        name: STATUS_ROLE_WAREHOUSE.LIST_WAREHOUSE,
        label: "Danh sách kho",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.IMPORTS,
        label: "Nhập hàng",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.EXPORTS,
        label: "Xuất hàng",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.TRANSFER,
        label: "Chuyển kho",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.STOCKTAKING,
        label: "Kiểm kho",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.SCAN_EXPORT,
        label: "Quét mã xuất hàng",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY,
        label: "Báo cáo tồn kho",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY_ACTIVITIES,
        label: "Báo cáo kho",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.SCAN_LOGS,
        label: "Lịch sử quét",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS,
        label: "Lịch sử kho",
      },
      {
        name: STATUS_ROLE_WAREHOUSE.SHEET,
        label: "Thông tin phiếu kho",
      },
    ],
  },
  {
    group: "Management",
    label: "CSKH",
    name: ROLE_TAB.CSKH,
    roles: [
      {
        name: STATUS_ROLE_AIRTABLE.CSKH,
        label: "CSKH",
      },
    ],
  },
  {
    group: "Management",
    label: "Quản lý file",
    name: ROLE_TAB.MANAGE_FILE,
    roles: [
      {
        name: STATUS_ROLE_MANAGE_FILE.MANAGE,
        label: "File",
      },
      {
        name: STATUS_ROLE_MANAGE_FILE.GROUP,
        label: "Nhóm",
      },
    ],
  },
  {
    group: "Management",
    label: "SkyTable",
    name: ROLE_TAB.SKYCOM_TABLE,
    roles: [
      {
        name: STATUS_ROLE_SKYCOM_TABLE.HANDLE,
        label: "Danh sách bảng",
      },
      {
        name: STATUS_ROLE_SKYCOM_TABLE.CREATE,
        label: "Tạo bảng",
      },
      {
        name: STATUS_ROLE_SKYCOM_TABLE.DELETE,
        label: "Xoá bảng",
      },
    ],
  },
  {
    group: "Management",
    label: "Data Flow",
    name: ROLE_TAB.DATA_FLOW,
    roles: [
      {
        name: STATUS_ROLE_DATA_FLOW.LIST,
        label: "Danh sách",
      },
      {
        name: STATUS_ROLE_DATA_FLOW.HANDLE,
        label: "Xử lí",
      },
      {
        name: STATUS_ROLE_DATA_FLOW.ACCOUNT,
        label: "Tài khoản",
      },
    ],
  },
  // {
  //   label: "Media",
  //   name: ROLE_TAB.MEDIA,
  //   roles: [
  //     {
  //       name: STATUS_ROLE_MEDIA.HANDLE,
  //       label: "Xử lý",
  //     },
  //   ],
  // },
  {
    group: "System",
    label: "Thuộc tính",
    name: ROLE_TAB.ATTRIBUTE,
    roles: [
      {
        name: STATUS_ROLE_ATTRIBUTE.SETTING,
        label: "Cấu hình",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.LEADS,
        label: "Lead Center",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.TRANSPORTATION,
        label: "Chăm sóc vận đơn",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.CDP,
        label: "CDP",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.ORDER,
        label: "Đơn hàng",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.SHIPPING,
        label: "Vận chuyển",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.PRODUCT,
        label: "Sản phẩm",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.WAREHOUSE,
        label: "Kho",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.AIRTABLE,
        label: "CSKH",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.MANAGE_FILE,
        label: "Quản lí file",
      },
      {
        name: STATUS_ROLE_ATTRIBUTE.DATA_FLOW,
        label: "Data Flow",
      },
    ],
  },
];
