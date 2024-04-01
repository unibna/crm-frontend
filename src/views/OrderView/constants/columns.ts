import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnShow } from "_types_/FacebookType";
import { OrderPaymentTypeV2 } from "_types_/OrderType";
import map from "lodash/map";

export const ORDER_COLUMNS: Column[] = [
  { name: "order_key", title: "Đơn hàng" },
  { name: "general", title: "Thông tin chung" },
  { name: "customer_phone", title: "Khách hàng" },
  { name: "payment", title: "Thanh toán" },
  { name: "payment_status", title: "Trạng thái thanh toán" },
  { name: "modify_info", title: "Thông tin xử lý" },
  { name: "shipping", title: "Vận đơn" },
  { name: "expected_delivery_time", title: "Xử lý vận đơn" },
  { name: "cancel_reason", title: "Thông tin huỷ" },
];

export const ORDER_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "order_key", width: 180 },
  { columnName: "status", width: 160 },
  { columnName: "general", width: 160 },
  { columnName: "modify_info", width: 220 },
  { columnName: "customer_phone", width: 220 },
  { columnName: "payment", width: 300 },
  { columnName: "payment_status", width: 300 },
  { columnName: "shipping", width: 220 },
  { columnName: "expected_delivery_time", width: 220 },
  { columnName: "cancel_reason", width: 220 },
];

export const ORDER_SORTING_STATE_EXTENSIONS = [
  { columnName: "payment_status", sortingEnabled: false },
  { columnName: "shipping", sortingEnabled: false },
  { columnName: "expected_delivery_time", sortingEnabled: false },
  { columnName: "cancel_reason", sortingEnabled: false },
  { columnName: "general", sortingEnabled: false },
];

export const ORDER_HISTORY_COLUMN: Column[] = [
  { name: "history_modified", title: "Thời gian chỉnh sửa" },
  { name: "history_modified_by", title: "Người chỉnh sửa" },
  { name: "note", title: "Ghi chú nội bộ" },
  { name: "delivery_note", title: "Ghi chú vận đơn" },
  { name: "tags", title: "Thẻ" },
  { name: "source", title: "Nguồn" },
  { name: "history_action", title: "Loại thao tác" },
  { name: "status", title: "Trạng thái" },
  { name: "is_cross_sale", title: "Đơn Cross Sale" },
];

export const ORDER_HISTORY_COLUMN_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "history_modified", width: 160 },
  { columnName: "history_modified_by", width: 180 },
  { columnName: "note", width: 150 },
  { columnName: "delivery_note", width: 150 },
  { columnName: "tags", width: 150 },
  { columnName: "source", width: 150 },
  { columnName: "history_action", width: 100 },
  { columnName: "status", width: 130 },
  { columnName: "is_cross_sale", width: 120 },
];

export const DEFAULT_ORDER_CO = map(ORDER_COLUMN_WIDTHS, (column) => column.columnName);

export const ACCOUNTING_VERIFICATION_COLUMN: Column[] = [
  { name: "order", title: "ID đơn hàng" },
  { name: "is_paid", title: "COD - Đã giao dịch" },
  { name: "amount_paid", title: "COD - Số tiền giao dịch" },
  { name: "bank_account_number", title: "COD - Mã ngân hàng" },
  { name: "import_file_by", title: "COD - Người Import File" },
  { name: "created", title: "COD - Ngày Import File" },
  { name: "customer_last_name", title: "Tên khách hàng" },
  { name: "customer_phone", title: "SĐT khách hàng" },
  { name: "order_number", title: "Mã đơn hàng" },
  { name: "skylink_status", title: "Trạng thái giao hàng(SKL)" },
  { name: "total_price", title: "Tổng thanh toán" },
  { name: "tracking_company", title: "Đơn vị giao hàng" },
  { name: "tracking_created_at", title: "Ngày tạo mã vận đơn" },
  { name: "tracking_number", title: "Mã vận đơn" },
  { name: "pay_codes", title: "COD - Mã giao dịch" },
  { name: "payment_date", title: "COD - Ngày giao dịch" },
  { name: "modified_reason", title: "COD - Lý do chỉnh sửa" },
];

export const ACCOUNTING_VERIFICATION_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "order", width: 100 },
  { columnName: "is_paid", width: 100 },
  { columnName: "amount_paid", width: 100 },
  { columnName: "bank_account_number", width: 100 },
  { columnName: "import_file_by", width: 100 },
  { columnName: "created", width: 100 },
  { columnName: "customer_last_name", width: 150 },
  { columnName: "customer_phone", width: 120 },
  { columnName: "order_number", width: 120 },
  { columnName: "skylink_status", width: 150 },
  { columnName: "total_price", width: 140 },
  { columnName: "tracking_company", width: 150 },
  { columnName: "tracking_created_at", width: 120 },
  { columnName: "tracking_number", width: 150 },
  { columnName: "pay_codes", width: 100 },
  { columnName: "payment_date", width: 100 },
  { columnName: "modified_reason", width: 180 },
];

export const ACCOUNTING_HISTORY_COLUMN: Column[] = [
  { name: "history_type", title: "Loại thao tác" },
  { name: "created_by_user_email", title: "Email khách hàng" },
  { name: "modified_by_user_email", title: "Email người xử lý" },
  { name: "modified_reason", title: "Lý do chỉnh sửa" },
  { name: "bank_account_number", title: "Mã ngân hàng" },
  { name: "amount_paid", title: "Số tiền giao dịch" },
  { name: "pay_codes", title: "Mã giao dịch" },
  { name: "payment_date", title: "Ngày giao dịch" },
  { name: "note", title: "Ghi chú" },
  { name: "history_date", title: "Ngày chỉnh sửa" },
];

export const ACCOUNTING_HISTORY_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: "history_type", width: 150 },
  { columnName: "created_by_user_email", width: 100 },
  { columnName: "modified_by_user_email", width: 100 },
  { columnName: "modified_reason", width: 180 },
  { columnName: "bank_account_number", width: 100 },
  { columnName: "amount_paid", width: 100 },
  { columnName: "pay_codes", width: 100 },
  { columnName: "payment_date", width: 100 },
  { columnName: "note", width: 100 },
  { columnName: "history_date", width: 100 },
];

export const COLUMN_NONE_REPORTS = [
  "order_id",
  "customer_id",
  "carrier_status_code",
  "cod_paid_date",
  "cod_pending_date",
  "cod_receipt_date",
  "cod_not_receipt_date",
  "prev_order_number",
  "prev_order_date",
  "accounting",
  "prev_order_id",
  "referring_site",
  "nt_status",
  "is_created_task",
  "kanban_time_update",
  "kanban_type_order",
  "kanban_status",
  "skylink_status_wfd",
  "skylink_action_wfd",
  "skylink_status_late_delivery",
  "skylink_action_late_delivery",
  "skylink_status_return",
  "skylink_action_return",
  "skylink_reason_return",
];

export const PAYMENT_COLUMNS: ColumnShow<OrderPaymentTypeV2> = {
  columnWidths: [
    { columnName: "type", width: 180 },
    { columnName: "amount", width: 100 },
    { columnName: "confirmed_date", width: 200 },
    { columnName: "third_party_paid_status", width: 150 },
    { columnName: "internal_paid_status", width: 150 },
    { columnName: "final_paid_status", width: 150 },
    { columnName: "is_confirmed", width: 150 },
    { columnName: "receive_info", width: 350 },
  ],
  columnsShowHeader: [
    { name: "type", title: "Loại thanh toán", isShow: true },
    { name: "amount", title: "Số tiền", isShow: true },
    { name: "confirmed_date", title: "Trạng thái xác nhận", isShow: true },
    { name: "third_party_paid_status", title: "TT 3rd", isShow: true },
    { name: "internal_paid_status", title: "TT nội bộ", isShow: true },
    { name: "final_paid_status", title: "Trạng thái TT", isShow: true },
    { name: "is_confirmed", title: "Đã xác nhận", isShow: true },
    { name: "receive_info", title: "Thực nhận", isShow: true },
  ],
};

export const PAYMENT_DETAIL_COLUMNS: ColumnShow = {
  columnWidths: [
    { columnName: "type", width: 120 },
    { columnName: "amount", width: 100 },
    { columnName: "confirmed_date", width: 200 },
    { columnName: "is_confirmed", width: 120 },
    { columnName: "receive_info", width: 280 },
  ],
  columnsShowHeader: [
    { name: "type", title: "Loại thanh toán", isShow: true },
    { name: "amount", title: "Số tiền", isShow: true },
    { name: "confirmed_date", title: "Trạng thái xác nhận", isShow: true },
    { name: "is_confirmed", title: "Đã xác nhận", isShow: true },
    { name: "receive_info", title: "Thực nhận", isShow: true },
  ],
};

export const ORDER_COLUMNS_SHOW_SORT = [
  {
    name: "modify_info",
    fields: [
      { title: "Ngày tạo", name: "created" },
      { title: "Ngày xử lý", name: "modified" },
      { title: "Ngày hẹn gọi lại", name: "appointment_date" },
    ],
  },
  {
    name: "payment",
    fields: [
      { title: "Tiền hàng", name: "total_variant_actual" },
      { title: "Tổng đơn hàng", name: "total_actual" },
    ],
  },
];

export const ORDER_SORT_FIELDS = {
  created: "Ngày tạo",
  modified: "Ngày xử lý",
  order_key: "Mã đơn hàng",
  completed_time: "Ngày xác nhận",
  total_actual: "Tổng đơn hàng",
  fee_delivery: "Phí ship",
  discount_input: "Giảm giá",
  discount_promotion: "Khuyễn mãi",
};
