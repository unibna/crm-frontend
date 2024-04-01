import { ROLE_TAB, STATUS_ROLE_ATTRIBUTE } from "constants/rolesTab";
import { PATH_DASHBOARD } from "routes/paths";
import { isMatchRoles } from "utils/roleUtils";

//icons
import SettingsIcon from "@mui/icons-material/Settings";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ThreePIcon from "@mui/icons-material/ThreeP";
import FolderIcon from "@mui/icons-material/Folder";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { UserType } from "_types_/UserType";

export const TAB_HEADER_ATTRIBUTE = (user: Partial<UserType> | null, roles: any) => [
  {
    label: "Cấu hình",
    icon: <SettingsIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.SETTING]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.SETTING]
    ),
  },
  {
    label: "Lead Center",
    icon: <ContactPhoneIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.LEADS]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.LEADS]
    ),
  },
  {
    label: "Chăm sóc vận đơn",
    icon: <SupportAgentIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.TRANSPORTATION]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.TRANSPORTATION]
    ),
  },
  {
    label: "CDP",
    icon: <ContactMailIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.CDP]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.CDP]
    ),
  },
  {
    label: "Đơn hàng",
    icon: <ReceiptIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.ORDER]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.ORDER]
    ),
  },
  {
    label: "Vận chuyển",
    icon: <LocalShippingIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.SHIPPING]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.SHIPPING]
    ),
  },
  {
    label: "Sản phẩm",
    icon: <CategoryIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.PRODUCT]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.PRODUCT]
    ),
  },
  {
    label: "Kho",
    icon: <WarehouseIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.WAREHOUSE]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.WAREHOUSE]
    ),
  },
  {
    label: "CSKH",
    icon: <ThreePIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.AIRTABLE]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.AIRTABLE]
    ),
  },
  {
    label: "Quản lý file",
    icon: <FolderIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.MANAGE_FILE]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.MANAGE_FILE]
    ),
  },
  // {
  //   label: "Data Flow",
  //   icon: <FolderIcon />,
  //   path: `/${PATH_DASHBOARD[ROLE_TAB.ATTRIBUTE][STATUS_ROLE_ATTRIBUTE.DATA_FLOW]}`,
  //   roles: isMatchRoles(user?.is_superuser,roles?.[ROLE_TAB.ATTRIBUTE]?.[STATUS_ROLE_ATTRIBUTE.DATA_FLOW]),
  // },
];
