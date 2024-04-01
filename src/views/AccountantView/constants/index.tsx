import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ROLE_TAB } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";
import { ACCOUNTANT_PATH, PATH_DASHBOARD } from "routes/paths";
import { dateRule } from "utils/formValidation";
import { ORDER_PAYMENT_TYPE } from "views/OrderView/constants";

export const paramsDefault = {
  created_dateValue: -1,
  created_from: format(startOfMonth(new Date()), yyyy_MM_dd),
  created_to: format(new Date(), yyyy_MM_dd),
  completed_time_dateValue: -1,
  completed_time_from: format(startOfMonth(new Date()), yyyy_MM_dd),
  completed_time_to: format(new Date(), yyyy_MM_dd),
};

// Format value

export const arrAttachUnitVnd = [
  "fee_delivery",
  "fee_additional",
  "discount_promotion",
  "discount_input",
  "total_variant_all",
  "total_variant_actual",
  "total_actual",
  "payment_cod",
  "payment_cash",
  "payment_direct_transfer",
  "line_items__total",
  "line_items__variant_total",
];
export const arrColumnHandleLink = ["order_key"];
export const arrDate = [
  "tracking_created_at",
  "created",
  "exported_date",
  "imported_date",
  "payment_direct_transfer_date",
  "payment_cash_date",
  "payment_cod_date",
  "payment_cod_confirm_date",
  "shipping__modified",
  "shipping__finish_date",
];
export const arrDateTime = ["completed_time", "created", "printed_at", "shipping__created"];
export const arrColumnPhone = ["customer_phone"];
export const arrColumnEditLabel = [
  "exported",
  "imported",
  "status",
  "is_printed",
  "shipping__carrier_status",
  "tags__name",
  "source__name",
  "shipping__delivery_company_name",
];
export const arrValueTitle = ["line_items__variant__name", "customer_name"];

export const TAB_HEADER_REPORT_ORDER_DETAIL = (roles: any) => [
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.REPORT][ACCOUNTANT_PATH.REPORT_ORDER]
    }`,
    label: "Báo cáo tổng quan đơn hàng",
    roles: true,
    icon: <ManageHistoryIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.REPORT][ACCOUNTANT_PATH.REPORT_ORDER_ITEM]
    }`,
    label: "Báo cáo chi tiết đơn hàng",
    roles: true,
    icon: <CheckCircleOutlineIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.REPORT][ACCOUNTANT_PATH.REPORT_KPI]
    }`,
    label: "Báo cáo KPI",
    roles: true,
    icon: <AssignmentTurnedInIcon />,
  },
];

export const COLLATION_TABS = [
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.COLLATION][
        ACCOUNTANT_PATH.COLLATION_PAYMENT
      ]
    }`,
    label: "Đối soát thanh toán",
    roles: true,
    icon: <AccountBalanceWalletIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.ACCOUNTANT][ACCOUNTANT_PATH.COLLATION][
        ACCOUNTANT_PATH.IMPORT_EXCEL_HISTORY
      ]
    }`,
    label: "Lịch sử Upload file",
    roles: true,
    icon: <UploadFileIcon />,
  },
];

export const IMPORT_PAYMENT_FROM_EXCEL_COLUMNS = {
  OrderKey: "Mã đơn",
  Amount: "Số tiền nhận",
  ReceivedDate: "Ngày nhận",
  ShippingUnit: "Đơn vị vận chuyển",
  PaymentMethod: "Phương thức thanh toán",
  TransactionCode: "Mã thanh toán",
  Images: "Hình ảnh",
};

export const VALIDATION_IMPORT_PAYMENT_RULES = {
  OrderKey: {
    isValid: (value: string | number) => value?.toString().trim().length > 0,
    errorText: (value: string) => "Vui lòng nhập mã đơn hàng",
  },
  Amount: {
    isValid: (value: string) => (parseInt(value) >= 0 ? true : false),
    errorText: (value: string) => "Vui lòng nhập số tiền thanh toán",
  },
  ReceivedDate: dateRule,
  ShippingUnit: {
    isValid: (value: string | number) => value?.toString().trim().length > 0,
    errorText: (value: string) => "Vui lòng nhập đơn vị giao hàng",
  },
  PaymentMethod: {
    isValid: (value: string | number) =>
      value?.toString().trim().length > 0 &&
      Object.keys(ORDER_PAYMENT_TYPE).includes(value.toString() || ""),
    errorText: (value: string) => "Vui lòng nhập phương thức thanh toán",
  },
};

export const IMPORT_EXCEL_TEMPLATE = {
  defaultData: [
    {
      "Mã đơn": "",
      "Số tiền nhận": "",
      "Ngày nhận": "",
      "Đơn vị vận chuyển": "",
      "Phương thức thanh toán": "",
      "Mã thanh toán": "",
      // "Hình ảnh": "",
    },
  ],
  fileName: "File_mau_import_payment",
};
