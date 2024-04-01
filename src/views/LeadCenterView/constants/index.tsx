import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BallotIcon from "@mui/icons-material/Ballot";
import BugReportIcon from "@mui/icons-material/BugReport";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import GroupIcon from "@mui/icons-material/Group";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import PhoneForwardedIcon from "@mui/icons-material/PhoneForwarded";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import SettingsPhoneIcon from "@mui/icons-material/SettingsPhone";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { DateFilterType } from "_types_/FilterType";
import { LeadStatusType } from "_types_/PhoneLeadType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { UserType } from "_types_/UserType";
import { MultiSelectProps } from "components/Selectors/MultiSelect";
import { RouteType } from "components/Tabs/TabRouteWrap";
import { ROLE_TAB, ROLE_TYPE, STATUS_ROLE_LEAD } from "constants/rolesTab";
import { PATH_DASHBOARD, PHONE_LEAD_PATH } from "routes/paths";
import { phoneRule } from "utils/formValidation";
import { isMatchRoles } from "utils/roleUtils";

export const EDIT_HANDLE_BY_COLUMN = "edit_handle_by_column";
export const EDIT_LEAD_STATUS_COLUMN = "edit_lead_status_column";
export const EDIT_HANDLE_COLUMN = "handle";

export const LEAD_STATUS: { [key: string]: LeadStatusType } = {
  SPAM: "0",
  NEW: "1",
  WAITING: "2",
  HANDLING: "3",
  HAS_ORDER: "4",
  NO_ORDER: "5",
  NOT_QUALITY_DATA: "7",
};

export const LEAD_TABS = {
  SPAM: "spam",
  NEW: "new",
  WAITING: "waiting",
  HANDLING: "handling",
  HAS_ORDER: "has_order",
  NO_ORDER: "no_order",
  BAD_DATA: "bad_data",
};

export const LEAD_STATUS_DATA = {
  WRONG: "Sai",
  EXIST: "Trùng",
  SPAM: "Spam",
};

export const FINAL_LEAD_STATUS_OPTIONS = [
  { label: "Có mua", value: 4 },
  { label: "Không mua", value: 5 },
  // { label: "Dữ liệu không chất lượng", value: 7 },
];

export const BAD_DATA_OPTION = { label: "Dữ liệu không chất lượng", value: 7 };

export const FULL_LEAD_STATUS_OPTIONS = [
  { label: "Spam", value: "0" },
  { label: "Mới", value: "1" },
  { label: "Chờ xử lý", value: "2" },
  { label: "Đang xử lý", value: "3" },
  { label: "Có mua", value: "4" },
  { label: "Không mua", value: "5" },
  { label: "Dữ liệu không chất lượng", value: "7" },
];

export const PHONE_LEAD_DETAIL_HEADER_TAB = ["history", "phone_existed", "ip_existed"];

export const HANDLE_STATUS_OPTIONS: SelectOptionType[] = [
  { label: "Gọi lần 1", value: 1 },
  { label: "Gọi lần 2", value: 2 },
  { label: "Gọi lần 3", value: 3 },
  { label: "Gọi lần 4", value: 4 },
  { label: "Gọi lần 5", value: 5 },
  { label: "Gọi lần 6", value: 6 },
  { label: "Gọi lần 7", value: 7 },
  { label: "Gọi lần 8", value: 8 },
];

export const DATE_FILTER_COLOR: DateFilterType[] = [
  {
    title: "Ngày tạo",
    keyFilters: [
      { label: "created_from", color: "#91f7d3", title: "Ngày tạo từ" },
      { label: "created_to", color: "#91f7d3", title: "Ngày tạo đến" },
      { label: "dateValue" },
    ],
  },
  {
    title: "Chia số",
    keyFilters: [
      { label: "handler_assigned_from", color: "#f7b891", title: "Chia số từ ngày" },
      { label: "handler_assigned_to", color: "#f7b891", title: "Chia số đến ngày" },
      { label: "defaultHandlerAssignedDate" },
    ],
  },
  {
    title: "Xử lý",
    keyFilters: [
      { label: "process_done_from", color: "#f7b891", title: "Hoàn tất xử lý từ ngày" },
      { label: "process_done_to", color: "#f7b891", title: "Hoàn tất xử lý đến ngày" },
      { label: "defaultProcessDate" },
    ],
  },
  {
    title: "Gọi lại",
    keyFilters: [
      { label: "call_later_at_from", color: "#f7b891", title: "Gọi lại từ ngày" },
      { label: "call_later_at_to", color: "#f7b891", title: "Gọi lại đến ngày" },
      { label: "defaultCallLaterAtDate" },
    ],
  },
];

export const leadKeyFilter = [
  "lead_status",
  "handle_by",
  "channel",
  "product",
  "fanpage",
  "handle_status",
  "fail_reason",
  "data_status",
  "created_by",
  "bad_data_reason",
  "customer_id",
  "dimension",
  "skylink_status",
  "referring_site",
  "source_name",
  "handle_reason",
  "landing_page_domain",
  "tags",
];

export const EXPORT_DATA_TO_GMAIL_KEY: { [key in string]: string } = {
  name: "Tên khách hàng",
  phone: "SĐT khách hàng",
  note: "Ghi chú",
  created: "Ngày tạo",
  "created_by.name": "Người tạo",
  "handle_by.name": "Người nhận xử lý",
  handler_assigned_at: "Thời gian chia số",
  call_later_at: "Thời gian gọi lại",
  landing_page_url: "Trang SP",
  landing_page_domain: "URL SP",
  ip_address: "IP address",
  lead_status: "Trạng thái đơn",
  order_information: "Mã đơn",
  handle_status: "Trạng thái xử lý",
  "handle_reason.name": "Lý do xử lý",
  "channel.name": "Kênh bán hàng",
  "fanpage.name": "Fanpage",
  "product.name": "Sản phẩm/ chiến dịch",
  "fail_reason.name": "Lý do không mua",
  data_status: "Trạng thái dữ liệu",
  "bad_data_reason.name": "Lý do dữ liệu không chất lượng",
  "tags.name": "Thẻ",
};

export const IMPORT_EXCEL_PROPS_DEFAULT_INPUT_FORM: Partial<MultiSelectProps> = {
  required: true,
  outlined: true,
  simpleSelect: true,
  size: "medium",
  fullWidth: true,
};

export const IMPORT_EXCEL_FORM_COLUMN_ASSETS = {
  NAME: "Tên",
  PHONE: "SĐT",
  NOTE: "Ghi chú",
  CHANNEL: "Kênh bán hàng",
  PRODUCT: "Sản phẩm",
  FANPAGE: "Fanpage",
  ORDER_ID: "ID đơn hàng",
  AMOUNT_PAID: "Số tiền",
  BANKING_ACCOUNT: "TK nhận tiền 4 số cuối",
  PAYMENT_DATE: "Ngày nhận",
  PAYMENT_CODE: "Mã GD/ MÃ phiên chuyển tiền",
};

export const REPORT_KEYS = [
  "total",
  "pre_qualified",
  "post_qualified",
  "pre_not_qualified",
  "post_not_qualified",
  "processing",
  "processed",
  "buy",
  "not_buy",
  "buy_rate",
];

export const REPORT_VOIP_OPTIONS = [
  { name: "date", width: 130, value: "calldate", label: "Ngày gọi" },
  {
    name: "business_call_type__value",
    width: 150,
    value: "business_call_type__value",
    label: "Loại cuộc gọi",
  },
  { name: "telephonist", width: 180, value: "telephonist", label: "Người gọi" },
];

export const CUSTOMER_TYPE_OPTIONS: SelectOptionType[] = [
  { value: "true", label: "Khách hàng mới" },
  { value: "false", label: "Khách hàng cũ" },
];

export enum SPAM_TYPE {
  KEY_WORD = "Từ Khóa",
  PHONE = "SDT",
  IP = "IP",
}

export const columnsWidthSpamCheck = {
  [SPAM_TYPE.IP]: [
    { columnName: "data", width: 350 },
    { columnName: "operation", width: 100 },
  ],
  [SPAM_TYPE.KEY_WORD]: [
    { columnName: "data", width: 350 },
    { columnName: "operation", width: 100 },
  ],
  [SPAM_TYPE.PHONE]: [
    { columnName: "data", width: 350 },
    { columnName: "operation", width: 100 },
  ],
};

export const titlePopupHandleSpamCheck = {
  ADD_SPAM_ITEM: "Thêm mới spam",
  EDIT_SPAM_ITEM: "Chỉnh sửa nội dung spam",
};

export const STATUS_PHONE_LEAD_TABS = (user: Partial<UserType> | null, roles: any): RouteType[] => [
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.NEW]}`,
    label: "Mới",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <FiberNewIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.WAITING]}`,
    label: "Chờ xử lý",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <HourglassBottomIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.HANDLING]}`,
    label: "Đang xử lý",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <AssignmentTurnedInIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.NO_ORDER]}`,
    label: "Không mua",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <ProductionQuantityLimitsIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.ORDER]}`,
    label: "Có mua",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <AddShoppingCartIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.BAD_DATA]}`,
    label: "Ko chất lượng",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <ThumbDownAltIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.SPAM]}`,
    label: "Spam",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <BugReportIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.STATUS][PHONE_LEAD_PATH.ALL]}`,
    label: "Tất cả",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.STATUS]),
    icon: <BallotIcon />,
  },
];

export const REPORT_PHONE_LEAD_TABS = (user: Partial<UserType> | null, roles: any): RouteType[] => [
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][PHONE_LEAD_PATH.REPORT_V2]}`,
    label: "Báo cáo V2",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]),
    icon: <SummarizeIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][PHONE_LEAD_PATH.REPORT_V1]}`,
    label: "Báo cáo V1",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]),
    icon: <InsertDriveFileIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][
        PHONE_LEAD_PATH.REPORT_HANDLE_ITEM_BY_PRODUCT
      ]
    }`,
    label: "Báo cáo chia số",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]),
    icon: <AssignmentTurnedInIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][PHONE_LEAD_PATH.VOIP]}`,
    label: "Báo cáo cuộc gọi",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]),
    icon: <SettingsPhoneIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][PHONE_LEAD_PATH.REPORT_CRM]}`,
    label: "Báo cáo xử lý CRM",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.REPORT]),
    icon: <InsertDriveFileIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.REPORT][PHONE_LEAD_PATH.USER]}`,
    label: "Tài khoản",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.ACCOUNTS]),
    icon: <GroupIcon />,
  },
];

export const VOIP_TABS = (
  user: Partial<UserType> | null,
  roles?: {
    [key in ROLE_TAB]?: {
      [key: string]: ROLE_TYPE;
    };
  }
): RouteType[] => [
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.VOIP][PHONE_LEAD_PATH.VOIP_INBOUND]}`,
    label: "Cuộc gọi vào",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]),
    icon: <PhoneCallbackIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.VOIP][PHONE_LEAD_PATH.VOIP_OUTBOUND]}`,
    label: "Cuộc gọi ra",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]),
    icon: <PhoneForwardedIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.VOIP][PHONE_LEAD_PATH.VOIP_MISSED]}`,
    label: "Cuộc gọi nhỡ",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]),
    icon: <PhoneMissedIcon />,
  },
  {
    path: `/${PATH_DASHBOARD[ROLE_TAB.LEAD][PHONE_LEAD_PATH.VOIP][PHONE_LEAD_PATH.ALL]}`,
    label: "Tất cả",
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.LEAD]?.[STATUS_ROLE_LEAD.VOIP]),
    icon: <BallotIcon />,
  },
];

export const VALIDATION_IMPORT_LEAD_RULES = {
  phone: phoneRule,
  channel: {
    isValid: (value: string | number) => value?.toString().trim().length > 0,
    errorText: (value: string) => "Vui lòng nhập kênh bán hàng",
  },
  product: {
    isValid: (value: string | number) => value?.toString().trim().length > 0,
    errorText: (value: string) => "Vui lòng nhập sản phẩm",
  },
  fanpage: {
    isValid: (value: string | number) => value?.toString().trim().length > 0,
    errorText: (value: string) => "Vui lòng nhập Fanpage",
  },
  name: {
    isValid: (value: string | number) => value?.toString().trim().length > 0,
    errorText: (value: string) => "Vui lòng nhập tên khách hàng",
  },
};

export const EXTENSION_COLUMN_NAMES = [
  "customer_info",
  "handle_info",
  "lead_info",
  "product_info",
  "created_info",
  "validate_info",
  "assign_info",
  "ads_info",
];
