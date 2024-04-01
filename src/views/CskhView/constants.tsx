import { ColumnShowDatagrid } from "_types_/FacebookType";
import { TYPE_FORM_FIELD } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_AIRTABLE } from "constants/rolesTab";
// Components
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { CskhType, HistoryCskhType } from "_types_/CskhType";
import { PATH_DASHBOARD } from "routes/paths";
import { isMatchRoles } from "utils/roleUtils";
import { RouteType } from "components/Tabs";
import { UserType } from "_types_/UserType";

export const typeRenderComponent = {
  DEFAULT: "Quản lí CSKH",
  CREATE: "Tạo mới CSKH",
  EDIT: "Chỉnh sửa CSKH",
};

export const TYPE_ATTRIBUTE = 1;

export const CHANGE_TITLE = {
  product: "Sản phẩm",
  channel: "Kênh",
  solution: "Hướng giải quyết",
  handle_reason: "Lý do xử lý",
  comment: "Cảm nhận của KH",
  solution_description: "Sản phẩm bù/tặng/đổi trả/mua thêm",
  viewer: "Người xem",
  type: "Phân loại",
};

export const optionStatus = [
  {
    label: "Mới",
    value: 1,
    color: "#3366FF",
  },
  {
    label: "Đang xử lý",
    value: 3,
    color: "#1890FF",
  },
  {
    label: "Hoàn thành",
    value: 2,
    color: "#54D62C",
  },
];

export const typeHandleAirtable = {
  ADD_ATTRIBUTES: "add_attributes",
  EDIT_ATTRIBUTES: "edit_attributes",
  ADD_ATTRIBUTES_VALUE: "add_attributes_value",
  EDIT_ATTRIBUTES_VALUE: "edit_attributes_value",
  EDIT_ROW: "edit_row",
  ADD_ROW: "add_row",
};

export const titlePopupHandleAirtable = {
  ADD_ATTRIBUTES: "Thêm thuộc tính",
  EDIT_ATTRIBUTES: "Chỉnh sửa thuộc tính",
  ADD_ATTRIBUTES_VALUE: "Thêm giá trị thuộc tính",
  EDIT_ATTRIBUTES_VALUE: "Chỉnh sửa giá trị thuộc tính",
  EDIT_ROW: "Chỉnh sửa hàng",
  ADD_ROW: "Thêm hàng",
  DELETE_ROW: "Xóa hàng",
};

export const contentRenderDefault: any = {
  [titlePopupHandleAirtable.ADD_ATTRIBUTES]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên thuộc tính *",
      placeholder: "Nhập tên thuộc tính",
    },
  ],
  [titlePopupHandleAirtable.EDIT_ATTRIBUTES]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên thuộc tính *",
      placeholder: "Nhập tên thuộc tính",
    },
  ],
  [titlePopupHandleAirtable.ADD_ATTRIBUTES_VALUE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên giá trị thuộc tính *",
      placeholder: "Nhập tên giá trị thuộc tính",
    },
    {
      type: TYPE_FORM_FIELD.COLOR,
      name: "color",
      label: "Chọn màu *",
      placeholder: "Chọn màu cho thuộc tính",
      nameOptional: "name",
    },
  ],
  [titlePopupHandleAirtable.EDIT_ATTRIBUTES_VALUE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên giá trị thuộc tính *",
      placeholder: "Nhập tên giá trị thuộc tính",
    },
    {
      type: TYPE_FORM_FIELD.COLOR,
      name: "color",
      label: "Chọn màu *",
      placeholder: "Chọn màu cho thuộc tính",
      nameOptional: "name",
    },
  ],
  [titlePopupHandleAirtable.ADD_ROW]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "phone",
      label: "Số điện thoại",
      placeholder: "Nhập số điện thoại",
      required: true,
      typeInput: "phone",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "description",
      label: "Tình trạng",
      placeholder: "Mô tả tình trạng",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "note",
      label: "Note",
      placeholder: "Note",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "order_number",
      label: "Mã đơn hàng (nếu có)",
      placeholder: "Nhập mã đơn hàng",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "link_jira",
      label: "Link Jira",
      placeholder: "Nhập link Jira",
    },
  ],
  [titlePopupHandleAirtable.EDIT_ROW]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "phone",
      label: "Số điện thoại",
      placeholder: "Nhập số điện thoại",
      required: true,
      typeInput: "phone",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "description",
      label: "Tình trạng",
      placeholder: "Mô tả tình trạng",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "note",
      label: "Note",
      placeholder: "Note",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "order_number",
      label: "Mã đơn hàng (nếu có)",
      placeholder: "Nhập mã đơn hàng",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "link_jira",
      label: "Link Jira",
      placeholder: "Nhập link Jira",
    },
  ],
};

export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_DATA_FILTER: "UPDATE_DATA_FILTER",
  UPDATE_TAB_HEADER: "UPDATE_TAB_HEADER",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_PARAMS_FILTER: "UPDATE_PARAMS_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_DATA_POPUP: "UPDATE_DATA_POPUP",
  UPDATE_CSKH: "UPDATE_CSKH",
  RESIZE_COLUMN_CSKH: "RESIZE_COLUMN_CSKH",
  UPDATE_COLUMN_ORDER_CSKH: "UPDATE_COLUMN_ORDER_CSKH",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_POPUP: "UPDATE_POPUP",
  UPDATE_SHOW_FULL_TABLE: "UPDATE_SHOW_FULL_TABLE",
};

export const message = {
  [titlePopupHandleAirtable.ADD_ATTRIBUTES]: {
    OPERATION_SUCCESS: "Thêm thuộc tính thành công",
    OPERATION_FAILED: "Thuộc tính đã tồn tại",
  },
  [titlePopupHandleAirtable.EDIT_ATTRIBUTES]: {
    OPERATION_SUCCESS: "Chỉnh sửa thuộc tính thành công",
    OPERATION_FAILED: "Chỉnh sửa thuộc tính thất bại",
  },
  [titlePopupHandleAirtable.ADD_ATTRIBUTES_VALUE]: {
    OPERATION_SUCCESS: "Thêm giá trị thuộc tính thành công",
    OPERATION_FAILED: "Giá trị thuộc tính đã tồn tại",
  },
  [titlePopupHandleAirtable.EDIT_ATTRIBUTES_VALUE]: {
    OPERATION_SUCCESS: "Chỉnh sửa giá trị thuộc tính thành công",
    OPERATION_FAILED: "Giá trị thuộc tính đã tồn tại",
  },
  [titlePopupHandleAirtable.ADD_ROW]: {
    OPERATION_SUCCESS: "Thêm hàng thành công",
    OPERATION_FAILED: "Thêm hàng thất bại",
  },
  [titlePopupHandleAirtable.EDIT_ROW]: {
    OPERATION_SUCCESS: "Chỉnh sửa hàng thành công",
    OPERATION_FAILED: "Chỉnh sửa hàng thất bại",
  },
};

export const columnShowCskh: ColumnShowDatagrid<CskhType> = {
  columnWidths: [
    // { columnName: "isCheck", width: 50 },
    { columnName: "description", width: 150 },
    { columnName: "phone", width: 150 },
    { columnName: "handle_by", width: 150 },
    { columnName: "note", width: 150 },
    { columnName: "order_number", width: 150 },
    { columnName: "status", width: 150 },
    { columnName: "date_created", width: 110 },
    { columnName: "channel", width: 150 },
    { columnName: "product", width: 150 },
    { columnName: "handle_reason", width: 150 },
    { columnName: "comment", width: 150 },
    { columnName: "solution", width: 150 },
    { columnName: "created", width: 150 },
    { columnName: "modified", width: 150 },
    { columnName: "link_jira", width: 150 },
    { columnName: "solution_description", width: 150 },
    { columnName: "operation", width: 80 },
  ],
  columnsShowHeader: [
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
    {
      name: "date_created",
      title: "Ngày tạo",
      isShow: true,
    },
    {
      name: "phone",
      title: "Số điện thoại",
      isShow: true,
    },
    {
      name: "handle_by",
      title: "Nhân viên xử lý",
      isShow: true,
    },
    {
      name: "description",
      title: "Mô tả tình trạng",
      isShow: true,
    },
    {
      name: "note",
      title: "Note",
      isShow: true,
    },
    {
      name: "order_number",
      title: "Mã đơn hàng",
      isShow: true,
    },
    {
      name: "link_jira",
      title: "Link Jira",
      isShow: true,
    },
    {
      name: "solution_description",
      title: "Sản phẩm bù/tặng/đổi trả/mua thêm",
      isShow: true,
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "channel",
      title: "Kênh",
      isShow: true,
    },
    {
      name: "product",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "handle_reason",
      title: "Phân loại",
      isShow: true,
    },
    {
      name: "solution",
      title: "Hướng xử lý",
      isShow: true,
    },
    {
      name: "comment",
      title: "Cảm nhận của KH",
      isShow: true,
    },
    {
      name: "created",
      title: "Thời gian tạo",
      isShow: true,
    },
    {
      name: "modified",
      title: "Thời gian chỉnh sửa",
      isShow: true,
    },
  ],
  columnShowTable: [],
};

export const columnShowHistoryCskh: ColumnShowDatagrid<HistoryCskhType> = {
  columnWidths: [
    { columnName: "modified_by", width: 150 },
    { columnName: "description", width: 150 },
    { columnName: "phone", width: 150 },
    { columnName: "handle_by", width: 150 },
    { columnName: "note", width: 150 },
    { columnName: "order_number", width: 150 },
    { columnName: "status", width: 150 },
    { columnName: "channel", width: 150 },
    { columnName: "product", width: 150 },
    { columnName: "history_date", width: 150 },
    { columnName: "link_jira", width: 150 },
    { columnName: "history_type", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "history_date",
      title: "Thời gian chỉnh sửa",
      isShow: true,
    },
    {
      name: "modified_by",
      title: "Người chỉnh sửa",
      isShow: true,
    },
    {
      name: "phone",
      title: "Số điện thoại",
      isShow: true,
    },
    {
      name: "handle_by",
      title: "Nhân viên xử lý",
      isShow: true,
    },
    {
      name: "description",
      title: "Mô tả tình trạng",
      isShow: true,
    },
    {
      name: "note",
      title: "Note",
      isShow: true,
    },
    {
      name: "order_number",
      title: "Mã đơn hàng",
      isShow: true,
    },
    {
      name: "link_jira",
      title: "Link Jira",
      isShow: true,
    },
    {
      name: "status",
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "channel",
      title: "Kênh",
      isShow: true,
    },
    {
      name: "product",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "history_type",
      title: "Loại thao tác",
      isShow: true,
    },
  ],
  columnShowTable: [],
};

export const keyFilter = {
  STATUS: "STATUS",
  HANDLE_BY: "HANDLE_BY",
  CHANNEL: "CHANNEL",
  PRODUCT: "PRODUCT",
  HANDLE_REASON: "HANDLE_REASON",
  SOLUTION: "SOLUTION",
  COMMENT: "COMMENT",
  SOLUTION_DESCRIPTION: "SOLUTION_DESCRIPTION",
};

export const headerFilterContentId = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chưa có",
    value: 0,
  },
  {
    label: "Có",
    value: 1,
  },
];

export const dataRenderHeaderShare = [
  {
    style: {
      width: 180,
    },
    status: keyFilter.STATUS,
    title: "Trạng thái",
    options: [
      {
        label: "Tất cả",
        value: "all",
      },
      ...optionStatus,
    ],
    label: "status",
    defaultValue: "all",
  },
];

export const arrNoneRenderSliderFilter = ["created_dateValue", "modified_dateValue"];

export const STATUS_CUSTOMER_CARE_VALUES = {
  [STATUS_ROLE_AIRTABLE.NEW]: 1,
  [STATUS_ROLE_AIRTABLE.COMPLETED]: 2,
  [STATUS_ROLE_AIRTABLE.HANDLING]: 3,
  [STATUS_ROLE_AIRTABLE.ALL]: "",
};

export const TAB_HEADER_CUSTOMER_CARE = (
  user: Partial<UserType> | null,
  roles?: any
): RouteType[] => [
  {
    label: "Tất cả",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CSKH][STATUS_ROLE_AIRTABLE.ALL]}`,
    icon: <PersonIcon />,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CSKH]?.[STATUS_ROLE_AIRTABLE.CSKH]),
  },
  {
    label: "Mới",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CSKH][STATUS_ROLE_AIRTABLE.NEW]}`,
    icon: <PersonAddIcon />,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CSKH]?.[STATUS_ROLE_AIRTABLE.CSKH]),
  },
  {
    label: "Đang xử lý",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CSKH][STATUS_ROLE_AIRTABLE.HANDLING]}`,
    icon: <ManageAccountsIcon />,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CSKH]?.[STATUS_ROLE_AIRTABLE.CSKH]),
  },
  {
    label: "Hoàn thành",
    path: `/${PATH_DASHBOARD[ROLE_TAB.CSKH][STATUS_ROLE_AIRTABLE.COMPLETED]}`,
    icon: <HowToRegIcon />,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.CSKH]?.[STATUS_ROLE_AIRTABLE.CSKH]),
  },
];
