import { ColumnShow } from "_types_/FacebookType";

export enum TypeHandle {
  SEND_NOTIFICATION = "SEND_NOTIFICATION",
  IMPORT_EXCEL_ZNS = "IMPORT_EXCEL_ZNS",
  SEND_ZNS = "SEND_ZNS",
  TEMPLATE_MANUAL_OAN_NOTIFICATION = "TEMPLATE_MANUAL_OAN_NOTIFICATION",
  TEMPLATE_MANUAL_ZNS_NOTIFICATION = "TEMPLATE_MANUAL_ZNS_NOTIFICATION",
  TEMPLATE_MANUAL_AUTOMATIC_NOTIFICATION = "TEMPLATE_MANUAL_AUTOMATIC_NOTIFICATION",
}

export enum TitlePopupHandle {
  SEND_NOTIFICATION = "Nhập thông tin gửi thông báo",
  IMPORT_EXCEL_ZNS = "Tải file Excel gửi thông báo ZNS",
  TEMPLATE_MANUAL_OAN_NOTIFICATION = "Template gửi cho tài khoản OAN",
  TEMPLATE_MANUAL_ZNS_NOTIFICATION = "Template gửi cho tài khoản ZNS",
  TEMPLATE_MANUAL_AUTOMATIC_NOTIFICATION = "Template gửi cho tài khoản tự động",
  SEND_ZNS = "Gửi ZNS",
}

export enum TypeNotification {
  OAN = "OAN",
  ZNS = "ZNS",
  DEN = "DEN",
  ORN = "ORN",
  LPN = "LPN",
}

export const contentRenderDefault: any = {};

export const USER_GENDER = {
  "2": "Nữ",
  "1": "Nam",
  "0": "Không xác định",
};

export const keyFilter = {
  ZALO_OA: "ZALO_OA",
  STATUS: "STATUS",
  TYPE: "TYPE",
  RECEIVED: "RECEIVED",
};

export const message: any = {
  [TitlePopupHandle.SEND_NOTIFICATION]: {
    OPERATION_SUCCESS: "Gửi thông báo thành công",
    OPERATION_FAILED: "Gửi thông báo thất bại",
  },
  CHOOSE_ACCOUNT: "Vui lòng chọn ít nhất một tài khoản",
  [TypeHandle.SEND_ZNS]: {
    OPERATION_SUCCESS: "Gửi thông báo thành công",
    OPERATION_FAILED: "Gửi thông báo thất bại",
  },
};

export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_TAB_HEADER: "UPDATE_TAB_HEADER",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_FILTER: "UPDATE_DATA_FILTER",
  UPDATE_OA_FILTER: "UPDATE_OA_FILTER",
  UPDATE_IN_VIEW: "UPDATE_IN_VIEW",
  UPDATE_COLUMN_SELECTED_LIST_ACCOUNT: "UPDATE_COLUMN_SELECTED_LIST_ACCOUNT",
  REFRESH_DATA: "REFRESH_DATA",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_LIST_ACCOUNT: "UPDATE_LIST_ACCOUNT",
  UPDATE_MANUAL_OAN_NOTIFICATION: "UPDATE_MANUAL_OAN_NOTIFICATION",
  UPDATE_MANUAL_ZNS_NOTIFICATION: "UPDATE_MANUAL_ZNS_NOTIFICATION",
  UPDATE_AUTOMATIC_NOTIFICATION: "UPDATE_AUTOMATIC_NOTIFICATION",
  RESIZE_COLUMN_LIST_ACCOUNT: "RESIZE_COLUMN_LIST_ACCOUNT",
  RESIZE_COLUMN_MANUAL_ZNS_NOTIFICATION: "RESIZE_COLUMN_MANUAL_ZNS_NOTIFICATION",
  RESIZE_COLUMN_MANUAL_OAN_NOTIFICATION: "RESIZE_COLUMN_MANUAL_OAN_NOTIFICATION",
  RESIZE_COLUMN_AUTOMATIC_NOTIFICATION: "RESIZE_COLUMN_AUTOMATIC_NOTIFICATION",
  UPDATE_COLUMN_ORDER_LIST_ACCOUNT: "UPDATE_COLUMN_ORDER_LIST_ACCOUNT",
  UPDATE_COLUMN_ORDER_MANUAL_OAN_NOTIFICATION: "UPDATE_COLUMN_ORDER_MANUAL_OAN_NOTIFICATION",
  UPDATE_COLUMN_ORDER_MANUAL_ZNS_NOTIFICATION: "UPDATE_COLUMN_ORDER_MANUAL_ZNS_NOTIFICATION",
  UPDATE_COLUMN_ORDER_AUTOMATIC_NOTIFICATION: "UPDATE_COLUMN_ORDER_AUTOMATIC_NOTIFICATION",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
  UPDATE_SHOW_FULL_TABLE: "UPDATE_SHOW_FULL_TABLE",
};

export const columnShowListAccount: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "created" },
    { width: 200, columnName: "modified" },
    { width: 120, columnName: "user_gender" },
    { width: 140, columnName: "is_follow" },
    { width: 300, columnName: "account" },
    { width: 50, columnName: "isCheck" },
  ],
  columnsShowHeader: [
    { name: "isCheck", title: "Chọn tài khoản", isShow: true },
    { title: "Người theo dõi", name: "account", isShow: true },
    { title: "Giới tính", name: "user_gender", isShow: true },
    { title: "Trạng thái", name: "is_follow", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
  ],
};

export const columnShowManualOanNotification: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "created" },
    { width: 150, columnName: "scheduled_time" },
    { width: 120, columnName: "name" },
    { width: 140, columnName: "type" },
    { width: 120, columnName: "is_sent" },
    { width: 150, columnName: "sent_time" },
    { width: 150, columnName: "total_success" },
    { width: 150, columnName: "total_error" },
    { width: 150, columnName: "total_received" },
    { width: 150, columnName: "total_send" },
    { width: 150, columnName: "created_by" },
    { width: 150, columnName: "thumb_img" },
  ],
  columnsShowHeader: [
    { title: "Ảnh", name: "thumb_img", isShow: true },
    { title: "Tên", name: "name", isShow: true },
    { title: "Loại", name: "type", isShow: true },
    { title: "Thành công", name: "total_success", isShow: true },
    { title: "Thất bại", name: "total_error", isShow: true },
    { title: "Đã nhận ", name: "total_received", isShow: true },
    { title: "Tổng", name: "total_send", isShow: true },
    { title: "Người gửi", name: "created_by", isShow: true },
    { title: "Đã gửi", name: "is_sent", isShow: true },
    { title: "Thời gian hẹn", name: "scheduled_time", isShow: true },
    { title: "Thời gian gửi", name: "sent_time", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
  ],
};

export const columnShowManualZnsNotification: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "created" },
    { width: 150, columnName: "scheduled_time" },
    { width: 120, columnName: "name" },
    { width: 120, columnName: "is_sent" },
    { width: 150, columnName: "sent_time" },
    { width: 140, columnName: "type" },
    { width: 150, columnName: "total_success" },
    { width: 150, columnName: "total_error" },
    { width: 150, columnName: "total_received" },
    { width: 150, columnName: "total_send" },
    { width: 150, columnName: "created_by" },
  ],
  columnsShowHeader: [
    { title: "Tên", name: "name", isShow: true },
    { title: "Loại", name: "type", isShow: true },
    { title: "Thành công", name: "total_success", isShow: true },
    { title: "Thất bại", name: "total_error", isShow: true },
    { title: "Đã nhận ", name: "total_received", isShow: true },
    { title: "Tổng", name: "total_send", isShow: true },
    { title: "Người gửi", name: "created_by", isShow: true },
    { title: "Đã gửi", name: "is_sent", isShow: true },
    { title: "Thời gian hẹn", name: "scheduled_time", isShow: true },
    { title: "Thời gian gửi", name: "sent_time", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
  ],
};

export const columnShowAutomaticNotification: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "phone" },
    { width: 150, columnName: "is_success" },
    { width: 170, columnName: "type" },
    { width: 150, columnName: "is_received" },
    { width: 150, columnName: "reason_error" },
    { width: 150, columnName: "order_number" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
  ],
  columnsShowHeader: [
    { title: "Số điện thoại", name: "phone", isShow: true },
    { title: "Đơn hàng", name: "order_number", isShow: true },
    { title: "Trạng thái", name: "is_success", isShow: true },
    { title: "Loại", name: "type", isShow: true },
    { title: "Đã nhận", name: "is_received", isShow: true },
    { title: "Lí do lỗi", name: "reason_error", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
};

export const columnShowDetailNotificationOanSuccess: ColumnShow = {
  columnWidths: [
    { width: 120, columnName: "user_gender" },
    { width: 140, columnName: "is_follow" },
    { width: 300, columnName: "account" },
    { width: 150, columnName: "is_received" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
    // { width: 150, columnName: "action" }
  ],
  columnsShowHeader: [
    { title: "Người theo dõi", name: "account", isShow: true },
    { title: "Giới tính", name: "user_gender", isShow: true },
    { title: "Trạng thái", name: "is_follow", isShow: true },
    { title: "Đã nhận", name: "is_received", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    // { title: "Hành động", name: "action", isShow: true }
  ],
};

export const columnShowDetailNotificationOanError: ColumnShow = {
  columnWidths: [
    { width: 120, columnName: "user_gender" },
    { width: 140, columnName: "is_follow" },
    { width: 300, columnName: "account" },
    { width: 150, columnName: "reason_error" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
    // { width: 150, columnName: "action" }
  ],
  columnsShowHeader: [
    { title: "Người theo dõi", name: "account", isShow: true },
    { title: "Giới tính", name: "user_gender", isShow: true },
    { title: "Trạng thái", name: "is_follow", isShow: true },
    { title: "Lí do lỗi", name: "reason_error", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    // { title: "Hành động", name: "action", isShow: true }
  ],
};

export const columnShowDetailNotificationOanReceived: ColumnShow = {
  columnWidths: [
    { width: 120, columnName: "user_gender" },
    { width: 140, columnName: "is_follow" },
    { width: 300, columnName: "account" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
    // { width: 150, columnName: "action" }
  ],
  columnsShowHeader: [
    { title: "Người theo dõi", name: "account", isShow: true },
    { title: "Giới tính", name: "user_gender", isShow: true },
    { title: "Trạng thái", name: "is_follow", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    // { title: "Hành động", name: "action", isShow: true }
  ],
};

export const columnShowDetailNotificationZnsSuccess: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "name" },
    { width: 150, columnName: "is_received" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
    // { width: 150, columnName: "action" }
  ],
  columnsShowHeader: [
    { title: "Tên", name: "name", isShow: true },
    { title: "Đã nhận", name: "is_received", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    // { title: "Hành động", name: "action", isShow: true }
  ],
};

export const columnShowDetailNotificationZnsError: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "name" },
    { width: 150, columnName: "is_received" },
    { width: 150, columnName: "reason_error" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
    // { width: 150, columnName: "action" }
  ],
  columnsShowHeader: [
    { title: "Tên", name: "name", isShow: true },
    { title: "Lí do lỗi", name: "reason_error", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    // { title: "Hành động", name: "action", isShow: true }
  ],
};

export const columnShowDetailNotificationZnsReceived: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "name" },
    { width: 200, columnName: "created" },
    { width: 200, columnName: "modified" },
    { columnName: "operation", width: 150 },
    // { width: 150, columnName: "action" }
  ],
  columnsShowHeader: [
    { title: "Tên", name: "name", isShow: true },
    { title: "Thời gian tạo", name: "created", isShow: true },
    { title: "Thời gian chỉnh sửa", name: "modified", isShow: true },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    // { title: "Hành động", name: "action", isShow: true }
  ],
};

export const columnsShowTableExcel: ColumnShow = {
  columnWidths: [
    { width: 80, columnName: "stt" },
    { width: 150, columnName: "phone" },
  ],
  columnsShowHeader: [
    { title: "STT", name: "stt", isShow: true },
    { title: "Số điện thoại", name: "phone", isShow: true },
  ],
};

// Header Filter
export const dataFilterFollow = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đang quan tâm",
    value: true,
  },
  {
    label: "Bỏ quan tâm",
    value: false,
  },
];

export const dataFilterTypeManual = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "OAN",
    value: TypeNotification.OAN,
  },
  {
    label: "ZNS",
    value: TypeNotification.ZNS,
  },
];

export const dataFilterTypeAutomatic = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Thông báo đơn hàng",
    value: TypeNotification.ORN,
  },
  {
    label: "Thông báo vận chuyển",
    value: TypeNotification.DEN,
  },
  {
    label: "Thông báo Ladipage",
    value: TypeNotification.LPN,
  },
];

export const dataFilterStatus = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Thành công",
    value: true,
  },
  {
    label: "Thất bại",
    value: false,
  },
];

export const columnEditExtensionsTableExcel = [{ columnName: "stt", editingEnabled: false }];
