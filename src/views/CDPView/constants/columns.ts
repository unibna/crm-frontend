//utils
import filter from "lodash/filter";

// components
import { Column, EditingState, TableColumnWidthInfo } from "@devexpress/dx-react-grid";

export const PHONE_COLUMNS = [
  { title: "Ngày tạo Lead", name: "created" },
  { title: "Ghi chú", name: "note" },
  { title: "Kênh bán hàng", name: "channel" },
  { title: "Địa chỉ IP", name: "ip_address" },
  { title: "Mã đơn", name: "order_information" },
  { title: "Trạng thái đơn", name: "lead_status" },
  { title: "Số lần gọi", name: "handle_status" },
  { title: "Lý do đang xử lý", name: "handle_reason" },
  { title: "Lý do không mua", name: "fail_reason" },
  { title: "Lý do không chất lượng", name: "bad_data_reason" },
  { title: "Trang sản phẩm", name: "landing_page_url" },
  { title: "Fanpage", name: "fanpage" },
  { title: "Người được chia số", name: "handle_by" },
  { title: "Người xử lý gần nhất", name: "modified_by" },
  { title: "Ngày xử lý gần nhất", name: "modified" },
  { title: "Hệ điều hành", name: "os" },
];

export const PHONE_COLUMNS_WIDTH = [
  { width: 135, columnName: "created" },
  { width: 150, columnName: "note" },
  { width: 90, columnName: "channel" },
  { width: 100, columnName: "ip_address" },
  { width: 120, columnName: "order_information" },
  { width: 120, columnName: "lead_status" },
  { width: 120, columnName: "handle_status" },
  { width: 120, columnName: "handle_reason" },
  { width: 120, columnName: "fail_reason" },
  { width: 150, columnName: "bad_data_reason" },
  { width: 150, columnName: "landing_page_url" },
  { width: 120, columnName: "fanpage" },
  { width: 140, columnName: "handle_by" },
  { width: 120, columnName: "modified_by" },
  { width: 120, columnName: "modified" },
  { width: 100, columnName: "os" },
];

export const CALL_COLUMNS: Column[] = [
  { title: "Ngày gọi", name: "created" },
  { title: "Số nội bộ", name: "hotline_number" },
  { title: "Số khách hàng", name: "customer_number" },
  { title: "Người trực line", name: "telephonist_name" },
  { title: "Loại cuộc gọi", name: "business_call_type" },
  { title: "Tổng thời lượng gọi (phút)", name: "duration" },
  { title: "Ghi chú", name: "sky_call_note" },
  { title: "Ngày chỉnh sửa", name: "modified" },
  { title: "Người chỉnh sửa", name: "modified_by_name" },
  { title: "Audio", name: "play_url" },
  { title: "Tải xuống", name: "record_url" },
  { title: "Trạng thái", name: "call_status" },
  { title: "Luồng gọi", name: "call_type" },
];
export const CALL_COLUMNS_WIDTH: Pick<
  TableColumnWidthInfo & EditingState.ColumnExtension,
  "columnName" | "editingEnabled" | "width"
>[] = [
  { width: 135, columnName: "created", editingEnabled: false },
  { width: 120, columnName: "hotline_number", editingEnabled: false },
  { width: 140, columnName: "customer_number", editingEnabled: false },
  { width: 150, columnName: "telephonist_name", editingEnabled: false },
  { width: 200, columnName: "business_call_type" },
  { width: 200, columnName: "duration" },
  { width: 200, columnName: "sky_call_note" },
  { width: 200, columnName: "modified", editingEnabled: false },
  { width: 200, columnName: "modified_by_name", editingEnabled: false },
  { width: 100, columnName: "play_url", editingEnabled: false },
  { width: 100, columnName: "record_url", editingEnabled: false },
  { width: 100, columnName: "download_url", editingEnabled: false },
  { width: 150, columnName: "call_status", editingEnabled: false },
  { width: 120, columnName: "call_type", editingEnabled: false },
];

export const NOTE_COLUMNS: Column[] = [
  { title: "Ngày tạo ghi chú", name: "created" },
  { title: "Nội dung", name: "message" },
  { title: "Nguồn", name: "type" },
  { title: "Hình ảnh", name: "images" },
];
export const NOTE_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { width: 135, columnName: "created" },
  { width: 200, columnName: "message" },
  { width: 100, columnName: "type" },
  { width: 200, columnName: "images" },
];

export const COMMENT_COLUMNS: Column[] = [
  { title: "Ngày tạo comment", name: "created_time" },
  { title: "Nội dung", name: "message" },
  { title: "Fanpage", name: "page" },
  { title: "Bài viết", name: "fb_post" },
  { title: "ContentID", name: "content_id" },
];

export const COMMENT_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { width: 110, columnName: "created_time" },
  { width: 200, columnName: "message" },
  { width: 150, columnName: "page" },
  { width: 150, columnName: "fb_post" },
  { width: 150, columnName: "content_id" },
];

export const INBOX_COLUMNS: Column[] = [
  { title: "Ngày tạo tin nhắn", name: "created_time" },
  { title: "Người gởi", name: "sender_name" },
  { title: "Nội dung", name: "message" },
  { title: "Fanpage", name: "page" },
  { title: "ContentID", name: "content_id_final" },
];
export const INBOX_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { width: 110, columnName: "created_time" },
  { width: 110, columnName: "sender_name" },
  { width: 200, columnName: "message" },
  { width: 150, columnName: "page" },
  { width: 150, columnName: "content_id_final" },
];

export const AIRTABLE_COLUMNS: Column[] = [
  { title: "Nhân viên xử lý", name: "handling_staff" },
  { title: "Số điện thoại", name: "phone" },
  { title: "Kênh", name: "channel_airtable" },
  { title: "Sản phẩm", name: "product_airtable" },
  { title: "Trạng thái", name: "status_airtable" },
  { title: "Tình trạng", name: "status_other" },
  { title: "Phân loại", name: "classify" },
  { title: "Mô tả tình trạng", name: "description" },
  { title: "Ghi chú", name: "note" },
  { title: "Hướng xử lí", name: "solution" },
  { title: "Cảm nhận của KH", name: "customer_comment" },
  { title: "Caculation", name: "caculation" },
  { title: "Ngày tạo AirTable", name: "created_date" },
  { title: "Thời gian tạo", name: "created_time" },
  { title: "Thời Gian Hiện Tại", name: "present_time" },
  { title: "Sản phẩm bù/tặng/đổi trả/ mua thêm", name: "compensation_product" },
];

export const AIRTABLE_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { width: 150, columnName: "phone" },
  { width: 150, columnName: "note" },
  { width: 150, columnName: "channel_airtable" },
  { width: 150, columnName: "caculation" },
  { width: 150, columnName: "created_date" },
  { width: 150, columnName: "product_airtable" },
  { width: 150, columnName: "classify" },
  { width: 150, columnName: "status_airtable" },
  { width: 150, columnName: "status_other" },
  { width: 150, columnName: "solution" },
  { width: 150, columnName: "created_time" },
  { width: 150, columnName: "customer_comment" },
  { width: 150, columnName: "handling_staff" },
  { width: 150, columnName: "description" },
  { width: 150, columnName: "present_time" },
  { width: 150, columnName: "compensation_product" },
];

export const ORDER_COLUMNS: Column[] = [
  { name: "created_at", title: "Ngày tạo đơn" },
  { name: "source_name", title: "Kênh bán hàng" },
  { name: "order_number", title: "Mã đơn hàng" },
  { name: "total_price", title: "Đơn giá" },
  { name: "gifts", title: "Phần thưởng" },
  { name: "skylink_status", title: "Trạng thái giao hàng(SKL)" },
  { name: "note", title: "Ghi chú" },
];

export const ORDER_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "created_at", width: 110 },
  { columnName: "source_name", width: 90 },
  { columnName: "order_number", width: 90 },
  { columnName: "total_price", width: 100 },
  { columnName: "gifts", width: 180 },
  { columnName: "skylink_status", width: 150 },
  { columnName: "note", width: 120 },
];
export const ORDER_SKYLINK_COLUMNS: Column[] = [
  { name: "created", title: "Ngày tạo đơn" },
  { name: "source", title: "Kênh bán hàng" },
  { name: "order_key", title: "Mã đơn" },
  { name: "payment", title: "Đơn giá" },
  { name: "order_status", title: "Trạng thái" },
  { name: "tags", title: "Thẻ" },
  { name: "note", title: "Ghi chú" },
];

export const ORDER_COLUMNS_SKYLINK_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "created", width: 110 },
  { columnName: "source", width: 90 },
  { columnName: "order_key", width: 90 },
  { columnName: "payment", width: 200 },
  { columnName: "order_status", width: 180 },
  { columnName: "tags", width: 150 },
  { columnName: "note", width: 120 },
];

export const TAG_HISTORY_COLUMNS: Column[] = [
  { name: "change_date_time", title: "Ngày cập nhật" },
  { name: "change_by", title: "Người cập nhật" },
  { name: "change_operation", title: "Phương thức" },
  { name: "old_values", title: "Giá trị cũ" },
  { name: "new_values", title: "Giá trị mới" },
];

export const TAG_HISTORY_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "change_date_time", width: 120 },
  { columnName: "change_by", width: 150 },
  { columnName: "change_operation", width: 100 },
  { columnName: "old_values", width: 200 },
  { columnName: "new_values", width: 200 },
];

export const PRODUCT_COLUMNS: Column[] = [
  { name: "variant", title: "Sản phẩm" },
  { name: "latest_order_quantity", title: "Số SP/ đơn cuối" },
  { name: "total_quantity", title: "Tổng sản phẩm" },
  { name: "latest_delivered_date", title: "Ngày giao hàng cuối cùng" },
];

export const PRODUCT_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "variant", width: 300 },
  { columnName: "latest_order_quantity", width: 100 },
  { columnName: "total_quantity", width: 100 },
  { columnName: "latest_delivered_date", width: 150 },
];

export const CDP_COLUMNS: Column[] = [
  { name: "detail", title: "Chọn" },
  { name: "phone", title: " Số điện thoại" },
  { name: "second_phone", title: " Số điện thoại(2nd)" },
  { name: "full_name", title: "Tên" },
  { name: "birthday", title: "Ngày sinh" },
  { name: "ranking", title: "Hạng" },
  { name: "latest_up_rank_date", title: "Ngày lên hạng" },
  { name: "modified_care_staff_by", title: "Người chăm sóc" },
  { name: "order_spent", title: "Đơn hàng" },
  { name: "last_order", title: "Đơn hàng cuối" },
  { name: "shipping_addresses", title: "Địa chỉ" },
  { name: "last_lead_data_status", title: "Trạng thái dữ liệu" },
  { name: "tags", title: "Thẻ" },
  { name: "gender", title: "Giới tính" },
  { name: "email", title: "Email" },
];
export const CDP_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "detail", width: 80 },
  { columnName: "phone", width: 120 },
  { columnName: "second_phone", width: 120 },
  { columnName: "full_name", width: 150 },
  { columnName: "birthday", width: 120 },
  { columnName: "ranking", width: 90 },
  { columnName: "latest_up_rank_date", width: 80 },
  { columnName: "modified_care_staff_by", width: 150 },
  { columnName: "order_spent", width: 210 },
  { columnName: "last_order", width: 210 },
  { columnName: "shipping_addresses", width: 180 },
  { columnName: "last_lead_data_status", width: 120 },
  { columnName: "tags", width: 200 },
  { columnName: "email", width: 120 },
  { columnName: "gender", width: 80 },
];

export const DISABLED_EDITING_CDP_TABLE: EditingState.ColumnExtension[] = [
  { columnName: "detail", editingEnabled: false },
  { columnName: "phone", editingEnabled: false },
  { columnName: "full_name", editingEnabled: false },
  { columnName: "total_order", editingEnabled: false },
  { columnName: "shipping_addresses", editingEnabled: false },
  { columnName: "ranking", editingEnabled: false },
  { columnName: "latest_up_rank_date", editingEnabled: false },
  { columnName: "last_lead_data_status", editingEnabled: false },
  { columnName: "total_spent", editingEnabled: false },
  { columnName: "last_order_name", editingEnabled: false },
  { columnName: "last_order_date", editingEnabled: false },
  { columnName: "tags", editingEnabled: false },
  { columnName: "email", editingEnabled: false },
  { columnName: "gender", editingEnabled: false },
];

export const RANK_COLUMNS: Column[] = [
  { name: "created", title: "Ngày tạo hạng KH" },
  { name: "modified", title: "Ngày xử lý" },
  { name: "customer_change_by", title: "Người tạo" },
  { name: "modified_by", title: "Người xử lý" },
  { name: "modified_status", title: "Trạng thái" },
  { name: "phone", title: "Số điện thoại" },
  { name: "full_name", title: "Tên khách hàng" },
  { name: "total_spent", title: "Ngân sách" },
  { name: "modified_reason", title: "Lý do xử lý hạng" },
  { name: "new_rank", title: "Hạng mới" },
  { name: "old_rank", title: "Hạng cũ" },
  { name: "birthday", title: "Ngày sinh" },
  { name: "total_order", title: "Tổng đơn hàng" },
  { name: "shipping_addresses", title: "Địa chỉ" },
  { name: "gender", title: "Giới tính" },
  { name: "email", title: "Email" },
];
export const RANK_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "created", width: 85 },
  { columnName: "modified", width: 85 },
  { columnName: "customer_change_by", width: 150 },
  { columnName: "modified_by", width: 150 },
  { columnName: "modified_status", width: 100 },
  { columnName: "phone", width: 120 },
  { columnName: "full_name", width: 150 },
  { columnName: "total_spent", width: 90 },
  { columnName: "modified_reason", width: 200 },
  { columnName: "birthday", width: 120 },
  { columnName: "new_rank", width: 80 },
  { columnName: "old_rank", width: 80 },
  { columnName: "total_order", width: 80 },
  { columnName: "shipping_addresses", width: 180 },
  { columnName: "email", width: 120 },
  { columnName: "gender", width: 80 },
];

export const BIRTHDAY_COLUMNS: Column[] = [
  { name: "created", title: "Ngày tạo sinh nhật" },
  { name: "modified", title: "Ngày xử lý" },
  { name: "modified_by", title: "Người xử lý" },
  { name: "change_operation", title: "Phương thức" },
  { name: "new_birthday", title: "Giá trị mới" },
  { name: "old_birthday", title: "Giá trị cũ" },
];

export const BIRTHDAY_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "created", width: 120 },
  { columnName: "modified", width: 120 },
  { columnName: "modified_by", width: 150 },
  { columnName: "change_operation", width: 150 },
  { columnName: "new_birthday", width: 120 },
  { columnName: "old_birthday", width: 120 },
];

export const RANK_HISTORY_COLUMNS: Column[] = [
  { name: "created", title: "Ngày tạo hạng KH" },
  { name: "modified", title: "Ngày xử lý" },
  { name: "customer_change_by", title: "Người tạo" },
  { name: "modified_by", title: "Người xử lý" },
  { name: "modified_reason", title: "Lý do xử lý hạng" },
  { name: "change_operation", title: "Phương thức" },
  { name: "new_rank", title: "Hạng mới" },
  { name: "old_rank", title: "Hạng cũ" },
];
export const RANK_HISTORY_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "created", width: 85 },
  { columnName: "modified", width: 85 },
  { columnName: "customer_change_by", width: 150 },
  { columnName: "modified_by", width: 150 },
  { columnName: "modified_reason", width: 200 },
  { columnName: "change_operation", width: 100 },
  { columnName: "new_rank", width: 80 },
  { columnName: "old_rank", width: 80 },
];

export const NOTE_HISTORY_COLUMNS: Column[] = [
  { name: "created", title: "Ngày tạo ghi chú" },
  { name: "modified", title: "Ngày xử lý" },
  { name: "customer_change_by", title: "Người tạo" },
  { name: "modified_by", title: "Người xử lý" },
  { name: "change_operation", title: "Phương thức" },
  { name: "new_note", title: "Nội dung mới" },
  { name: "old_note", title: "Nội dung cũ" },
];
export const NOTE_HISTORY_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "created", width: 85 },
  { columnName: "modified", width: 85 },
  { columnName: "customer_change_by", width: 150 },
  { columnName: "modified_by", width: 150 },
  { columnName: "change_operation", width: 100 },
  { columnName: "new_note", width: 180 },
  { columnName: "old_note", width: 180 },
];

export const CARRIES_MEMBER_COLUMNS = filter(
  RANK_COLUMNS,
  (item) => item.name !== "modified_status"
);
export const CARRIES_MEMBER_COLUMN_WIDTHS = filter(
  RANK_COLUMNS_WIDTH,
  (item) => item.columnName !== "modified_status"
);

export const CUSTOMER_CARE_STAFF_HISTORY_COLUMNS: Column[] = [
  { name: "modified", title: "Ngày chỉnh sửa" },
  { name: "modified_care_staff_by", title: "Người chỉnh sửa" },
  { name: "customer_care_staff", title: "Người chăm sóc" },
  { name: "datetime_modified_care_staff", title: "Thời gian bắt đầu tính chăm sóc" },
];
export const CUSTOMER_CARE_STAFF_HISTORY_COLUMNS_WIDTH: TableColumnWidthInfo[] = [
  { columnName: "modified", width: 85 },
  { columnName: "customer_care_staff", width: 150 },
  { columnName: "modified_care_staff_by", width: 150 },
  { columnName: "datetime_modified_care_staff", width: 150 },
];
