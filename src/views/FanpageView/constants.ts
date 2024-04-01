import { ColumnShow } from "_types_/FacebookType";
export type StatusSyncType = "OH" | "IP" | "RJ" | "CO";

export const statusSync = {
  OH: "OH",
  IP: "IP",
  RJ: "RJ",
  CO: "CO",
};

export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_MESSAGE: "UPDATE_MESSAGE",
  UPDATE_CONVERSATION: "UPDATE_CONVERSATION",
  UPDATE_COMMENT: "UPDATE_COMMENT",
  UPDATE_FANPAGE: "UPDATE_FANPAGE",
  UPDATE_POST: "UPDATE_POST",
  RESIZE_COLUMN_CONVERSAION: "RESIZE_COLUMN_CONVERSAION",
  RESIZE_COLUMN_COMMENT: "RESIZE_COLUMN_COMMENT",
  RESIZE_COLUMN_MESSAGE: "RESIZE_COLUMN_MESSAGE",
  RESIZE_COLUMN_FANPAGE: "RESIZE_COLUMN_FANPAGE",
  RESIZE_COLUMN_POST: "RESIZE_COLUMN_POST",
  UPDATE_COLUMN_ORDER_CONVERSATION: "UPDATE_COLUMN_ORDER_CONVERSATION",
  UPDATE_COLUMN_ORDER_COMMENT: "UPDATE_COLUMN_ORDER_COMMENT",
  UPDATE_COLUMN_ORDER_MESSAGE: "UPDATE_COLUMN_ORDER_MESSAGE",
  UPDATE_COLUMN_ORDER_FANPAGE: "UPDATE_COLUMN_ORDER_FANPAGE",
  UPDATE_COLUMN_ORDER_POST: "UPDATE_COLUMN_ORDER_POST",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
};

export const columnShowPost: ColumnShow = {
  columnWidths: [
    { width: 200, columnName: "thumb_img" },
    { width: 200, columnName: "type" },
    { width: 200, columnName: "fb_page" },
    { width: 150, columnName: "created_time" },
    { width: 150, columnName: "updated_time" },
    { width: 150, columnName: "icon" },
  ],
  columnsShowHeader: [
    { title: "Ngày tạo", name: "created_time", isShow: true },
    { title: "Ngày cập nhật", name: "updated_time", isShow: true },
    { title: "Nội dung", name: "thumb_img", isShow: true },
    { title: "Loại bài viết", name: "type", isShow: true },
    { title: "Fanpage", name: "fb_page", isShow: true },
    { title: "Icon", name: "icon", isShow: true },
  ],
};

export const columnShowMessage: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "message" },
    { width: 150, columnName: "sender_name" },
    { width: 150, columnName: "phone" },
    { width: 150, columnName: "created_time" },
    { width: 150, columnName: "fb_conversations" },
  ],
  columnsShowHeader: [
    { title: "Tin nhắn", name: "message", isShow: true },
    { title: "Tên người gửi", name: "sender_name", isShow: true },
    { title: "Số điện thoại", name: "phone", isShow: true },
    { title: "Ngày cập nhật", name: "created_time", isShow: true },
    { title: "Cuộc hội thoại", name: "fb_conversations", isShow: true },
  ],
};

export const columnShowConversation: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "updated_time" },
    { width: 150, columnName: "fb_page" },
    { width: 150, columnName: "sender_id" },
    { width: 150, columnName: "sender_name" },
  ],
  columnsShowHeader: [
    { title: "Ngày cập nhật", name: "updated_time", isShow: true },
    { title: "Fanpage", name: "fb_page", isShow: true },
    { title: "ID người gửi", name: "sender_id", isShow: true },
    { title: "Tên người gửi", name: "sender_name", isShow: true },
  ],
};

export const columnShowComment: ColumnShow = {
  columnWidths: [
    { width: 150, columnName: "created_time" },
    { width: 150, columnName: "thumb_img" },
    { width: 200, columnName: "message" },
    { width: 200, columnName: "phone" },
  ],
  columnsShowHeader: [
    { title: "Ngày tạo", name: "created_time", isShow: true },
    { title: "Bài viết", name: "thumb_img", isShow: true },
    { title: "Tin nhắn", name: "message", isShow: true },
    { title: "SĐT", name: "phone", isShow: true },
  ],
};
