import find from "lodash/find";
import map from "lodash/map";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { FULL_LEAD_STATUS_OPTIONS } from "views/LeadCenterView/constants";
import { ColumnShowDatagrid } from "_types_/FacebookType";
import { ContentIdPhoneLeadType } from "_types_/ContentIdType";
import { leadStatusColor } from "features/lead/formatStatusColor";

export const columnShowPhoneLead: ColumnShowDatagrid<ContentIdPhoneLeadType> = {
  columnWidths: [
    { columnName: "ad_name", width: 100 },
    { columnName: "phone", width: 150 },
    { columnName: "phone_created", width: 150 },
    { columnName: "lead_status", width: 170 },
    { columnName: "phone_order_number", width: 150 },
    { columnName: "created_time", width: 150 },
    { columnName: "message", width: 150 },
    { columnName: "sender_name", width: 150 },
    { columnName: "campaign_name", width: 250 },
    { columnName: "adset_name", width: 150 },
    { columnName: "is_seeding", width: 150 },
    { columnName: "phone_note", width: 150 },
    { columnName: "phone_reason", width: 150 },
    { columnName: "classification", width: 150 },
  ],
  columnsShowHeader: [
    { name: "ad_name", title: "Content ID", isShow: true },
    { name: "phone", title: "Số điện thoại", isShow: true },
    { name: "phone_created", title: "Thời gian tạo Lead", isShow: true },
    { name: "lead_status", title: "Trạng thái xử lí", isShow: true },
    { name: "phone_note", title: "Ghi chú", isShow: true },
    { name: "classification", title: "Rule phân loại", isShow: true },
    { name: "phone_reason", title: "Lí do", isShow: true },
    { name: "phone_order_number", title: "Đơn hàng", isShow: true },
    { name: "sender_name", title: "Người tạo", isShow: true },
    { name: "campaign_name", title: "Chiến dịch", isShow: true },
    { name: "adset_name", title: "Nhóm quảng cáo", isShow: true },
    { name: "is_seeding", title: "Số seeding", isShow: true },
    { name: "created_time", title: "Thời gian tạo", isShow: true },
    { name: "message", title: "Nội dung", isShow: true },
  ],
  columnShowTable: [
    {
      name: "ad_name",
      column: "ad_name",
      isShowTitle: false,
      title: "Content ID",
      isShow: true,
    },
    {
      name: "phone",
      column: "phone",
      isShowTitle: false,
      title: "Số điện thoại",
      isShow: true,
    },
    {
      name: "phone_created",
      column: "phone_created",
      isShowTitle: false,
      title: "Thời gian tạo Lead",
      isShow: true,
    },
    {
      name: "lead_status",
      column: "lead_status",
      isShowTitle: false,
      title: "Trạng thái xử lí",
      isShow: true,
    },
    {
      name: "phone_note",
      column: "phone_note",
      isShowTitle: false,
      title: "Ghi chú",
      isShow: true,
    },
    {
      name: "classification",
      column: "classification",
      isShowTitle: false,
      title: "Rule phân loại",
      isShow: true,
    },
    {
      name: "phone_reason",
      column: "phone_reason",
      isShowTitle: false,
      title: "Lí do",
      isShow: true,
    },
    {
      name: "phone_order_number",
      column: "phone_order_number",
      isShowTitle: false,
      title: "Đơn hàng",
      isShow: true,
    },
    {
      name: "sender_name",
      column: "sender_name",
      isShowTitle: false,
      title: "Người tạo",
      isShow: true,
    },
    {
      name: "campaign_name",
      column: "campaign_name",
      isShowTitle: false,
      title: "Chiến dịch",
      isShow: true,
    },
    {
      name: "adset_name",
      column: "adset_name",
      isShowTitle: false,
      title: "Nhóm quảng cáo",
      isShow: true,
    },
    {
      name: "is_seeding",
      column: "is_seeding",
      isShowTitle: false,
      title: "Số seeding",
      isShow: true,
    },
    {
      name: "created_time",
      column: "created_time",
      isShowTitle: false,
      title: "Thời gian tạo",
      isShow: true,
    },
    {
      name: "message",
      column: "message",
      isShowTitle: false,
      title: "Nội dung",
      isShow: true,
    },
  ],
};

export const columnEditExtensionsAttachPhone = [
  { columnName: "created", editingEnabled: false },
  { columnName: "phones", editingEnabled: false },
  { columnName: "type", editingEnabled: false },
  { columnName: "content_message", editingEnabled: false },
  { columnName: "page_name", editingEnabled: false },
  { columnName: "content_id_system", editingEnabled: false },
  { columnName: "content_id_final", editingEnabled: false },
  { columnName: "is_conversion_obj", editingEnabled: false },
];

export const columnShowUploadLogs: ColumnShowDatagrid<ContentIdPhoneLeadType> = {
  columnWidths: [
    { columnName: "rule_name", width: 150 },
    { columnName: "created", width: 150 },
    { columnName: "conversion_action_name", width: 150 },
    { columnName: "customer_id", width: 150 },
    { columnName: "uploaded_clicks", width: 100 },
    { columnName: "successful", width: 120 },
    { columnName: "error", width: 270 },
  ],
  columnsShowHeader: [
    { name: "created", title: "Ngày tạo", isShow: true },
    { name: "rule_name", title: "Rule", isShow: true },
    { name: "conversion_action_name", title: "Conversion name", isShow: true },
    { name: "customer_id", title: "Tài khoản", isShow: true },
    { name: "uploaded_clicks", title: "Số lần Upload", isShow: true },
    { name: "successful", title: "Số lần thành công", isShow: true },
    { name: "error", title: "Lỗi thất bại", isShow: true },
  ],
  columnShowTable: [
    { name: "created", column: "created", isShowTitle: false, title: "Ngày tạo", isShow: true },
    { name: "rule_name", column: "rule_name", isShowTitle: false, title: "Rule", isShow: true },
    {
      name: "conversion_action_name",
      column: "conversion_action_name",
      isShowTitle: false,
      title: "Conversion name",
      isShow: true,
    },
    {
      name: "customer_id",
      column: "customer_id",
      isShowTitle: false,
      title: "Tài khoản",
      isShow: true,
    },
    {
      name: "uploaded_clicks",
      column: "uploaded_clicks",
      isShowTitle: false,
      title: "Số lần Upload",
      isShow: true,
    },
    {
      name: "successful",
      column: "successful",
      isShowTitle: false,
      title: "Số lần thành công",
      isShow: true,
    },
    { name: "error", column: "error", isShowTitle: false, title: "Lỗi thất bại", isShow: true },
  ],
};

export const headerFilterTypePhoneLead = [
  { label: "Tất cả", value: "all" },
  { label: "Comment", value: "COMMENT" },
  { label: "Message", value: "INBOX" },
  { label: "FB Ladi", value: "FBLADI" },
  { label: "GG Ladi", value: "GGLADI" },
];

// Handle value
export const handleDataPhoneLead = (item: Partial<any>, optional?: Partial<any>) => {
  const arrClassification = getObjectPropSafely(() =>
    getObjectPropSafely(() => Object.keys(item.classification))
  );
  const status = find(
    FULL_LEAD_STATUS_OPTIONS,
    (current) => current.value === item?.phone_lead_status + ""
  );

  return {
    lead_status: {
      value: status?.label,
      content: (
        <>
          {status?.label ? (
            <Chip
              size="small"
              variant="outlined"
              label={`${status?.label} ${
                item?.phone_data_status ? ` - ${item.phone_data_status}` : ""
              }`}
              style={{
                backgroundColor: leadStatusColor(item?.phone_lead_status, item?.phone_data_status),
                borderColor: leadStatusColor(item?.phone_lead_status, item?.phone_data_status),
                color: "#fff",
              }}
            />
          ) : null}
        </>
      ),
    },
    classification: {
      value: map(arrClassification, (current) => current).join(","),
      content: (
        <Stack spacing={1}>
          {map(arrClassification, (current) => (
            <>
              {getObjectPropSafely(() => item.classification[current]) ? (
                <Chip
                  size="small"
                  label={current}
                  sx={{
                    backgroundColor: find(
                      optional?.dataAttributeRule,
                      (option) => option.name === current
                    )?.colorcode,
                    color: "#fff",
                  }}
                />
              ) : null}
            </>
          ))}
        </Stack>
      ),
    },
  };
};
