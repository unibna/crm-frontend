import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";
import { ColumnShowDatagrid } from "_types_/FacebookType";
import { SummaryItem } from "@devexpress/dx-react-grid";
import { yyyy_MM_dd } from "constants/time";
import { ReportRevenueType } from "_types_/ReportRevenueType";
import { ROLE_TAB, STATUS_ROLE_REPORT_REVENUE } from "constants/rolesTab";

//icons
import TodayIcon from "@mui/icons-material/Today";
import StorefrontIcon from "@mui/icons-material/Storefront";
import InterestsIcon from "@mui/icons-material/Interests";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import FaceIcon from "@mui/icons-material/Face";
import { PATH_DASHBOARD } from "routes/paths";
import { isMatchRoles } from "utils/roleUtils";
import { UserType } from "_types_/UserType";
import vi from "locales/vi.json";

export const DIMENSION_VALUE = {
  [STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL]: "source_name",
  [STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY]: "created_by",
  [STATUS_ROLE_REPORT_REVENUE.BY_DATE]: "date",
  [STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT]: "product",
  [STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE]: "province",
};

export const KEY_FILTER_CHART = {
  [STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL]: "source_name",
  [STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY]: "created_by",
  [STATUS_ROLE_REPORT_REVENUE.BY_DATE]: "completed_date",
  [STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT]: "name",
  [STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE]: "province",
};

export const keyFilter = {
  ZALO_OA: "ZALO_OA",
  STATUS: "STATUS",
  TYPE: "TYPE",
  RECEIVED: "RECEIVED",
  DELIVERY_COMPANY: "DELIVERY_COMPANY",
  STATUS_COD: "STATUS_COD",
  SHIPPING_STATUS: "SHIPPING_STATUS",
  CHANNEL: "CHANNEL",
};

export enum ActionType {
  UPDATE_PARAMS = "UPDATE_PARAMS",
}

export const arrAttachUnitVndDefault = [
  "paid",
  "total_actual",
  "total_variant_all",
  "cost",
  "discount_promotion",
  "total_variant_actual",
  "aov",
  "fee_additional",
  "fee_delivery",
  "discount_input",
  "crm_revenue",
  "cross_sale_amount",
  "total",
  "variant_total",
  "discount",
];

export const arrColumnShowInfo = [
  "total_order",
  "cost",
  "discount_promotion",
  "total_variant_actual",
  "fee_additional",
  "fee_delivery",
  "discount_input",
  "paid",
  "total_actual",
  "total_variant_all",
  "aov",
  "completed_date",
  "source_name",
  "province",
  "created_by",
  "crm_revenue",
  "cross_sale_amount",
  "cross_sale_order",
  "variant_total",
  "total",
  "discount",
  "variant",
  "quantity",
];

export const arrParamsGetValue = [
  "completed_time_from",
  "completed_time_to",
  "source",
  "status",
  "created_from",
  "created_to",
  "created_by",
];

// Column
const columnShowReport: ColumnShowDatagrid<ReportRevenueType> = {
  columnWidths: [
    { width: 120, columnName: "total_order" },
    { width: 150, columnName: "cost" },
    { width: 150, columnName: "discount_promotion" },
    { width: 150, columnName: "total_variant_actual" },
    { width: 150, columnName: "fee_additional" },
    { width: 150, columnName: "fee_delivery" },
    { width: 150, columnName: "discount_input" },
    { width: 150, columnName: "paid" },
    { width: 150, columnName: "total_actual" },
    { width: 150, columnName: "total_variant_all" },
    { width: 150, columnName: "aov" },
    { width: 150, columnName: "completed_date" },
    { width: 150, columnName: "source_name" },
    { width: 150, columnName: "province" },
    { width: 260, columnName: "created_by" },
    { width: 150, columnName: "crm_revenue" },
    { width: 150, columnName: "cross_sale_amount" },
    { width: 150, columnName: "cross_sale_order" },

    // Report product
    { width: 400, columnName: "variant" },
    { width: 150, columnName: "quantity" },
    { width: 150, columnName: "variant_total" },
    { width: 150, columnName: "discount" },
    { width: 150, columnName: "total" },
    { width: 150, columnName: "c_inventory" },
    { width: 150, columnName: "avg_orders" },
    { width: 150, columnName: "eto_over" },
    { width: 150, columnName: "available_inventory" },
  ],
  columnsShowHeader: [
    { title: "Tổng đơn hàng", name: "total_order", isShow: true },
    { title: "Giá trị TB/đơn hàng", name: "aov", isShow: true },
    { title: "Doanh thu thực", name: "total_actual", isShow: true },
    { title: "Tổng tiền hàng (đã KM)", name: "total_variant_actual", isShow: true },
    { title: "Tổng tiền hàng (chưa KM)", name: "total_variant_all", isShow: true },
    { title: "Giảm giá khuyến mãi", name: "discount_promotion", isShow: true },
    { title: "Giảm giá tùy chỉnh", name: "discount_input", isShow: true },
    { title: "Phụ thu", name: "fee_additional", isShow: true },
    { title: "Phí vận chuyển", name: "fee_delivery", isShow: true },
    { title: "Đã thanh toán", name: "paid", isShow: true },
    { title: "Chưa thanh toán", name: "cost", isShow: true },
  ],
  columnShowTable: [
    {
      title: "Tổng đơn hàng",
      name: "total_order",
      column: "total_order",
      isShow: true,
      isShowTitle: false,
    },
    { title: "Giá trị TB/đơn hàng", name: "aov", column: "aov", isShow: true, isShowTitle: false },
    {
      title: "Doanh thu thực",
      name: "total_actual",
      column: "total_actual",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tổng tiền hàng (đã KM)",
      name: "total_variant_actual",
      column: "total_variant_actual",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tổng tiền hàng (chưa KM)",
      name: "total_variant_all",
      column: "total_variant_all",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Giảm giá khuyến mãi",
      name: "discount_promotion",
      column: "discount_promotion",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Giảm giá tùy chỉnh",
      name: "discount_input",
      column: "discount_input",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Phụ thu",
      name: "fee_additional",
      column: "fee_additional",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Phí vận chuyển",
      name: "fee_delivery",
      column: "fee_delivery",
      isShow: true,
      isShowTitle: false,
    },
    { title: "Đã thanh toán", name: "paid", column: "paid", isShow: true, isShowTitle: false },
    { title: "Chưa thanh toán", name: "cost", column: "cost", isShow: true, isShowTitle: false },
  ],
};

export const columnShowReportByDate: ColumnShowDatagrid<ReportRevenueType> = {
  columnWidths: columnShowReport.columnWidths,
  columnsShowHeader: [
    { title: "Ngày xác nhận", name: "completed_date", isShow: true },
    ...columnShowReport.columnsShowHeader,
  ],
  columnShowTable: [
    {
      title: "Ngày xác nhận",
      name: "completed_date",
      column: "completed_date",
      isShow: true,
      isShowTitle: false,
    },
    ...columnShowReport.columnShowTable,
  ],
};

export const columnShowReportByChannel: ColumnShowDatagrid<ReportRevenueType> = {
  columnWidths: columnShowReport.columnWidths,
  columnsShowHeader: [
    { title: "Kênh bán hàng", name: "source_name", isShow: true },
    ...columnShowReport.columnsShowHeader,
  ],
  columnShowTable: [
    {
      title: "Kênh bán hàng",
      name: "source_name",
      column: "source_name",
      isShow: true,
      isShowTitle: false,
    },
    ...columnShowReport.columnShowTable,
  ],
};

export const columnShowReportByProduct: ColumnShowDatagrid<ReportRevenueType> = {
  columnWidths: columnShowReport.columnWidths,
  columnsShowHeader: [
    { title: "Sản phẩm", name: "variant", isShow: true },
    { title: "Tổng tiền hàng (đã KM)", name: "total", isShow: true },
    { title: "Tổng tiền hàng (chưa KM)", name: "variant_total", isShow: true },
    { title: "Số lượng đã bán", name: "quantity", isShow: true },
    { title: "Giảm giá", name: "discount", isShow: true },
    { title: "Tồn thực tổng các kho", name: "c_inventory", isShow: true },
    { title: "Tồn khả dụng tổng các kho", name: "available_inventory", isShow: true },
    { title: "TB đơn/ngày(7 ngày)", name: "avg_orders", isShow: true },
    { title: "Ngày hết hàng dự kiến", name: "eto_over", isShow: true },
  ],
  columnShowTable: [
    {
      title: "Tên sản phẩm",
      name: "variant_name",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "SKU",
      name: "variant_SKU_code",
      column: "variant",
      isShow: true,
    },
    {
      title: "Tổng tiền hàng (đã KM)",
      name: "total",
      column: "total",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tổng tiền hàng (chưa KM)",
      name: "variant_total",
      column: "variant_total",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Số lượng đã bán",
      name: "quantity",
      column: "quantity",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Giảm giá",
      name: "discount",
      column: "discount",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tồn thực tổng các kho",
      name: "c_inventory",
      column: "c_inventory",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tồn khả dụng tổng các kho",
      name: "available_inventory",
      column: "available_inventory",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "TB đơn/ngày(7 ngày)",
      name: "avg_orders",
      column: "avg_orders",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Ngày hết hàng dự kiến",
      name: "eto_over",
      column: "eto_over",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const columnShowReportByProvince: ColumnShowDatagrid<ReportRevenueType> = {
  columnWidths: columnShowReport.columnWidths,
  columnsShowHeader: [
    { title: "Tỉnh", name: "province", isShow: true },
    ...columnShowReport.columnsShowHeader,
  ],
  columnShowTable: [
    {
      title: "Tỉnh",
      name: "province",
      column: "province",
      isShow: true,
      isShowTitle: false,
    },
    ...columnShowReport.columnShowTable,
  ],
};

export const columnShowReportByCreatedBy: ColumnShowDatagrid<ReportRevenueType> = {
  columnWidths: columnShowReport.columnWidths,
  columnsShowHeader: [
    { title: "Người bán", name: "created_by", isShow: true },
    ...columnShowReport.columnsShowHeader,
    { title: "Doanh thu CRM", name: "crm_revenue", isShow: true },
    { title: "Doanh thu Crossale", name: "cross_sale_amount", isShow: true },
    { title: "Đơn Crossale", name: "cross_sale_order", isShow: true },
  ],
  columnShowTable: [
    {
      title: "Người bán",
      name: "created_by_name",
      column: "created_by",
      isShow: true,
      isShowTitle: false,
    },
    ...columnShowReport.columnShowTable,
    {
      title: "Doanh thu CRM",
      name: "crm_revenue",
      column: "crm_revenue",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Doanh thu Crossale",
      name: "cross_sale_amount",
      column: "cross_sale_amount",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Đơn Crossale",
      name: "cross_sale_order",
      column: "cross_sale_order",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

// Summary
export const summaryColumnReportRevenue: SummaryItem[] = [
  { type: "sum", columnName: "total_order" },
  { type: "sum", columnName: "cost" },
  { type: "sum", columnName: "discount_promotion" },
  { type: "sum", columnName: "total_variant_actual" },
  { type: "sum", columnName: "fee_additional" },
  { type: "sum", columnName: "fee_delivery" },
  { type: "sum", columnName: "discount_input" },
  { type: "sum", columnName: "paid" },
  { type: "sum", columnName: "total_actual" },
  { type: "sum", columnName: "total_variant_all" },
  { type: "sum", columnName: "aov" },
  { type: "sum", columnName: "variant_total" },
  { type: "sum", columnName: "discount" },
  { type: "sum", columnName: "total" },
  { type: "sum", columnName: "quantity" },
  { type: "sum", columnName: "crm_revenue" },
  { type: "sum", columnName: "cross_sale_amount" },
  { type: "sum", columnName: "cross_sale_order" },
];

export const FILTER_CHART_REPORT_BY_DATE = [
  { label: "Tổng đơn hàng", value: "total_order" },
  { label: "Giá trị TB/đơn hàng", value: "aov" },
  { label: "Doanh thu thực", value: "total_actual" },
  { label: "Tổng tiền hàng (đã KM)", value: "total_variant_actual" },
  { label: "Tổng tiền hàng (chưa KM)", value: "total_variant_all" },
  { label: "Giảm giá khuyến mãi", value: "discount_promotion" },
  { label: "Giảm giá tùy chỉnh", value: "discount_input" },
  { label: "Phụ thu", value: "fee_additional" },
  { label: "Phí vận chuyển", value: "fee_delivery" },
  { label: "Đã thanh toán", value: "paid" },
  { label: "Chưa thanh toán", value: "cost" },
];

export const FILTER_CHART_REPORT_BY_PRODUCT = [
  { label: "Tổng tiền hàng (đã KM)", value: "total" },
  { label: "Tổng tiền hàng (chưa KM)", value: "variant_total" },
  { label: "Số lượng đã bán", value: "quantity" },
  { label: "Giảm giá", value: "discount" },
  { label: "Tồn thực tổng các kho", value: "c_inventory" },
  { label: "Tồn khả dụng tổng các kho", value: "available_inventory" },
  { label: "TB đơn/ngày(7 ngày)", value: "avg_orders" },
];

export const paramsDefault = {
  completed_time_dateValue: -1,
  completed_time_from: format(startOfMonth(new Date()), yyyy_MM_dd),
  completed_time_to: format(new Date(), yyyy_MM_dd),
};

export const TAB_HEADER_REPORT_REVENUE = (user: Partial<UserType> | null, roles: any) => [
  {
    label: vi.by_date,
    path: `/${PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][STATUS_ROLE_REPORT_REVENUE.BY_DATE]}`,
    icon: <TodayIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_DATE]
    ),
  },
  {
    label: vi.by_channel,
    path: `/${PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL]}`,
    icon: <StorefrontIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL]
    ),
  },
  {
    label: vi.by_product,
    path: `/${PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT]}`,
    icon: <InterestsIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT]
    ),
  },
  {
    label: vi.by_province,
    path: `/${PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE]}`,
    icon: <LocationCityIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE]
    ),
  },
  {
    label: vi.by_buyer,
    path: `/${PATH_DASHBOARD[ROLE_TAB.REPORT_REVENUE][STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY]}`,
    icon: <FaceIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.REPORT_REVENUE]?.[STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY]
    ),
  },
];
