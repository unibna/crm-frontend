import {
  Column,
  GridColumnExtension,
  SummaryItem,
  TableColumnWidthInfo,
} from "@devexpress/dx-react-grid";
import { ColumnShow } from "_types_/FacebookType";
import { PhoneLogType } from "_types_/PhoneLeadType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { EDIT_HANDLE_BY_COLUMN, EDIT_LEAD_STATUS_COLUMN } from ".";
import reduce from "lodash/reduce";

export const LEAD_CENTER_COLUMNS = [
  { title: "Chọn người chia số", name: EDIT_HANDLE_BY_COLUMN },
  { title: "Tạo Lead", name: EDIT_LEAD_STATUS_COLUMN },
  { title: "Thông tin khách hàng", name: "customer_info" },
  { title: "Thông tin xử lý", name: "handle_info" },
  { title: "Trạng thái lead", name: "lead_info" },
  { title: "Thông tin tạo", name: "created_info" },
  { title: "Thông tin chia số", name: "assign_info" },
  { title: "Sản phẩm/ Chiến dịch", name: "product_info" },
  { title: "Thông tin khác", name: "validate_info" },
  { title: "Trạng thái dữ liệu", name: "data_status" },
  { title: "Ghi chú", name: "note" },
  { title: "Dữ liệu Ads", name: "ads_info" },
  { title: "Dữ liệu khác", name: "additional_data" },
];

export const LEAD_CENTER_COLUMNS_SHOW_SORT = [
  {
    name: "customer_info",
    fields: [
      { title: "Tên khách hàng", name: "name" },
      { title: "SĐT", name: "phone" },
      { title: "Loại khách hàng", name: "is_new_customer" },
      { title: "Ngày tạo Lead", name: "created" },
      { title: "Người tạo", name: "create_by" },
      { title: "TG chia số", name: "handler_assigned_at" },
    ],
  },
  {
    name: "handle_info",
    fields: [
      { name: "modified_by", title: "Người XL gần nhất" },
      { name: "handle_by", title: "Được chia số" },
      { name: "modified", title: "Thời gian XL gần nhất" },
      { name: "recent_handling", title: "Số phút xử lý" },
      { name: "call_later_at", title: "Ngày gọi lại" },
      { name: "handle_status", title: "Số lần gọi" },
      { name: "note", title: "Ghi chú" },
    ],
  },
  {
    name: "lead_info",
    fields: [
      { name: "lead_status", title: "Trạng thái lead" },
      { name: "order_information", title: "Mã đơn hàng" },
      { name: "bad_data_reason", title: "Lí do không chất lượng" },
      { name: "handle_reason", title: "Lí do xử lý" },
      { name: "fail_reason", title: "Lí do không mua" },
    ],
  },
  {
    name: "created_info",
    fields: [
      { name: "created", title: "Ngày tạo" },
      { name: "created_by", title: "Người tạo" },
    ],
  },
  {
    name: "assign_info",
    fields: [{ name: "handle_by", title: "Người nhận số" }],
  },
  {
    name: "product_info",
    fields: [
      { name: "product", title: "Tên sản phẩm" },
      { name: "channel", title: "Kênh bán hàng" },
      { name: "fanpage", title: "Fanpage" },
      { name: "landing_page_url", title: "Landing page URL" },
    ],
  },
  {
    name: "validate_info",
    fields: [
      { name: "is_duplicated_ip", fields: [], title: "Trùng IP" },
      { name: "is_existed", fields: [], title: "Trùng" },
      { name: "is_valid", fields: [], title: "Sai" },
      { name: "ip_address", fields: [], title: "IP" },
      { name: "os", fields: [], title: "OS" },
    ],
  },
];

export const LEAD_CENTER_SORT_FIELDS = {
  phone: "SĐT",
  is_new_customer: "Loại khách hàng",
  created: "Ngày tạo Lead",
  handler_assigned_at: "TG chia số",
  modified: "Thời gian XL gần nhất",
  recent_handling: "Số phút xử lý",
  call_later_at: "Ngày gọi lại",
  handle_status: "Số lần gọi",
  lead_status: "Trạng thái lead",
  order_information: "Mã đơn hàng",
  handle_by: "Người nhận số",
  is_duplicated_ip: "Trùng IP",
  is_existed: "Trùng",
  is_valid: "Sai",
};

export const LEAD_CENTER_COLUMNS_WIDTH = [
  { width: 160, columnName: "customer_info" },
  { width: 220, columnName: "handle_info" },
  { width: 150, columnName: "lead_info" },
  { width: 150, columnName: "created_info" },
  { width: 200, columnName: "product_info" },
  { width: 150, columnName: "assign_info" },
  { width: 200, columnName: "validate_info" },
  { width: 250, columnName: EDIT_HANDLE_BY_COLUMN },
  { width: 150, columnName: EDIT_LEAD_STATUS_COLUMN },
  { width: 250, columnName: "data_status" },
  { width: 150, columnName: "note" },
  { width: 200, columnName: "ads_info" },
  { width: 250, columnName: "additional_data" },
];

export const LEAD_CENTER_ORDER_COLUMNS = [
  EDIT_HANDLE_BY_COLUMN,
  EDIT_LEAD_STATUS_COLUMN,
  "customer_info",
  "product_info",
  "created_info",
  "handle_info",
  "assign_info",
  "lead_info",
  "note",
  "data_status",
  "validate_info",
  "ads_info",
  "additional_data",
];

export const LEAD_SORT_EXTENSIONS = [
  { columnName: "validate_info", sortingEnabled: false },
  { columnName: "data_status", sortingEnabled: false },
  { columnName: "note", sortingEnabled: false },
];

export const LEAD_CENTER_HIDE_COLUMNS = [];

export const IMPORT_COLUMNS = [
  { title: "Stt", name: "rowId" },
  { title: "Tên khách hàng", name: "name" },
  { title: "SĐT", name: "phone" },
  { title: "Ghi chú", name: "note" },
  { title: "Kênh bán hàng", name: "channel" },
  { title: "Sản phẩm", name: "product" },
  { title: "Fanpage", name: "fanpage" },
];

export const IMPORT_COLUMNS_WIDTH = [
  { width: 50, columnName: "rowId" },
  { width: 120, columnName: "name" },
  { width: 100, columnName: "phone" },
  { width: 150, columnName: "note" },
  { width: 200, columnName: "channel" },
  { width: 200, columnName: "product" },
  { width: 200, columnName: "fanpage" },
];

export const STATIC_HISTORY_COLUMNS: { title: string; name: keyof PhoneLogType }[] = [
  { title: "Ngày tạo Lead", name: "created" },
  { title: "Tên khách hàng", name: "name" },
  { title: "SĐT", name: "phone" },
  { title: "Ghi chú", name: "note" },
  { title: "Trạng thái đơn", name: "lead_status" },
  { title: "Mã ORDER", name: "order_information" },
  { title: "Loại thao tác", name: "history_type" },
  { title: "Trùng", name: "is_existed" },
  { title: "Sai", name: "is_valid" },
  { title: "Người tạo", name: "created_by" },
  { title: "Người được chia số", name: "handle_by" },
  { title: "Người xử lý gần nhất", name: "modified_by" },
  { title: "Ngày xử lý gần nhất", name: "modified" },
  { title: "Trạng thái dữ liệu", name: "data_status" },
  { title: "Số lần gọi", name: "handle_status" },
  { title: "Lý do xử lý", name: "handle_reason" },
  { title: "Lý do không mua", name: "fail_reason" },
  { title: "Lý do dữ liệu KCL", name: "bad_data_reason" },
  { title: "Số phút xử lý", name: "recent_handling" },
  { title: "Ngày gọi lại", name: "call_later_at" },
  { title: "Sản phẩm/ Chiến dịch", name: "product" },
  { title: "Trang sản phẩm", name: "landing_page_url" },
  { title: "Kênh bán hàng", name: "channel" },
  { title: "Fanpage", name: "fanpage" },
  { title: "Địa chỉ IP", name: "ip_address" },
  { title: "Người sửa", name: "history_user" },
  { title: "Hệ điều hành", name: "os" },
  { title: "Kênh Ads", name: "ad_channel" },
  { title: "Id Ads", name: "ad_id" },
  { title: "Content Ads Id", name: "ad_id_content" },
  { title: "Dữ liệu khác", name: "additional_data" },
];

export const STATIC_HISTORY_COLUMNS_WIDTH: { width: number; columnName: keyof PhoneLogType }[] = [
  { width: 120, columnName: "created" },
  { width: 150, columnName: "name" },
  { width: 110, columnName: "phone" },
  { width: 150, columnName: "note" },
  { width: 120, columnName: "lead_status" },
  { width: 100, columnName: "order_information" },
  { width: 100, columnName: "history_type" },
  { width: 100, columnName: "is_existed" },
  { width: 100, columnName: "is_valid" },
  { width: 120, columnName: "created_by" },
  { width: 120, columnName: "handle_by" },
  { width: 120, columnName: "modified_by" },
  { width: 100, columnName: "modified" },
  { width: 150, columnName: "data_status" },
  { width: 130, columnName: "handle_status" },
  { width: 150, columnName: "handle_reason" },
  { width: 150, columnName: "bad_data_reason" },
  { width: 130, columnName: "fail_reason" },
  { width: 100, columnName: "recent_handling" },
  { width: 100, columnName: "call_later_at" },
  { width: 180, columnName: "product" },
  { width: 180, columnName: "landing_page_url" },
  { width: 120, columnName: "channel" },
  { width: 120, columnName: "fanpage" },
  { width: 100, columnName: "ip_address" },
  { width: 120, columnName: "history_user" },
  { width: 100, columnName: "os" },
  { width: 100, columnName: "ad_channel" },
  { width: 100, columnName: "ad_id" },
  { width: 100, columnName: "ad_id_content" },
  { width: 100, columnName: "additional_data" },
];

export const UNSTATIC_HISTORY_COLUMNS: { title: string; name: keyof PhoneLogType }[] = [
  { title: "Ngày tạo Lead", name: "created" },
  { title: "Người tạo", name: "created_by" },
  { title: "Tên khách hàng", name: "name" },
  { title: "SĐT", name: "phone" },
  { title: "Ghi chú", name: "note" },
  { title: "Loại thao tác", name: "history_type" },
  { title: "Trùng", name: "is_existed" },
  { title: "Sai", name: "is_valid" },
  { title: "Người xử lý gần nhất", name: "modified_by" },
  { title: "Ngày xử lý gần nhất", name: "modified" },
  { title: "Trạng thái dữ liệu", name: "data_status" },
  { title: "Số lần gọi", name: "handle_status" },
  { title: "Lý do xử lý", name: "handle_reason" },
  { title: "Lý do không mua", name: "fail_reason" },
  { title: "Số phút xử lý", name: "recent_handling" },
  { title: "Ngày gọi lại", name: "call_later_at" },
  { title: "Sản phẩm/ Chiến dịch", name: "product" },
  { title: "Trang sản phẩm", name: "landing_page_url" },
  { title: "Kênh bán hàng", name: "channel" },
  { title: "Fanpage", name: "fanpage" },
  { title: "Địa chỉ IP", name: "ip_address" },
  { title: "Người sửa", name: "history_user" },
  { title: "Hệ điều hành", name: "os" },
  { title: "Kênh Ads", name: "ad_channel" },
  { title: "Id Ads", name: "ad_id" },
  { title: "Content Ads Id", name: "ad_id_content" },
  { title: "Dữ liệu khác", name: "additional_data" },
];
export const UNSTATIC_HISTORY_COLUMN_WIDTHS: { width: number; columnName: keyof PhoneLogType }[] = [
  { width: 150, columnName: "created" },
  { width: 150, columnName: "created_by" },
  { width: 150, columnName: "name" },
  { width: 150, columnName: "phone" },
  { width: 150, columnName: "note" },
  { width: 150, columnName: "history_type" },
  { width: 150, columnName: "is_existed" },
  { width: 150, columnName: "is_valid" },
  { width: 150, columnName: "modified_by" },
  { width: 150, columnName: "modified" },
  { width: 150, columnName: "data_status" },
  { width: 150, columnName: "handle_status" },
  { width: 150, columnName: "handle_reason" },
  { width: 150, columnName: "fail_reason" },
  { width: 150, columnName: "recent_handling" },
  { width: 150, columnName: "call_later_at" },
  { width: 150, columnName: "product" },
  { width: 150, columnName: "landing_page_url" },
  { width: 150, columnName: "channel" },
  { width: 150, columnName: "fanpage" },
  { width: 150, columnName: "ip_address" },
  { width: 150, columnName: "history_user" },
  { width: 150, columnName: "os" },
  { width: 100, columnName: "ad_channel" },
  { width: 100, columnName: "ad_id" },
  { width: 100, columnName: "ad_id_content" },
  { width: 150, columnName: "additional_data" },
];

export const IS_EXISTED_COLUMN: {
  title: string;
  name: keyof PhoneLogType;
}[] = [
  { title: "Ngày tạo Lead", name: "created" },
  { title: "Tên khách hàng", name: "name" },
  { title: "SĐT", name: "phone" },
  { title: "Ghi chú", name: "note" },
  { title: "Trạng thái đơn", name: "lead_status" },
  { title: "Mã ORDER", name: "order_information" },
  { title: "Trùng", name: "is_existed" },
  { title: "Dữ liệu sai", name: "is_valid" },
  { title: "Người tạo", name: "created_by" },
  { title: "Người xử lý", name: "handle_by" },
  { title: "Người xử lý gần nhất", name: "modified_by" },
  { title: "Trạng thái dữ liệu", name: "data_status" },
  { title: "Số lần gọi", name: "handle_status" },
  { title: "Lý do xử lý", name: "handle_reason" },
  { title: "Lý do không mua", name: "fail_reason" },
  { title: "Dữ liệu không chất lượng", name: "bad_data_reason" },
  { title: "Số phút xử lý", name: "recent_handling" },
  { title: "Ngày gọi lại", name: "call_later_at" },
  { title: "Sản phẩm/ Chiến dịch", name: "product" },
  { title: "Trang sản phẩm", name: "landing_page_url" },
  { title: "Kênh bán hàng", name: "channel" },
  { title: "Fanpage", name: "fanpage" },
  { title: "Địa chỉ IP", name: "ip_address" },
  { title: "Hệ điều hành", name: "os" },
  { title: "Kênh Ads", name: "ad_channel" },
  { title: "Id Ads", name: "ad_id" },
  { title: "Content Ads Id", name: "ad_id_content" },
  { title: "Dữ liệu khác", name: "additional_data" },
];

export const IS_EXISTED_COLUMN_WIDTH: { width: number; columnName: keyof PhoneLogType }[] = [
  { width: 150, columnName: "created" },
  { width: 200, columnName: "name" },
  { width: 150, columnName: "phone" },
  { width: 200, columnName: "note" },
  { width: 150, columnName: "lead_status" },
  { width: 150, columnName: "order_information" },
  { width: 150, columnName: "is_existed" },
  { width: 150, columnName: "is_valid" },
  { width: 150, columnName: "created_by" },
  { width: 150, columnName: "handle_by" },
  { width: 200, columnName: "modified_by" },
  { width: 100, columnName: "data_status" },
  { width: 150, columnName: "handle_status" },
  { width: 200, columnName: "handle_reason" },
  { width: 150, columnName: "fail_reason" },
  { width: 150, columnName: "bad_data_reason" },
  { width: 100, columnName: "recent_handling" },
  { width: 150, columnName: "call_later_at" },
  { width: 200, columnName: "product" },
  { width: 200, columnName: "landing_page_url" },
  { width: 200, columnName: "channel" },
  { width: 200, columnName: "fanpage" },
  { width: 100, columnName: "ip_address" },
  { width: 120, columnName: "os" },
  { width: 100, columnName: "ad_channel" },
  { width: 100, columnName: "ad_id" },
  { width: 100, columnName: "ad_id_content" },
  { width: 120, columnName: "additional_data" },
];

export const columnShowUserLeadHistory: ColumnShow = {
  columnWidths: [
    { columnName: "history_date", width: 170 },
    { columnName: "history_user", width: 170 },
    { columnName: "is_auto_lead", width: 470 },
    { columnName: "is_online", width: 470 },
  ],
  columnsShowHeader: [
    { name: "history_date", title: "Ngày cập nhật", isShow: true },
    { name: "history_user", title: "Người cập nhật", isShow: true },
    { name: "is_auto_lead", title: "Kênh chia số tự động", isShow: true },
    { name: "is_online", title: "Online", isShow: true },
  ],
};

export const leadTableColumnExtensions: GridColumnExtension[] = [
  { columnName: "lead_info", align: "center" },
  { columnName: "product_info", align: "center" },
];

export const REPORT_COLUMNS: Column[] = [
  { title: "Sản phẩm", name: "product" },
  { title: "Tổng đã chia", name: "total" },
  { title: "Mới", name: "new_lead" },
  // { title: "Đã chia số", name: "assigned_lead" },
  { title: "Chờ chia số", name: "unassigned_lead" },
  { title: "SĐT CL trước xử lý", name: "pre_qualified" },
  { title: "SĐT CL sau xử lý", name: "post_qualified" },
  { title: "SĐT KCL trước xử lý", name: "pre_not_qualified" },
  { title: "SĐT KCL sau xử lý", name: "post_not_qualified" },
  { title: "Đang xử lý", name: "processing" },
  { title: "Đã xử lý", name: "processed" },
  { title: "Có mua", name: "buy" },
  { title: "Không mua", name: "not_buy" },
  { title: "Tỷ lệ chốt", name: "buy_rate" },
];

export const REPORT_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { width: 180, columnName: "product" },
  { width: 80, columnName: "total" },
  { width: 80, columnName: "new_lead" },
  { width: 80, columnName: "unassigned_lead" },
  { width: 100, columnName: "pre_qualified" },
  { width: 100, columnName: "post_qualified" },
  { width: 100, columnName: "pre_not_qualified" },
  { width: 100, columnName: "post_not_qualified" },
  { width: 100, columnName: "processing" },
  { width: 100, columnName: "processed" },
  { width: 100, columnName: "buy" },
  { width: 100, columnName: "not_buy" },
  { width: 100, columnName: "buy_rate" },
];

export const SUMMARY_REPORT_COLUMNS: SummaryItem[] = [
  { columnName: "total", type: "sum" },
  { columnName: "new_lead", type: "sum" },
  // { columnName: "assigned_lead", type: "sum" },
  { columnName: "unassigned_lead", type: "sum" },
  { columnName: "post_qualified", type: "sum" },
  { columnName: "pre_qualified", type: "sum" },
  { columnName: "pre_not_qualified", type: "sum" },
  { columnName: "post_not_qualified", type: "sum" },
  { columnName: "new", type: "sum" },
  { columnName: "unprocessed", type: "sum" },
  { columnName: "waiting", type: "sum" },
  { columnName: "processing", type: "sum" },
  { columnName: "processed", type: "sum" },
  { columnName: "buy", type: "sum" },
  { columnName: "not_buy", type: "sum" },
  { columnName: "buy_rate", type: "sum" },
];

export const REPORT_COLUMNS_ORDER: string[] = [
  "product",
  "total",
  "new_lead",
  // "assigned_lead",
  "unassigned_lead",
  "pre_qualified",
  "pre_not_qualified",
  "post_qualified",
  "post_not_qualified",
  "processing",
  "processed",
  "buy",
  "not_buy",
  "buy_rate",
];

export const REPORT_COLUMNS_V2: Column[] = [
  // { title: "Sản phẩm", name: "lead_product" },
  { title: "Đã chia số", name: "assigned_lead" },
  { title: "Có mua", name: "buy_lead" },
  { title: "Không mua", name: "not_buy_lead" },
  { title: "Đã xử lý", name: "processed_lead" },
  { title: "Đang xử lý", name: "processing_lead" },
  { title: "SĐT chất lượng", name: "qualified_lead" },
  { title: "Mới", name: "new_lead" },
  { title: "Tổng Lead", name: "total_lead" },
  { title: "Chờ xử lý", name: "waiting_lead" },
];

export const REPORT_COLUMN_WIDTHS_V2: TableColumnWidthInfo[] = [
  // { width: 180, columnName: "lead_product" },
  { width: 100, columnName: "assigned_lead" },
  { width: 100, columnName: "buy_lead" },
  { width: 110, columnName: "not_buy_lead" },
  { width: 100, columnName: "processed_lead" },
  { width: 100, columnName: "processing_lead" },
  { width: 100, columnName: "qualified_lead" },
  { width: 100, columnName: "new_lead" },
  { width: 100, columnName: "total_lead" },
  { width: 100, columnName: "waiting_lead" },
];

export const REPORT_COLUMNS_ORDER_V2: string[] = [
  "lead_product",
  "total_lead",
  "new_lead",
  "assigned_lead",
  "processed_lead",
  "waiting_lead",
  "processing_lead",
  "buy_lead",
  "not_buy_lead",
  "qualified_lead",
];

export const SUMMARY_REPORT_COLUMNS_V2: SummaryItem[] = [
  { columnName: "assigned_lead", type: "sum" },
  { columnName: "buy_lead", type: "sum" },
  { columnName: "not_buy_lead", type: "sum" },
  { columnName: "new_lead", type: "sum" },
  { columnName: "processed_lead", type: "sum" },
  { columnName: "processing_lead", type: "sum" },
  { columnName: "qualified_lead", type: "sum" },
  { columnName: "total_lead", type: "sum" },
  { columnName: "waiting_lead", type: "sum" },
];

export const REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_V2: Column[] = [
  { title: "Sản phẩm", name: "lead_product" },
  { title: "Người nhận chia số", name: "telesale" },
  { title: "Đã chia số", name: "assigned_lead" },
  { title: "Có mua", name: "buy_lead" },
  { title: "Không mua", name: "not_buy_lead" },
  { title: "Đã xử lý", name: "processed_lead" },
  { title: "Mới", name: "new_lead" },
  { title: "Đang xử lý", name: "processing_lead" },
  { title: "SĐT chất lượng", name: "qualified_lead" },
  // { title: "Tổng Lead", name: "total_lead" },
  { title: "Chờ xử lý", name: "waiting_lead" },
];

export const REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMN_WIDTHS_V2: TableColumnWidthInfo[] = [
  { width: 180, columnName: "lead_product" },
  { width: 150, columnName: "telesale" },
  { width: 140, columnName: "assigned_lead" },
  { width: 150, columnName: "buy_lead" },
  { width: 120, columnName: "not_buy_lead" },
  { width: 120, columnName: "processed_lead" },
  { width: 120, columnName: "processing_lead" },
  { width: 130, columnName: "qualified_lead" },
  { width: 100, columnName: "new_lead" },
  // { width: 160, columnName: "total_lead" },
  { width: 100, columnName: "waiting_lead" },
];

export const REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_ORDER_V2: string[] = [
  "lead_product",
  "telesale",
  "total_lead",
  "new_lead",
  "assigned_lead",
  "processed_lead",
  "waiting_lead",
  "processing_lead",
  "buy_lead",
  "not_buy_lead",
  "qualified_lead",
];

export const SUMMARY_REPORT_HANDLE_LEAD_BY_PRODUCT_COLUMNS_V2: SummaryItem[] = [
  { columnName: "telesale", type: "count" },
  { columnName: "new_lead", type: "sum" },
  { columnName: "assigned_lead", type: "sum" },
  { columnName: "buy_lead", type: "sum" },
  { columnName: "not_buy_lead", type: "sum" },
  { columnName: "processed_lead", type: "sum" },
  { columnName: "processing_lead", type: "sum" },
  { columnName: "qualified_lead", type: "sum" },
  { columnName: "total_lead", type: "sum" },
  { columnName: "waiting_lead", type: "sum" },
];

export const REPORT_BY_OPTIONS_V2: SelectOptionType[] = [
  { label: "Sản phẩm", value: "lead_product" },
  { label: "Kênh bán hàng", value: "lead_channel" },
  { label: "Kênh bán hàng(ORDER)", value: "order_channel" },
  { label: "Ngày tạo Lead", value: "created_date" },
  { label: "Sale", value: "telesale" },
  { label: "Ngày chia số", value: "assigned_date" },
  { label: "Ngày xử lý", value: "processed_date" },
];

export const USER_COLUMNS: Column[] = [
  { name: "email", title: "Email" },
  { name: "name", title: "Họ và tên" },
  { name: "staff_phone", title: "Số điện thoại" },
  { name: "group_permission", title: "Quyền" },
  { name: "is_online", title: "Online" },
  { name: "is_auto_lead", title: "Kênh chia số tự động" },
  { name: "last_login", title: "Lần đăng nhập cuối" },
];

export const USER_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "email", width: 200 },
  { columnName: "name", width: 180 },
  { columnName: "staff_phone", width: 120 },
  { columnName: "group_permission", width: 130 },
  { columnName: "is_online", width: 90 },
  { columnName: "is_auto_lead", width: 360 },
  { columnName: "last_login", width: 150 },
];

export const REPORT_BY_OPTIONS: SelectOptionType[] = [
  { label: "Sản phẩm", value: "product" },
  { label: "Kênh bán hàng", value: "channel" },
  { label: "Người tạo", value: "created_by" },
  { label: "Ngày tạo Lead", value: "created_date" },
  { label: "Đường dẫn sản phẩm", value: "landing_page_domain" },
  { label: "Ngày chia số", value: "handler_assigned_date" },
  { label: "Lý do không mua", value: "fail_reason" },
  { label: "Fanpage", value: "fanpage" },
  { label: "Người xử lý", value: "handle_by" },
  { label: "Lý do xử lý", value: "handle_reason" },
  { label: "Trạng thái xử lý", value: "handle_status" },
  { label: "Dữ liệu không chất lượng", value: "bad_data_reason" },
  { label: "Kênh", value: "ad_channel" },
  { label: "Người chạy", value: "ad_account" },
  { label: "Id content", value: "ad_id_content" },
  { label: "Loại chiến dịch", value: "ad_campaign_type" },
  { label: "Đại lý", value: "ad_partner" },
  { label: "Mã sản phẩm", value: "ad_product_code" },
];

export const groupSummaryItems = [
  {
    columnName: "lead_product",
    type: "count",
    showInGroupFooter: false,
  },
  {
    columnName: "telesale",
    type: "count",
    showInGroupFooter: false,
    alignByColumn: true,
  },
  {
    columnName: "new_lead",
    type: "sum",
    showInGroupFooter: false,
    alignByColumn: true,
  },
  {
    columnName: "assigned_lead",
    type: "sum",
    showInGroupFooter: false,
    alignByColumn: true,
  },
  { columnName: "buy_lead", type: "sum", showInGroupFooter: false, alignByColumn: true },
  {
    columnName: "not_buy_lead",
    type: "sum",
    showInGroupFooter: false,
    alignByColumn: true,
  },
  {
    columnName: "processed_lead",
    type: "sum",
    showInGroupFooter: false,
    alignByColumn: true,
  },
  {
    columnName: "processing_lead",
    type: "sum",
    showInGroupFooter: false,
    alignByColumn: true,
  },
  {
    columnName: "qualified_lead",
    type: "sum",
    showInGroupFooter: false,
    alignByColumn: true,
  },
  { columnName: "total_lead", type: "sum", showInGroupFooter: false, alignByColumn: true },
  {
    columnName: "waiting_lead",
    type: "sum",
    showInGroupFooter: false,
    alignByColumn: true,
  },
];

export const REPORT_VOIP_COLUMNS_V2: Column[] = [
  { title: "Tổng", name: "total" },
  { title: "Gọi vào", name: "inbound" },
  { title: "Gọi vào trả lời", name: "answered_inbound" },
  { title: "Gọi vào nhỡ", name: "missed_inbound" },
  { title: "Gọi ra", name: "outbound" },
  { title: "Gọi ra trả lời", name: "answered_outbound" },
  { title: "Gọi ra nhỡ", name: "missed_outbound" },
  { title: "Gọi ra bận", name: "busy_outbound" },
  { title: "Gọi ra thất bại", name: "failed_outbound" },
  { title: "Tổng thời lượng gọi(phút)", name: "total_billsec" },
  { title: "Tổng thời lượng gọi vào(phút)", name: "total_inbound_billsec" },
  { title: "Tổng thời lượng gọi ra(phút)", name: "total_outbound_billsec" },
];

export const REPORT_VOIP_COLUMN_WIDTHS_V2: TableColumnWidthInfo[] = [
  { width: 95, columnName: "inbound" },
  { width: 120, columnName: "missed_inbound" },
  { width: 115, columnName: "missed_outbound" },
  { width: 95, columnName: "outbound" },
  { width: 80, columnName: "total" },
  { width: 135, columnName: "answered_inbound" },
  { width: 140, columnName: "answered_outbound" },
  { width: 120, columnName: "busy_outbound" },
  { width: 135, columnName: "failed_outbound" },
  { width: 185, columnName: "total_billsec" },
  { width: 240, columnName: "total_inbound_billsec" },
  { width: 230, columnName: "total_outbound_billsec" },
];

export const REPORT_VOIP_COLUMNS_ORDER_V2: string[] = [
  "total",
  "total_billsec",
  "inbound",
  "answered_inbound",
  "total_inbound_billsec",
  "missed_inbound",
  "outbound",
  "answered_outbound",
  "total_outbound_billsec",
  "missed_outbound",
  "busy_outbound",
  "failed_outbound",
];

export const SUMMARY_REPORT_VOIP_COLUMNS: SummaryItem[] = [
  { type: "sum", columnName: "inbound" },
  { type: "sum", columnName: "missed_inbound" },
  { type: "sum", columnName: "missed_outbound" },
  { type: "sum", columnName: "outbound" },
  { type: "sum", columnName: "total" },
  { type: "sum", columnName: "answered_inbound" },
  { type: "sum", columnName: "answered_outbound" },
  { type: "sum", columnName: "busy_outbound" },
  { type: "sum", columnName: "failed_outbound" },
  { type: "sum", columnName: "total_billsec" },
  { type: "sum", columnName: "total_inbound_billsec" },
  { type: "sum", columnName: "total_outbound_billsec" },
];

export const REPORT_CRM_COLUMNS: Column[] = [
  { name: "date", title: "Ngày" },
  { name: "buy_rate", title: "Tỉ lệ chốt" },
  { name: "lead_order", title: "Đơn hàng Lead" },
  { name: "lead_aov", title: "AOV Lead" },
  { name: "order", title: "Đơn hàng" },
  { name: "aov", title: "AOV" },
];

export const REPORT_CRM_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "date", width: 200 },
  { columnName: "buy_rate", width: 180 },
  { columnName: "lead_order", width: 180 },
  { columnName: "lead_aov", width: 180 },
  { columnName: "order", width: 180 },
  { columnName: "aov", width: 180 },
];

export const REPORT_CRM_DETAIL_COLUMNS: Column[] = [
  { name: "product__name", title: "Sản phẩm" },
  { name: "channel__name", title: "Kênh bán hàng" },
  { name: "buy_rate", title: "Tỉ lệ chốt" },
  { name: "lead_order", title: "Đơn hàng Lead" },
  { name: "lead_aov", title: "AOV Lead" },
  { name: "order", title: "Đơn hàng" },
  { name: "aov", title: "AOV" },
];

export const REPORT_CRM_DETAIL_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "product__name", width: 200 },
  { columnName: "channel__name", width: 180 },
  { columnName: "buy_rate", width: 180 },
  { columnName: "lead_order", width: 180 },
  { columnName: "lead_aov", width: 180 },
  { columnName: "order", width: 180 },
  { columnName: "aov", width: 150 },
];

export const SPAM_CHECK_COLUMNS: Column[] = [
  { name: "status", title: "Nội dung" },
  { name: "data", title: "Dữ liệu" },
  { name: "note", title: "Ghi chú" },
  { name: "spam_count", title: "Số lần Spam" },
  { name: "created", title: "Ngày tạo" },
  { name: "created_by_id", title: "Người tạo" },
  { name: "action", title: "Thao tác" },
];

export const SPAM_CHECK_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "status", width: 120 },
  { columnName: "data", width: 120 },
  { columnName: "note", width: 120 },
  { columnName: "spam_count", width: 120 },
  { columnName: "created", width: 150 },
  { columnName: "created_by_id", width: 150 },
  { columnName: "action", width: 150 },
];

export const SPAM_CHECK_COLUMN_ORDERS = reduce(
  SPAM_CHECK_COLUMNS,
  (prev: string[], cur) => {
    return [...prev, cur.name];
  },
  []
);
