import { ORDER_PATH, PHONE_LEAD_PATH, ROOT_PATH } from "routes/paths";
import {
  STATUS_ROLE_CDP,
  STATUS_ROLE_DASHBOARD,
  STATUS_ROLE_ZALO,
  ROLE_TAB,
  STATUS_ROLE_CONTENT_ID,
  STATUS_ROLE_FACEBOOK,
  STATUS_ROLE_GOOGLE,
  STATUS_ROLE_SHIPPING,
  STATUS_ROLE_WAREHOUSE,
} from "constants/rolesTab";
import { path, PATH_DASHBOARD, ROOT } from "routes/paths";
import { SelectOptionType } from "_types_/SelectOptionType";
import vi from "locales/vi.json";

export const DIRECTION_ROUTE_OPTIONS: SelectOptionType[] = [
  { label: vi.dashboard, value: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.DASHBOARD] },
  { label: vi.dashboard_marketing, value: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.MKT_DASHBOARD] },
  { label: vi.dashboard_sale, value: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.SALE_DASHBOARD] },
  { label: vi.setting, value: PATH_DASHBOARD[ROLE_TAB.SETTINGS][ROOT] },
  {
    label: vi.content_id,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.CONTENT_ID][STATUS_ROLE_CONTENT_ID.TOTAL]),
  },
  {
    label: vi.content_id_mount_phone_number,
    value: path(
      ROOT_PATH,
      PATH_DASHBOARD[ROLE_TAB.CONTENT_ID][STATUS_ROLE_CONTENT_ID.ATTACH_PHONE]
    ),
  },
  {
    label: vi.facebook_ads_info,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.AD_FACEBOOK]),
  },
  {
    label: vi.facebook_fanpage_info,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.AD_FANPAGE]),
  },
  {
    label: vi.facebook_ads_report,
    value: path(
      ROOT_PATH,
      PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.REPORT_AD_FACEBOOK]
    ),
  },
  {
    label: vi.facebook_fanpage_report,
    value: path(
      ROOT_PATH,
      PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.REPORT_AD_FANPAGE]
    ),
  },
  {
    label: vi.google_campain,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.GOOGLE][STATUS_ROLE_GOOGLE.CAMPAIGN_GOOGLE]),
  },
  {
    label: vi.google_group_ads,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.GOOGLE][STATUS_ROLE_GOOGLE.ADGROUP_GOOGLE]),
  },
  {
    label: vi.google_ads,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.GOOGLE][STATUS_ROLE_GOOGLE.AD_GOOGLE]),
  },
  {
    label: vi.lead_center_status,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][ROOT]),
  },
  {
    label: vi.lead_center_report,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][ROOT]),
  },
  {
    label: vi.lead_center_attribute,
    value: path(
      ROOT_PATH,
      PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.ATTRIBUTE]
    ),
  },
  {
    label: vi.lead_center_account,
    value: path(
      ROOT_PATH,
      PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][PHONE_LEAD_PATH.USER]
    ),
  },
  {
    label: vi.sale_online_report,
    value: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.SALE_ONLINE_REPORT],
  },
  {
    label: vi.zalo_overview,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.ZALO][STATUS_ROLE_ZALO.DASHBOARD]),
  },
  {
    label: vi.zalo_account,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.ZALO][STATUS_ROLE_ZALO.FOLLOWER_ACCOUNT]),
  },
  {
    label: vi.zalo_notification,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.ZALO][STATUS_ROLE_ZALO.NOTIFICATION]),
  },
  {
    label: vi.transportation.transportation,
    value: PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][ROOT],
  },
  {
    label: vi.cdp_customer,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.CDP][STATUS_ROLE_CDP.USERS][ROOT]),
  },
  {
    label: vi.order_status,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ROOT]),
  },
  {
    label: vi.order_report_revenue,
    value: PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][ROOT],
  },
  {
    label: vi.shipping_status,
    value: PATH_DASHBOARD[ROLE_TAB.SHIPPING][ROOT],
  },
  {
    label: vi.shipping_report,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.REPORT]),
  },
  {
    label: vi.report_revenue,
    value: PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][ROOT],
  },
  {
    label: vi.customer_care,
    value: PATH_DASHBOARD[ROLE_TAB.CSKH][ROOT],
  },
  {
    label: vi.promotion.promotion,
    value: PATH_DASHBOARD[ROLE_TAB.PROMOTION][ROOT],
  },
  {
    label: vi.warehouse_overview,
    value: PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][ROOT],
  },
  {
    label: vi.warehouse_scan,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.SCAN_EXPORT]),
  },
  {
    label: vi.warehouse_report,
    value: path(
      ROOT_PATH,
      PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY]
    ),
  },
  {
    label: vi.skytable,
    value: path(ROOT_PATH, PATH_DASHBOARD[ROLE_TAB.SKYCOM_TABLE][ROOT]),
  },
  {
    label: vi.customer_care,
    value: PATH_DASHBOARD[ROLE_TAB.CSKH][ROOT],
  },
  {
    label: vi.document_management,
    value: PATH_DASHBOARD[ROLE_TAB.MANAGE_FILE][ROOT],
  },
];
