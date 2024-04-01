import { TYPE_FORM_FIELD } from "constants/index";
import { ColumnShow } from "_types_/FacebookType";
import { PATH_DASHBOARD } from "routes/paths";
import { ROLE_TAB, STATUS_ROLE_MANAGE_FILE } from "constants/rolesTab";
import { isMatchRoles } from "utils/roleUtils";

//icons
import ListAltIcon from "@mui/icons-material/ListAlt";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import { UserType } from "_types_/UserType";

export const typeRenderComponent = {
  DEFAULT: "Quản lí CSKH",
  CREATE: "Tạo mới CSKH",
  EDIT: "Chỉnh sửa CSKH",
};

export const TYPE_ATTRIBUTE = 2;

export const CHANGE_TITLE = {
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
  {
    label: "Chưa giải quyết",
    value: 4,
    color: "#FFC107",
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
  EDIT_FILE: "Chỉnh sửa file",
  ADD_FILE: "Thêm file",
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
  [titlePopupHandleAirtable.ADD_FILE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên file",
      placeholder: "Nhập tên file",
      require: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "link",
      label: "Link",
      placeholder: "Nhập link",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "note",
      label: "Ghi chú",
      placeholder: "Nhập ghi chú",
    },
  ],
  [titlePopupHandleAirtable.EDIT_FILE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên fiel",
      placeholder: "Nhập tên file",
      require: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "link",
      label: "Link",
      placeholder: "Nhập link",
      require: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "note",
      label: "Ghi chú",
      placeholder: "Nhập ghi chú",
      require: true,
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
  UPDATE_PARAMS_FILTER: "UPDATE_PARAMS_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_MANAGE: "UPDATE_MANAGE",
  RESIZE_COLUMN_MANAGE: "RESIZE_COLUMN_MANAGE",
  UPDATE_COLUMN_ORDER_MANAGE: "UPDATE_COLUMN_ORDER_MANAGE",
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
  [titlePopupHandleAirtable.ADD_FILE]: {
    OPERATION_SUCCESS: "Thêm file thành công",
    OPERATION_FAILED: "Thêm file thất bại",
  },
  [titlePopupHandleAirtable.EDIT_FILE]: {
    OPERATION_SUCCESS: "Chỉnh sửa file thành công",
    OPERATION_FAILED: "Chỉnh sửa file thất bại",
  },
};

export const columnShowManage: ColumnShow = {
  columnWidths: [
    { columnName: "created", width: 150 },
    { columnName: "modified", width: 150 },
    { columnName: "name", width: 150 },
    { columnName: "link", width: 150 },
    { columnName: "note", width: 150 },
    // { columnName: "account", width: 350 },
    { columnName: "manager", width: 250 },
    { columnName: "viewer", width: 250 },
    { columnName: "type", width: 200 },
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
      name: "modified",
      title: "Ngày chỉnh sửa",
      isShow: true,
    },
    {
      name: "name",
      title: "Tên file",
      isShow: true,
    },
    {
      name: "link",
      title: "Link",
      isShow: true,
    },
    {
      name: "note",
      title: "Ghi chú",
      isShow: true,
    },
    // {
    //   name: "account",
    //   title: "Tài khoản",
    //   isShow: true,
    // },
    {
      name: "manager",
      title: "Quản lí",
      isShow: true,
    },
    {
      name: "viewer",
      title: "Người xem",
      isShow: true,
    },
    {
      name: "type",
      title: "Phân loại",
      isShow: true,
    },
  ],
};

export const columnShowHistoryManage: ColumnShow = {
  columnWidths: [
    { columnName: "name", width: 150 },
    { columnName: "link", width: 150 },
    { columnName: "note", width: 150 },
    // { columnName: "account", width: 350 },
    { columnName: "manager", width: 250 },
    // { columnName: "viewer", width: 250 },
    { columnName: "type", width: 200 },
    { columnName: "operation", width: 100 },
    { columnName: "history_date", width: 170 },
    { columnName: "history_type", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "history_date",
      title: "Thời gian chỉnh sửa",
      isShow: true,
    },
    {
      name: "name",
      title: "Tên file",
      isShow: true,
    },
    {
      name: "link",
      title: "Link",
      isShow: true,
    },
    {
      name: "note",
      title: "Ghi chú",
      isShow: true,
    },
    {
      name: "manager",
      title: "Quản lí",
      isShow: true,
    },
    // {
    //   name: "account",
    //   title: "Tài khoản",
    //   isShow: true,
    // },
    // {
    //   name: "viewer",
    //   title: "Người xem",
    //   isShow: true,
    // },
    {
      name: "type",
      title: "Phân loại",
      isShow: true,
    },
    {
      name: "history_type",
      title: "Loại thao tác",
      isShow: true,
    },
  ],
};

// Data filter

export const keyFilter = {
  MANAGER: "MANAGER",
  VIEWER: "VIEWER",
  TYPE: "TYPE",
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

export const arrNoneRenderSliderFilter = ["created_dateValue", "modified_dateValue"];

export const TAB_HEADER_MANAGE_FILE = (user: Partial<UserType> | null, roles: any) => [
  {
    label: "File",
    path: `/${PATH_DASHBOARD[ROLE_TAB.MANAGE_FILE][STATUS_ROLE_MANAGE_FILE.MANAGE]}`,
    icon: <ListAltIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.MANAGE_FILE]?.[STATUS_ROLE_MANAGE_FILE.MANAGE]
    ),
  },
  {
    label: "Nhóm",
    path: `/${PATH_DASHBOARD[ROLE_TAB.MANAGE_FILE][STATUS_ROLE_MANAGE_FILE.GROUP]}`,
    icon: <AspectRatioIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.MANAGE_FILE]?.[STATUS_ROLE_MANAGE_FILE.GROUP]
    ),
  },
];
