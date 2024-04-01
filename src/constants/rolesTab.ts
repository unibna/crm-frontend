export interface TypeRenderComponent {
  group: string;
  label: string;
  name: string;
  roles: {
    name: string;
    label: string;
    isShowRadioReadWrite?: boolean;
    isShowRadioRead?: boolean;
    isShowRadioNoPermission?: boolean;
    children?: {
      name: string;
      label: string;
    }[];
    groupByPermission?: {
      readAndWrite: {
        id: string;
        name: string;
        route: string;
        data: any;
      }[];
      read: {
        id: string;
        name: string;
        route: string;
        data: any;
      }[];
    };
  }[];
}

export type ROLE_TYPE = "READ_AND_WRITE" | "READ" | "NO_PERMISSION";

export const ROLE_OPTION: { [key in ROLE_TYPE]: ROLE_TYPE } = {
  READ_AND_WRITE: "READ_AND_WRITE",
  READ: "READ",
  NO_PERMISSION: "NO_PERMISSION",
};

export enum ROLE_TAB {
  ROOT = "root",
  SKYCOM_TABLE = "skycomtable",
  LEAD = "lead-online",
  CDP = "cdp",
  FACEBOOK = "facebook",
  GOOGLE = "google",
  DASHBOARD = "dashboard",
  MKT_DASHBOARD = "mkt-dashboard",
  SALE_DASHBOARD = "sale-dashboard",
  SALE_ONLINE_REPORT = "sale-online-report",
  ZALO = "zalo",
  SETTINGS = "settings",
  PRODUCT = "product",
  CSKH = "cskh",
  TRANSPORTATION = "transportation",
  WAREHOUSE = "warehouse",
  ORDERS = "orders",
  PROMOTION = "promotions",
  CONTENT_ID = "content-id",
  CONTENT_DAILY = "content-daily",
  SHIPPING = "shipping",
  MANAGE_FILE = "manage-file",
  ATTRIBUTE = "attribute",
  REPORT_REVENUE = "report-revenue",
  PROFILE = "profile",
  ACCOUNTANT = "accountant",
  GENERAL = "general",
  SUPPORT = "support",
  DATA_FLOW = "data-flow",
}

export enum STATUS_ROLE_DATA_FLOW {
  LIST = "list",
  HANDLE = "handle",
  ACCOUNT = "account",
}

export enum STATUS_ROLE_SKYCOM_TABLE {
  HANDLE = "handle",
  CREATE = "create",
  DELETE = "delete",
}

export enum STATUS_ROLE_ACCOUNTANT {
  REPORT_ORDER = "report_order",
  DATA_COLLATION = "data_collation",
}

export enum STATUS_ROLE_LEAD {
  HANDLE_BY = "handle_by",
  REPORT_DAILY_HANDLE_BY = "report_daily_handle_by",
  IMPORT_LEAD_EXCEL = "import_lead_excel",
  DATA_STATUS = "data_status",
  ACCOUNTS = "accounts",
  STATUS = "status",
  VOIP = "voip",
  REPORT = "report",
  ADD_LEAD = "add_lead",
  SPAM_CHECK = "spam_check",
  REPORT_CRM = "report_crm",
}

export enum STATUS_ROLE_ORDERS {
  HANDLE = "handle",
  SHIPPING = "shipping",
  PRINT = "print",
  CANCEL = "cancel",
  CONFIRM = "confirm",
  PAYMENT = "payment",
  REPORT = "report",
  REPORT_DETAIL = "report-detail",
  UPLOAD_PAYMENT_CHECK = "upload-payment-check",
}

export enum STATUS_ROLE_TRANSPORTATION {
  LATE_DELIVERY = "late_delivery",
  STATUS = "status",
  RETURNING = "tracking_returning",
  WFD = "wfd",
  ATTRIBUTES = "attributes",
  REPORT_ASSIGNED = "report-assigned",
  ADD_HANDLE_BY = "ADD_HANDLE_BY",
  NEW = "new",
  PENDING = "pending",
  PROCESSING = "processing",
  HANDLED = "handled",
  COMPLETED = "completed",
  ALL = "all",
  ATTRIBUTE = "attribute",
}

export enum STATUS_ROLE_CDP {
  ADD = "add",
  CUSTOMER_CARE_STAFF = "customer-care-staff",
  HANDLE = "handle",
  USERS = "users",
  EXTERNAL_USERS = "external-users",
  ATTRIBUTES = "attributes",
  PHONE = "phone",
  REPORTS = "reports",
  LIST = "list",
  DETAIL = "detail",
}

export enum STATUS_ROLE_ATTRIBUTE {
  LEADS = "leads",
  TRANSPORTATION = "transportation",
  CDP = "cdp",
  ORDER = "order",
  SHIPPING = "shipping",
  PRODUCT = "product",
  WAREHOUSE = "warehouse",
  AIRTABLE = "airtable",
  MANAGE_FILE = "manage_file",
  SETTING = "setting",
  DATA_FLOW = "data_flow",
}

export enum STATUS_ROLE_DASHBOARD {
  DASHBOARD = "dashboard",
  MKT_DASHBOARD = "mkt-dashboard",
  SALE_DASHBOARD = "sale-dashboard",
  SALE_ONLINE_REPORT = "sale-online-report",
}

export enum STATUS_ROLE_ZALO {
  DASHBOARD = "dashboard",
  FOLLOWER_ACCOUNT = "follower-account",
  NOTIFICATION = "notification",
}

export enum STATUS_ROLE_SHIPPING {
  ALL = "all",
  PICKING = "picking",
  DELIVERING = "delivering",
  RETURNING = "returning",
  DELIVERED = "delivered",
  RETURNED = "returned",
  SUCCESS = "success",
  LOST = "lost",
  CANCELLED = "cancelled",
  WAIT_DELIVERY = "wait-delivery",
  WAITING_FOR_DELIVERY = "waiting_for_delivery",
  ATTRIBUTES = "attributes",
  REPORT = "report-shipping",
  COMPLETED = "completed",
}

export enum STATUS_ROLE_REPORT_REVENUE {
  BY_DATE = "by-date",
  BY_CHANNEL = "by-channel",
  BY_PRODUCT = "by-product",
  BY_PROVINCE = "by-province",
  BY_CREATED_BY = "by-created-by",
}

export enum STATUS_ROLE_AIRTABLE {
  CSKH = "cskh",
  NEW = "new",
  COMPLETED = "completed",
  HANDLING = "handling",
  ALL = "all",
}

export enum STATUS_ROLE_MANAGE_FILE {
  MANAGE = "manage",
  GROUP = "group",
}

export enum STATUS_ROLE_FACEBOOK {
  AD_FACEBOOK = "ad-facebook",
  AD_FANPAGE = "ad-fanpage",
  REPORT_AD_FACEBOOK = "report-ad-facebook",
  REPORT_AD_FANPAGE = "report-ad-fanpage",
}

export enum STATUS_ROLE_GOOGLE {
  CUSTOMER_ACCOUNT = "customer-account",
  CAMPAIGN_GOOGLE = "campaign-google",
  ADGROUP_GOOGLE = "adgroup-google",
  AD_GOOGLE = "ad-google",
}

export enum STATUS_ROLE_CONTENT_ID {
  ATTACH_PHONE = "attach-phone",
  TOTAL = "total",
  PIVOT = "pivot",
  FACEBOOK = "facebook",
  GOOGLE = "google",
  TIKTOK = "tiktok",
  PHONE_LEAD = "phone_lead",
  ATTRIBUTES = "attributes",
  TOTAL_BY_CONTENT_ID = "total_by_content_id",
  TOTAL_BY_PRODUCT = "total_by_product",
  FACEBOOK_BY_CONTENT_ID = "facebook_by_content_id",
  FACEBOOK_BY_CAMPAIGN = "facebook_by_campaign",
  GOOGLE_BY_CONTENT_ID = "google_by_content_id",
  GOOGLE_BY_CAMPAIGN = "google_by_campaign",
  TIKTOK_BY_CONTENT_ID = "tiktok_by_content_id",
  TIKTOK_BY_CAMPAIGN = "tiktok_by_campaign",
}

export enum STATUS_ROLE_CONTENT_DAILY {
  FACEBOOK = "facebook",
  OVERVIEW = "overview",
  PIVOT = "pivot",
  OVERVIEW_BY_CONTENT_DAILY = "overview_by_content_daily",
  OVERVIEW_BY_CAMPAIGN = "overview_by_campaign",
}

export enum STATUS_ROLE_SETTINGS {
  SKYLINK_ACCOUNT = "skylink-account",
  FACEBOOK_ACCOUNT = "facebook-account",
  AD_FACEBOOK_ACCOUNT = "ad-facebook-account",
  FANPAGE_ACCOUNT = "fanpage-account",
  GOOGLE_ACCOUNT_BM = "google-account_bm",
  CUSTOMER_ACCOUNT = "google-account_ct",
  TIKTOK_ACCOUNT = "tiktok-account",
  TIKTOK_ADS_ACCOUNT = "tiktok-ads-account",
  TIKTOK_BM_ACCOUNT = "tiktok-bm-account",
  LAZADA_ACCOUNT = "lazada-account",
  TIKI_ACCOUNT = "tiki-account",
  SHOPEE_ACCOUNT = "shopee-account",
  ZALO_ACCOUNT = "zalo-account",
  CDP_CARD = "cdp-card",
  ROLE = "role",
  ATTRIBUTE = "attribute",
}

export enum GENERAL_ROLES {
  EXPORT_EXCEL = "export-export",
}

export enum STATUS_ROLE_PRODUCT {
  LIST_PRODUCT = "list-product",
  CREATE_PRODUCT = "create-product",
  MAP_ECOMMERCE = "map-ecommerce",
  VARIANT = "variant",
}

export enum STATUS_ROLE_LIST_PRODUCT {
  ALL = "all",
  SINGLE = "simple",
  COMBO = "bundle",
}

export enum STATUS_ROLE_ECOMMERCE {
  ALL = "all",
  LAZADA = "lazada",
  TIKTOK = "tik-tok",
  SHOPEE = "shopee",
  TIKI = "tiki",
}

export enum STATUS_ROLE_WAREHOUSE {
  IMPORTS = "imports",
  LIST_WAREHOUSE = "list-warehouse",
  EXPORTS = "exports",
  TRANSFER = "transfer",
  STOCKTAKING = "stocktaking",
  ATTRIBUTES = "attributes",
  SCAN_EXPORT = "scan-export",
  REPORT_INVENTORY = "report-inventory",
  REPORT_INVENTORY_ACTIVITIES = "report-inventory-activities",
  SCAN_LOGS = "scan-logs",
  WAREHOUSE_LOGS = "warehouse-logs",
  SHEET = "sheet",
}

export enum STATUS_ROLE_STOCK_MANAGEMENT {
  WAREHOUSES = "warehouse",
  SUPPLIERS = "suppliers",
  PURCHASE_ORDER = "purchase_order",
}

export enum PROMOTION_ROLES {
  STATUS = "status",
  HANDLE = "handle",
  LIST = "list",
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive",
  DEACTIVED = "deactived",
}
