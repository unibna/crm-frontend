// routes
import useAuth from "hooks/useAuth";
import useGetTable from "hooks/useGetTable";
import map from "lodash/map";

// components
import options2Fill from "@iconify/icons-eva/options-2-fill";
import { Icon } from "@iconify/react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalculateIcon from "@mui/icons-material/Calculate";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CasinoIcon from "@mui/icons-material/Casino";
import CategoryIcon from "@mui/icons-material/Category";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DiscountIcon from "@mui/icons-material/Discount";
import FacebookIcon from "@mui/icons-material/Facebook";
import FolderIcon from "@mui/icons-material/Folder";
import GoogleIcon from "@mui/icons-material/Google";
import GridViewIcon from "@mui/icons-material/GridView";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ThreePIcon from "@mui/icons-material/ThreeP";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import { NavListProps } from "_types_/NavSectionType";
import {
  ROLE_TAB,
  ROLE_TYPE,
  STATUS_ROLE_CDP,
  STATUS_ROLE_DASHBOARD,
  STATUS_ROLE_DATA_FLOW,
  STATUS_ROLE_FACEBOOK,
  STATUS_ROLE_GOOGLE,
  STATUS_ROLE_LEAD,
  STATUS_ROLE_PRODUCT,
  STATUS_ROLE_SETTINGS,
  STATUS_ROLE_SHIPPING,
  STATUS_ROLE_SKYCOM_TABLE,
  STATUS_ROLE_TRANSPORTATION,
  STATUS_ROLE_WAREHOUSE,
  STATUS_ROLE_ZALO,
} from "constants/rolesTab";
import { PATH_DASHBOARD, ORDER_PATH, PHONE_LEAD_PATH, ROOT, ACCOUNTANT_PATH } from "routes/paths";
import { isMatchRoles } from "utils/roleUtils";
import { UserType } from "_types_/UserType";
import { TITLE_PAGE } from "constants/index";

// ----------------------------------------------------------------------

export const THEME_TITLE = "Theme";
export interface SidebarItemType {
  subheader: string;
  items: NavListProps[];
}

const SidebarConfig = ({
  pathname,
  handleShowThemeModal,
  roles,
  userGroupId,
}: {
  pathname: string;
  userGroupId: string;
  handleShowThemeModal: () => void;
  roles?: { [key in ROLE_TAB]?: { [key: string]: ROLE_TYPE } };
}): SidebarItemType[] => {
  const { user } = useAuth();
  const { tables } = useGetTable({ roles, userGroupId, user });

  return [
    {
      subheader: "General",
      items: [
        {
          title: "Dashboard",
          path: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.DASHBOARD],
          icon: <DashboardIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            roles?.[ROLE_TAB.DASHBOARD]?.[STATUS_ROLE_DASHBOARD.DASHBOARD]
          ),
          code: "dashboard",
        },
        {
          title: "Dashboard MKT",
          path: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.MKT_DASHBOARD],
          icon: <GridViewIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            roles?.[ROLE_TAB.DASHBOARD]?.[STATUS_ROLE_DASHBOARD.MKT_DASHBOARD]
          ),
          code: "dashboard-mkt",
        },
        {
          title: "Dashboard Sale",
          path: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.SALE_DASHBOARD],
          icon: <LeaderboardIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            roles?.[ROLE_TAB.DASHBOARD]?.[STATUS_ROLE_DASHBOARD.SALE_DASHBOARD]
          ),
          code: "dashboard-sale",
        },
        {
          title: TITLE_PAGE.SETTING,
          path: PATH_DASHBOARD[ROLE_TAB.SETTINGS][ROOT],
          icon: <SettingsIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            map(
              Object.values(STATUS_ROLE_SETTINGS),
              (item: string) => roles?.[ROLE_TAB.SETTINGS]?.[item]
            )
          ),
          code: "setting",
        },
      ],
    },
    {
      subheader: "Marketing",
      items: [
        {
          title: "Content Ads",
          path: PATH_DASHBOARD[ROLE_TAB.CONTENT_ID][ROOT],
          icon: <ContentPasteIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CONTENT_ID]),
          code: "content-id",
        },
        {
          title: "Content Daily",
          path: PATH_DASHBOARD[ROLE_TAB.CONTENT_DAILY][ROOT],
          icon: <CalendarTodayIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CONTENT_DAILY]),
          code: "content-daily",
        },
        {
          title: "Facebook",
          path: PATH_DASHBOARD[ROLE_TAB.FACEBOOK][ROOT],
          icon: <FacebookIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            map(
              Object.values(STATUS_ROLE_FACEBOOK),
              (item: string) => roles?.[ROLE_TAB.FACEBOOK]?.[item]
            )
          ),
          children: [
            {
              title: "Facebook Ads Info",
              path: PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.AD_FACEBOOK],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.FACEBOOK]?.[STATUS_ROLE_FACEBOOK.AD_FACEBOOK]
              ),
              code: "fb-ads",
            },
            {
              title: "Fanpage Ads Info",
              path: PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.AD_FANPAGE],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.FACEBOOK]?.[STATUS_ROLE_FACEBOOK.AD_FANPAGE]
              ),
              code: "fb-fanpage-ads",
            },
            {
              title: "Report Facebook Ads",
              path: PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.REPORT_AD_FACEBOOK],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.FACEBOOK]?.[STATUS_ROLE_FACEBOOK.REPORT_AD_FACEBOOK]
              ),
              code: "fb-report-ads",
            },
            {
              title: "Report Fanpage Ads",
              path: PATH_DASHBOARD[ROLE_TAB.FACEBOOK][STATUS_ROLE_FACEBOOK.REPORT_AD_FANPAGE],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.FACEBOOK]?.[STATUS_ROLE_FACEBOOK.REPORT_AD_FANPAGE]
              ),
              code: "fb-report-fanpage-ads",
            },
          ],
        },
        {
          title: "Google",
          path: PATH_DASHBOARD[ROLE_TAB.GOOGLE][ROOT],
          icon: <GoogleIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            map(
              Object.values(STATUS_ROLE_GOOGLE),
              (item: string) => roles?.[ROLE_TAB.GOOGLE]?.[item]
            )
          ),
          code: "google",
        },
      ],
    },
    {
      subheader: "Management",
      items: [
        {
          title: TITLE_PAGE.LEAD,
          path: PATH_DASHBOARD[ROLE_TAB.LEAD][ROOT],
          icon: <ContactPhoneIcon />,
          roles:
            isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]) ||
            isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]) ||
            isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[PHONE_LEAD_PATH.VOIP]),
          children: [
            {
              title: "Trạng thái",
              path: PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]
              ),
              code: "lead-status",
            },
            {
              title: "Cuộc gọi",
              path: PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.VOIP][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]
              ),
              code: "lead-status",
            },
            {
              title: "Báo cáo",
              path: PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]
              ),
              code: "lead-report",
            },
            {
              title: "Spam check",
              path: PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.SPAM_CHECK][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.SPAM_CHECK]
              ),
              code: "spam-check",
            },
          ],
        },
        {
          title: "Sale Online Report",
          path: PATH_DASHBOARD[STATUS_ROLE_DASHBOARD.SALE_ONLINE_REPORT],
          icon: <AssessmentIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            roles?.[ROLE_TAB.SALE_ONLINE_REPORT]?.[STATUS_ROLE_DASHBOARD.SALE_ONLINE_REPORT]
          ),
          code: "sale-online-report",
        },
        {
          title: "Zalo",
          path: PATH_DASHBOARD[ROLE_TAB.ZALO][ROOT],
          icon: <CasinoIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            map(Object.values(STATUS_ROLE_ZALO), (item: string) => roles?.[ROLE_TAB.ZALO]?.[item])
          ),
          children: [
            {
              title: "Tổng thể",
              path: PATH_DASHBOARD[ROLE_TAB.ZALO][STATUS_ROLE_ZALO.DASHBOARD],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.ZALO]?.[STATUS_ROLE_ZALO.DASHBOARD]
              ),
              code: "zalo-general",
            },
            {
              title: "Tài khoản quan tâm",
              path: PATH_DASHBOARD[ROLE_TAB.ZALO][STATUS_ROLE_ZALO.FOLLOWER_ACCOUNT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.ZALO]?.[STATUS_ROLE_ZALO.FOLLOWER_ACCOUNT]
              ),
              code: "zalo-follower",
            },
            {
              title: "Thông báo",
              path: PATH_DASHBOARD[ROLE_TAB.ZALO][STATUS_ROLE_ZALO.NOTIFICATION],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.ZALO]?.[STATUS_ROLE_ZALO.NOTIFICATION]
              ),
              code: "zalo-notification",
            },
          ],
        },
        {
          title: TITLE_PAGE.TRANSPORTATION,
          path: PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][ROOT],
          icon: <SupportAgentIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.TRANSPORTATION]),
          code: "transportation",
          children: [
            {
              title: TITLE_PAGE.TRANSPORTATION,
              path: PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
                ROOT
              ],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
              ),
              code: "transportation-status",
            },
            {
              title: TITLE_PAGE.REPORT_TRANSPORTATION,
              path: PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][
                STATUS_ROLE_TRANSPORTATION.REPORT_ASSIGNED
              ],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.REPORT_ASSIGNED]
              ),
              code: "report-assigned",
            },
          ],
        },
        {
          title: TITLE_PAGE.CDP,
          path: PATH_DASHBOARD[ROLE_TAB.CDP][ROOT],
          icon: <ContactMailIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CDP]),
          children: [
            {
              title: TITLE_PAGE.CDP_USER,
              path: PATH_DASHBOARD[ROLE_TAB.CDP][STATUS_ROLE_CDP.USERS][ROOT],
              roles: isMatchRoles(user?.is_superuser, [
                roles?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.USERS],
                roles?.[ROLE_TAB.CDP]?.[STATUS_ROLE_CDP.REPORTS],
              ]),
              code: "cdp-user",
            },
          ],
        },
        {
          title: TITLE_PAGE.ORDER,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ORDERS]),
          path: PATH_DASHBOARD[ROLE_TAB.ORDERS][ORDER_PATH.LIST][ROOT],
          icon: <ReceiptIcon />,
          children: [
            {
              title: TITLE_PAGE.ORDER_STATUS,
              roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ORDERS]),
              path: PATH_DASHBOARD[ROLE_TAB.ORDERS][ROOT],
              code: "order-status",
            },
            {
              title: "Báo cáo doanh số",
              path: PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][ROOT],
              roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.REPORT_REVENUE]),
              code: "order-report",
            },
          ],
        },
        {
          title: TITLE_PAGE.SHIPPING,
          path: PATH_DASHBOARD[ROLE_TAB.SHIPPING][ROOT],
          icon: <LocalShippingIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            map(
              Object.values(STATUS_ROLE_SHIPPING),
              (item: string) => roles?.[ROLE_TAB.SHIPPING]?.[item]
            )
          ),
          children: [
            {
              title: TITLE_PAGE.SHIPPING_STATUS,
              roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.SHIPPING]),
              path: PATH_DASHBOARD[ROLE_TAB.SHIPPING][ROOT],
              code: "shipping-status",
            },
            {
              title: TITLE_PAGE["report-shipping"],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.REPORT]
              ),
              path: `${STATUS_ROLE_SHIPPING.REPORT}`,
              code: "shipping-report",
            },
          ],
        },
        {
          title: "Sản phẩm",
          path: PATH_DASHBOARD[ROLE_TAB.PRODUCT][ROOT],
          icon: <CategoryIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.PRODUCT]),
          code: "product",
          children: [
            {
              title: "Danh sách",
              path: PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.LIST_PRODUCT][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
              ),
              code: "list-product",
            },
            {
              title: "TMDT",
              path: PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.MAP_ECOMMERCE][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
              ),
              code: "map-ecommerce",
            },
          ],
        },
        {
          title: "Kế toán",
          path: PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ROOT],
          icon: <CalculateIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ACCOUNTANT]),
          code: "accountant",
          children: [
            {
              title: "Báo cáo",
              path: PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.REPORT][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.ACCOUNTANT]?.[ACCOUNTANT_PATH.REPORT]
              ),
              code: "report",
            },
            {
              title: "Đối soát",
              path: PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.COLLATION][ROOT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.ACCOUNTANT]?.[ACCOUNTANT_PATH.COLLATION]
              ),
              code: "collation",
            },
          ],
        },
        {
          title: "Khuyến mãi",
          path: PATH_DASHBOARD[ROLE_TAB.PROMOTION][ROOT],
          icon: <DiscountIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.PROMOTION]),
          code: "promote",
        },
        {
          title: "Kho",
          path: PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][ROOT],
          icon: <WarehouseIcon />,
          roles: isMatchRoles(
            user?.is_superuser,
            map(
              Object.values(STATUS_ROLE_WAREHOUSE),
              (item: string) => roles?.[ROLE_TAB.WAREHOUSE]?.[item]
            )
          ),
          children: [
            {
              title: "Tổng quan",
              path: PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][ROOT],
              roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.WAREHOUSE]),
              code: "warehouse-general",
            },
            {
              title: "Quét mã xuất hàng",
              path: `${STATUS_ROLE_WAREHOUSE.SCAN_EXPORT}`,
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.SCAN_EXPORT]
              ),
              code: "warehouse-scan",
            },
            {
              title: "Báo cáo tồn kho",
              path: `${STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY}`,
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY]
              ),
              code: "warehouse-report",
            },
            {
              title: "Báo cáo kho",
              path: `${STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY_ACTIVITIES}`,
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.REPORT_INVENTORY_ACTIVITIES]
              ),
              code: "warehouse-activities-report",
            },
          ],
        },
        {
          title: "Chăm sóc khách hàng",
          path: PATH_DASHBOARD[ROLE_TAB.CSKH][ROOT],
          icon: <ThreePIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CSKH]),
          code: "customer-care",
        },
        {
          title: "Document Management",
          path: PATH_DASHBOARD[ROLE_TAB.MANAGE_FILE][ROOT],
          icon: <FolderIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.MANAGE_FILE]),
          code: "document",
        },
        {
          title: "SkyTable",
          path: PATH_DASHBOARD[ROLE_TAB.SKYCOM_TABLE][ROOT],
          icon: <ViewTimelineIcon />,
          roles: isMatchRoles(user?.is_superuser, [
            roles?.[ROLE_TAB.SKYCOM_TABLE]?.[STATUS_ROLE_SKYCOM_TABLE.HANDLE],
          ]),
          ...(tables.length > 0 && {
            children: tables,
          }),
        },
        {
          title: "Data Flow",
          path: PATH_DASHBOARD[ROLE_TAB.DATA_FLOW][ROOT],
          icon: <FolderIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.DATA_FLOW]),
          code: "data_flow",
          children: [
            {
              title: "Flow",
              path: PATH_DASHBOARD[ROLE_TAB.DATA_FLOW][STATUS_ROLE_DATA_FLOW.LIST],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.DATA_FLOW]?.[STATUS_ROLE_DATA_FLOW.LIST]
              ),
              code: "flow-list",
            },
            {
              title: "Tài khoản",
              path: PATH_DASHBOARD[ROLE_TAB.DATA_FLOW][STATUS_ROLE_DATA_FLOW.ACCOUNT],
              roles: isMatchRoles(
                user?.is_superuser,
                roles?.[ROLE_TAB.DATA_FLOW]?.[STATUS_ROLE_DATA_FLOW.ACCOUNT]
              ),
              code: "account-flow",
            },
          ],
        },
      ],
    },
    {
      subheader: "System",
      items: [
        {
          title: "Thuộc tính",
          path: PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][ROOT],
          icon: <ListAltIcon />,
          roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.ATTRIBUTE]),
          code: "attribute",
        },
        // {
        //   title: "Hướng dẫn & Trợ giúp",
        //   path: PATH_DASHBOARD[ROLE_TAB.SUPPORT][ROOT],
        //   icon: <TipsAndUpdatesIcon />,
        //   roles: true,
        //   code: 'support'
        // },
        {
          title: THEME_TITLE,
          path: pathname,
          onClick: handleShowThemeModal,
          icon: <Icon icon={options2Fill} width={25} height={25} />,
          roles: true,
          code: "theme",
        },
        // {
        //   title: "Media",
        //   path: PATH_DASHBOARD.system.media,
        //   icon: <PermMediaIcon />,
        //   roles: isMatchRoles(user?.is_superuser,[roles?.[ROLE_TAB.MEDIA]?.[STATUS_ROLE_MEDIA.HANDLE]]),
        // },
      ],
    },
  ];
};

export default SidebarConfig;
