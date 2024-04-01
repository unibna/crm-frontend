import { ContentIdAttachPhoneType } from "_types_/ContentIdType";
import { ColumnShowDatagrid } from "_types_/FacebookType";

export const columnShowAttachPhone: ColumnShowDatagrid<ContentIdAttachPhoneType> = {
  columnWidths: [
    { columnName: "created", width: 150 },
    { columnName: "phones", width: 150 },
    { columnName: "type", width: 150 },
    { columnName: "ad_id", width: 150 },
    { columnName: "content_message", width: 200 },
    { columnName: "page_name", width: 150 },
    { columnName: "content_id", width: 150 },
    { columnName: "content_id_system", width: 200 },
    { columnName: "content_id_final", width: 200 },
    { columnName: "is_conversion_obj", width: 150 },
    { columnName: "operation", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    {
      name: "created",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "phones",
      title: "Số điện thoại",
      isShow: true,
    },
    {
      name: "type",
      title: "Loại",
      isShow: true,
    },
    {
      name: "is_conversion_obj",
      title: "Chuyển đổi",
      isShow: true,
    },
    {
      name: "ad_id",
      title: "Ad ID",
      isShow: true,
    },
    {
      name: "content_id",
      title: "Content ID",
      isShow: true,
    },
    {
      name: "content_message",
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "content_id_final",
      title: "Content ID Final",
      isShow: true,
    },
    {
      name: "content_id_system",
      title: "Content ID System",
      isShow: true,
    },
    {
      name: "page_name",
      title: "Trang",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "operation",
      column: "operation",
      title: "Thao tác",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "created",
      column: "created",
      isShowTitle: false,
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "phone",
      column: "phones",
      isShowTitle: false,
      title: "Số điện thoại",
      isShow: true,
    },
    {
      name: "type",
      column: "type",
      isShowTitle: false,
      title: "Loại",
      isShow: true,
    },
    {
      name: "is_conversion_obj",
      column: "is_conversion_obj",
      isShowTitle: false,
      title: "Chuyển đổi",
      isShow: true,
    },
    {
      name: "ad_id",
      column: "ad_id",
      isShowTitle: false,
      title: "Ad ID",
      isShow: true,
    },
    {
      name: "content_id",
      column: "content_id",
      isShowTitle: false,
      title: "Content ID",
      isShow: true,
    },
    {
      name: "content_message",
      column: "content_message",
      isShowTitle: false,
      title: "Nội dung",
      isShow: true,
    },
    {
      name: "content_id_final",
      column: "content_id_final",
      isShowTitle: false,
      title: "Content ID Final",
      isShow: true,
    },
    {
      name: "content_id_system",
      column: "content_id_system",
      isShowTitle: false,
      title: "Content ID System",
      isShow: true,
    },
    {
      name: "page_name",
      column: "page_name",
      isShowTitle: false,
      title: "Trang",
      isShow: true,
    },
  ],
};
