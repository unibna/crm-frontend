import { ColumnShow, ColumnShowDatagrid, FacebookType } from "_types_/FacebookType";
import {
  InventorySheetDetailType,
  InventoryType,
  TypeWarehouseSheet,
  WarehouseLogs,
} from "_types_/WarehouseType";
import { ColumnTypeDefault } from "_types_/ColumnType";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { fDateTime } from "utils/dateUtil";
import { TYPE_DATA, TYPE_FORM_FIELD } from "constants/index";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import startOfMonth from "date-fns/startOfMonth";

// Components
import { ROLE_TAB, STATUS_ROLE_WAREHOUSE } from "constants/rolesTab";

//icons
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import PublishIcon from "@mui/icons-material/Publish";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import DifferenceIcon from "@mui/icons-material/Difference";
import HistoryIcon from "@mui/icons-material/History";
import { PATH_DASHBOARD } from "routes/paths";
import { isMatchRoles } from "utils/roleUtils";
import { UserType } from "_types_/UserType";
import vi from "locales/vi.json";

export const keyFilter = {
  IS_CONFIRM: "IS_CONFIRM",
  REASON: "REASON",
  IS_DRAFT: "IS_DRAFT",
  SHEET_TYPE: "SHEET_TYPE",
  WAREHOUSE: "WAREHOUSE",
  IS_DELETED: "IS_DELETED",
};

export const columnEditExtensionsWarehouseCheck = [
  { columnName: "variant_batch", editingEnabled: false },
  { columnName: "system_quantity", editingEnabled: false },
  { columnName: "quantity", editingEnabled: false },
  { columnName: "expiry_date", editingEnabled: false },
  { columnName: "variant", editingEnabled: false },
  { columnName: "thumb_img", editingEnabled: false },
  { columnName: "different", editingEnabled: false },
  { columnName: "SKU_code", editingEnabled: false },
];

export enum NameSheetWarehouse {
  IP = "Nhập hàng",
  EP = "Xuất hàng",
  TF = "Chuyển hàng",
  IV = "Kiểm hàng",
}

export enum NameSheet {
  IP = "Phiếu nhập",
  EP = "Phiếu xuất",
  TF = "Phiếu chuyển",
  IV = "Phiếu kiểm",
}

export const NameSheetOperation = {
  [STATUS_ROLE_WAREHOUSE.IMPORTS]: "Nhập hàng",
  [STATUS_ROLE_WAREHOUSE.EXPORTS]: "Xuất hàng",
  [STATUS_ROLE_WAREHOUSE.TRANSFER]: "Chuyển hàng",
  [STATUS_ROLE_WAREHOUSE.STOCKTAKING]: "Kiểm hàng",
};

export const detailWarehouseCheck: InventorySheetDetailType = {
  note: "",
  system_quantity: 0,
  actual_quantity: 0,
  warehouse: "",
  different: 0,
  variant_batch: "",
};

export const dataRenderInfomationWarehouseSheet = [
  { label: "Ngày tạo", value: "created", type: TYPE_DATA.DATE_TIME },
  { label: "Người tạo", value: "created_by" },
  { label: "Ngày xác nhận", value: "confirmed_date", type: TYPE_DATA.DATE_TIME },
  { label: "Người xác nhận", value: "confirmed_by" },
  { label: "Mã đơn hàng", value: "order_key", type: TYPE_DATA.LINK },
  { label: "Lý do", value: "sheet_reason", type: "" },
  { label: "Đã xác nhận", value: "is_confirm", type: TYPE_DATA.STATUS },
  { label: "Trạng thái", value: "is_deleted", type: TYPE_DATA.LABEL },
  { label: "Ghi chú", value: "note", type: TYPE_DATA.TEXTFIELD },
];

export const titlePopupHandle = {
  IMPORTS: "Nhập hàng",
  EXPORTS: "Xuất hàng",
  TRANSFER: "Chuyển kho",
  STOCKTAKING: "Kiểm kho",
  CREATE_BATCH: "Thêm lô",
  EDIT_BATCH: "Chỉnh sửa lô",
  CREATE_WAREHOUSE: "Tạo",
  EDIT_WAREHOUSE: "Chỉnh sửa",
  SELECT_WAREHOUSE: "Chọn kho",
  INFORMATION_WAREHOUSE: "Thông tin",
  ADD_IMPORTS_REASON: "Thêm lí do nhập hàng",
  EDIT_IMPORTS_REASON: "Chỉnh sửa lí do nhập hàng",
  ADD_EXPORTS_REASON: "Thêm lí do xuất hàng",
  EDIT_EXPORTS_REASON: "Chỉnh sửa lí do xuất hàng",
  ADD_TRANSFER_REASON: "Thêm lí do chuyển hàng",
  EDIT_TRANSFER_REASON: "Chỉnh sửa lí do chuyển hàng",
  ADD_STOCKTAKING_REASON: "Thêm lí do kiểm hàng",
  EDIT_STOCKTAKING_REASON: "Chỉnh sửa lí do kiểm hàng",
};

export const typeHandle = {
  IMPORTS: TypeWarehouseSheet.IMPORTS,
  EXPORTS: TypeWarehouseSheet.EXPORTS,
  STOCKTAKING: TypeWarehouseSheet.STOCKTAKING,
  IMPORTS_REASON: "IMPORTS_REASON",
  EXPORTS_REASON: "EXPORTS_REASON",
  TRANSFER_REASON: "TRANSFER_REASON",
  STOCKTAKING_REASON: "STOCKTAKING_REASON",
  TRANSFER: TypeWarehouseSheet.TRANSFER,
  CREATE_BATCH: "CREATE_BATCH",
  EDIT_BATCH: "EDIT_BATCH",
  CREATE_WAREHOUSE: "CREATE_WAREHOUSE",
  EDIT_WAREHOUSE: "EDIT_WAREHOUSE",
  INFORMATION_WAREHOUSE: "INFORMATION_WAREHOUSE",
  SELECT_WAREHOUSE: "SELECT_WAREHOUSE",
  DEFAULT_WAREHOUSE_SEND: "DEFAULT_WAREHOUSE_SEND",
  DEFAULT_WAREHOUSE_SALE: "DEFAULT_WAREHOUSE_SALE",
};

export const keyDataFilter = {
  [typeHandle.IMPORTS_REASON]: "importReason",
  [typeHandle.EXPORTS_REASON]: "exportReason",
  [typeHandle.TRANSFER_REASON]: "transferReason",
  [typeHandle.STOCKTAKING_REASON]: "stocktakingReason",
};

export const message: any = {
  [typeHandle.IMPORTS]: {
    OPERATION_SUCCESS: "Nhập hàng thành công",
    OPERATION_FAILED: "Nhập hàng thất bại",
  },
  [typeHandle.EXPORTS]: {
    OPERATION_SUCCESS: "Xuất hàng thành công",
    OPERATION_FAILED: "Xuất hàng thất bại",
  },
  [typeHandle.TRANSFER]: {
    OPERATION_SUCCESS: "Chuyển hàng thành công",
    OPERATION_FAILED: "Chuyển hàng thất bại",
  },
  [typeHandle.STOCKTAKING]: {
    OPERATION_SUCCESS: "Kiểm hàng thành công",
    OPERATION_FAILED: "Kiểm hàng thất bại",
  },
  [typeHandle.CREATE_BATCH]: {
    OPERATION_SUCCESS: "Thêm lô mới thành công",
    OPERATION_FAILED: "Thêm lô mới thất bại",
  },
  [typeHandle.EDIT_BATCH]: {
    OPERATION_SUCCESS: "Nhập lô thành công",
    OPERATION_FAILED: "Nhập lô thất bại",
  },
  [typeHandle.CREATE_WAREHOUSE]: {
    OPERATION_SUCCESS: "Tạo kho thành công",
    OPERATION_FAILED: "Tạo kho thất bại",
  },
  [typeHandle.EDIT_WAREHOUSE]: {
    OPERATION_SUCCESS: "Chỉnh sửa kho thành công",
    OPERATION_FAILED: "Chỉnh sửa kho thất bại",
  },
  non_field_errors: "Đã tồn tại. Vui lòng nhập lại",
  INVENTORY_REQUIRED: "Vui lòng nhập lô cho sản phẩm",
  UPDATE_SUCCESS: "Cập nhật thành công",
  NOT_ENOUGH_QUANTITY: "Không đủ số lượng",
  INPUT_NOTE: "Vui lòng nhập ghi chú",
  CONFIRM_SUCCESS: "Xác nhận thành công",
  CONFIRM_FAILED: "Xác nhận thất bại",
  [typeHandle.IMPORTS_REASON]: {
    OPERATION_SUCCESS: "Thao tác thành công",
    OPERATION_FAILED: "Thao tác thất bại",
  },
  [typeHandle.EXPORTS_REASON]: {
    OPERATION_SUCCESS: "Thao tác thành công",
    OPERATION_FAILED: "Thao tác thất bại",
  },
  [typeHandle.TRANSFER_REASON]: {
    OPERATION_SUCCESS: "Thao tác thành công",
    OPERATION_FAILED: "Thao tác thất bại",
  },
};

export const tabHeader = {
  IMPORTS: "imports",
  LIST_WAREHOUSE: "listWarehouse",
  EXPORTS: "exports",
  TRANSFER: "transfer",
  STOCKTAKING: "stocktaking",
  ATTRIBUTES: "attributes",
};

export const contentRenderDefault: any = {
  [titlePopupHandle.CREATE_WAREHOUSE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Kho",
      placeholder: "Nhập tên kho",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "address",
      label: "Địa chỉ",
      placeholder: "Nhập địa chỉ",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "description",
      label: "Mô tả",
      placeholder: "Nhập mô tả",
    },
  ],
  [titlePopupHandle.EDIT_WAREHOUSE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Kho",
      placeholder: "Nhập tên kho",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "address",
      label: "Địa chỉ",
      placeholder: "Nhập địa chỉ",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "description",
      label: "Mô tả",
      placeholder: "Nhập mô tả",
    },
  ],
  [titlePopupHandle.ADD_IMPORTS_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do nhập hàng",
      placeholder: "Nhập lí do",
    },
  ],
  [titlePopupHandle.EDIT_IMPORTS_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do nhập hàng",
      placeholder: "Nhập lí do",
    },
  ],
  [titlePopupHandle.ADD_EXPORTS_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do xuất hàng",
      placeholder: "Nhập lí do",
    },
  ],
  [titlePopupHandle.EDIT_EXPORTS_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do xuất hàng",
      placeholder: "Nhập lí do",
    },
  ],
  [titlePopupHandle.ADD_TRANSFER_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do chuyển hàng",
      placeholder: "Nhập lí do",
    },
  ],
  [titlePopupHandle.EDIT_TRANSFER_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do chuyển hàng",
      placeholder: "Nhập lí do",
    },
  ],
  [titlePopupHandle.ADD_STOCKTAKING_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do kiểm hàng",
      placeholder: "Nhập lí do",
    },
  ],
  [titlePopupHandle.EDIT_STOCKTAKING_REASON]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Lí do kiểm hàng",
      placeholder: "Nhập lí do",
    },
  ],
};

export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_NAME: "UPDATE_NAME",
  UPDATE_COLUMNS_REPORT: "UPDATE_COLUMNS_REPORT",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
  UPDATE_SHOW_FULL_TABLE: "UPDATE_SHOW_FULL_TABLE",
  UPDATE_DATA_FILTER: "UPDATE_DATA_FILTER",
  UPDATE_TAB_HEADER: "UPDATE_TAB_HEADER",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_PARAMS_FILTER: "UPDATE_PARAMS_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_DATA_POPUP: "UPDATE_DATA_POPUP",
  UPDATE_IMPORTS: "UPDATE_IMPORTS",
  UPDATE_EXPORTS: "UPDATE_EXPORTS",
  UPDATE_TRANSFER: "UPDATE_TRANSFER",
  UPDATE_STOCKTAKING: "UPDATE_STOCKTAKING",
  UPDATE_LIST_WAREHOUSE: "UPDATE_LIST_WAREHOUSE",
  UPDATE_SCAN_LOGS: "UPDATE_SCAN_LOGS",
  RESIZE_COLUMN_IMPORTS: "RESIZE_COLUMN_IMPORTS",
  RESIZE_COLUMN_EXPORTS: "RESIZE_COLUMN_EXPORTS",
  RESIZE_COLUMN_TRANSFER: "RESIZE_COLUMN_TRANSFER",
  RESIZE_COLUMN_STOCKTAKING: "RESIZE_COLUMN_STOCKTAKING",
  RESIZE_COLUMN_LIST_WAREHOUSE: "RESIZE_COLUMN_LIST_WAREHOUSE",
  RESIZE_COLUMN_SCAN_LOGS: "RESIZE_COLUMN_SCAN_LOGS",
  UPDATE_COLUMN_ORDER_IMPORTS: "UPDATE_COLUMN_ORDER_IMPORTS",
  UPDATE_COLUMN_ORDER_EXPORTS: "UPDATE_COLUMN_ORDER_EXPORTS",
  UPDATE_COLUMN_ORDER_TRANSFER: "UPDATE_COLUMN_ORDER_TRANSFER",
  UPDATE_COLUMN_ORDER_STOCKTAKING: "UPDATE_COLUMN_ORDER_STOCKTAKING",
  UPDATE_COLUMN_ORDER_LIST_WAREHOUSE: "UPDATE_COLUMN_ORDER_LIST_WAREHOUSE",
  UPDATE_COLUMN_ORDER_SCAN_LOGS: "UPDATE_COLUMN_ORDER_SCAN_LOGS",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_COLUMN_SELECTED_IMPORTS: "UPDATE_COLUMN_SELECTED_IMPORTS",
  UPDATE_COLUMN_SELECTED_EXPORTS: "UPDATE_COLUMN_SELECTED_EXPORTS",
  UPDATE_COLUMN_SELECTED_TRANSFER: "UPDATE_COLUMN_SELECTED_TRANSFER",
  UPDATE_COLUMN_SELECTED_STOCKTAKINGS: "UPDATE_COLUMN_SELECTED_STOCKTAKINGS",
  UPDATE_COLUMN_SELECTED_SCAN_LOGS: "UPDATE_COLUMN_SELECTED_SCAN_LOGS",
  UPDATE_POPUP: "UPDATE_POPUP",
};

export const columnShowDefault: ColumnShow = {
  columnWidths: [
    { columnName: "created", width: 150 },
    { columnName: "created_by", width: 180 },
    { columnName: "is_confirm", width: 150 },
    { columnName: "note", width: 150 },
    { columnName: "code", width: 150 },
    { columnName: "sheet_reason", width: 150 },
    { columnName: "confirmed_by", width: 150 },
    { columnName: "confirmed_date", width: 150 },
    { columnName: "isCheck", width: 50 },
    { columnName: "order_number", width: 150 },
  ],
  columnsShowHeader: [
    { name: "isCheck", title: "Chọn", isShow: true },
    { name: "created", title: "Ngày tạo", isShow: true },
    { name: "created_by", title: "Người tạo", isShow: true },
    { name: "code", title: "Mã phiếu", isShow: true },
    { name: "order_number", title: "Mã đơn hàng", isShow: true },
    { name: "is_confirm", title: "Đã xác nhận", isShow: true },
    { name: "sheet_reason", title: "Lí do", isShow: true },
    { name: "note", title: "Ghi chú", isShow: true },
    { name: "confirmed_by", title: "Người xác nhận", isShow: true },
    { name: "confirmed_date", title: "Ngày xác nhận", isShow: true },
  ],
};

export const columnShowImports: ColumnShow = {
  columnWidths: columnShowDefault.columnWidths,
  columnsShowHeader: columnShowDefault.columnsShowHeader,
};

export const columnShowExports: ColumnShow = {
  columnWidths: columnShowDefault.columnWidths,
  columnsShowHeader: columnShowDefault.columnsShowHeader,
};

export const columnShowTransfer: ColumnShow = {
  columnWidths: columnShowDefault.columnWidths,
  columnsShowHeader: columnShowDefault.columnsShowHeader,
};

export const columnShowStocktaking: ColumnShow = {
  columnWidths: [...columnShowDefault.columnWidths, { columnName: "warehouse", width: 150 }],
  columnsShowHeader: [
    ...columnShowDefault.columnsShowHeader,
    {
      name: "warehouse",
      title: "Kho",
      isShow: true,
    },
  ],
};

export const columnShowDetailDefaultWidths = [
  { columnName: "variant", width: 500 },
  { columnName: "warehouse", width: 130 },
  { columnName: "batch", width: 130 },
  { columnName: "quantity", width: 130 },
];

export const columnShowHeaderDetailSheetDefault: ColumnTypeDefault<any>[] = [
  { name: "variant", title: "Sản phẩm", isShow: true },
  { name: "warehouse", title: "Kho", isShow: true },
  { name: "batch", title: "Lô", isShow: true },
];

export const columnShowDetailSheet: ColumnShowDatagrid<any> = {
  columnWidths: columnShowDetailDefaultWidths,
  columnsShowHeader: columnShowHeaderDetailSheetDefault,
  columnShowTable: [
    {
      title: "Sản phẩm",
      name: "variant_name",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "SKU",
      name: "SKU_code",
      column: "variant",
      isShow: true,
    },
    {
      title: "Tên lô",
      name: "batch_name",
      column: "batch",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Số lượng",
      name: "quantity",
      column: "batch",
      isShow: true,
    },
    {
      title: "Hạn sử dụng",
      name: "expiry_date",
      column: "batch",
      isShow: true,
    },
    {
      title: "Kho",
      name: "warehouse",
      column: "warehouse",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const columnShowDetailSheetStocktaking: ColumnShowDatagrid<any> = {
  columnWidths: columnShowDetailDefaultWidths,
  columnsShowHeader: [
    ...columnShowHeaderDetailSheetDefault,
    {
      name: "quantity",
      title: "Số lượng",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      title: "Sản phẩm",
      name: "variant_name",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "SKU",
      name: "SKU_code",
      column: "variant",
      isShow: true,
    },
    {
      title: "Tên lô",
      name: "batch_name",
      column: "batch",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Hạn sử dụng",
      name: "expiry_date",
      column: "batch",
      isShow: true,
    },
    {
      title: "SL chênh lệch",
      name: "quantity",
      column: "quantity",
      isShow: true,
    },
    {
      title: "SL thực",
      name: "actual_quantity",
      column: "quantity",
      isShow: true,
    },
    {
      title: "SL hệ thống",
      name: "system_quantity",
      column: "quantity",
      isShow: true,
    },
    {
      title: "Kho",
      name: "warehouse",
      column: "warehouse",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

// List warehouse
export const columnShowListWarehouse: ColumnShow = {
  columnWidths: [
    { columnName: "name", width: 150 },
    { columnName: "is_default", width: 150 },
    { columnName: "is_sales", width: 150 },
    { columnName: "address", width: 600 },
    { columnName: "description", width: 200 },
    { columnName: "operation", width: 150 },
    { columnName: "manager_name", width: 200 },
    { columnName: "manager_phone", width: 150 },
  ],
  columnsShowHeader: [
    { name: "name", title: vi.warehouse, isShow: true },
    { name: "address", title: vi.address, isShow: true },
    { name: "is_default", title: vi.from_warehouse, isShow: true },
    { name: "is_sales", title: vi.buy_warehouse, isShow: true },
    { name: "manager_name", title: vi.manager, isShow: true },
    { name: "manager_phone", title: vi.phone, isShow: true },
    { name: "description", title: vi.description, isShow: true },
    { name: "operation", title: vi.action, isShow: true },
  ],
};

export const columnShowListWarehouseDetailInventory: ColumnShowDatagrid<InventoryType> = {
  columnWidths: [
    { columnName: "variant_batch", width: 100 },
    { columnName: "quantity", width: 120 },
    { columnName: "expiry_date", width: 150 },
    { columnName: "variant", width: 600 },
  ],
  columnsShowHeader: [
    { name: "variant", title: vi.product.product, isShow: true },
    { name: "variant_batch", title: "Lô", isShow: true },
    { name: "quantity", title: "Tồn kho", isShow: true },
    { name: "expiry_date", title: "Hạn sử dụng", isShow: true },
  ],
  columnShowTable: [
    {
      name: "variant",
      column: "variant",
      title: vi.product.product,
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "variant_batch",
      column: "variant_batch",
      title: "Lô",
      isShowTitle: false,
      isShow: true,
    },
    { name: "quantity", column: "quantity", title: "Tồn kho", isShowTitle: false, isShow: true },
    {
      name: "expiry_date",
      column: "expiry_date",
      title: "Hạn sử dụng",
      isShowTitle: false,
      isShow: true,
    },
  ],
};

export const columnShowListWarehouseDetailInventoryHistory: ColumnShow = {
  columnWidths: [
    { columnName: "history_date", width: 150 },
    { columnName: "history_type", width: 150 },
    { columnName: "quantity", width: 150 },
  ],
  columnsShowHeader: [
    { name: "history_date", title: "Thời gian", isShow: true },
    { name: "quantity", title: "Số lượng", isShow: true },
    { name: "history_type", title: "Loại thao tác", isShow: true },
  ],
};

export const columnShowListWarehouseLogs: ColumnShowDatagrid<WarehouseLogs> = {
  columnWidths: [
    { columnName: "SKU", width: 200 },
    { columnName: "variant_batch", width: 100 },
    { columnName: "created", width: 180 },
    { columnName: "variant", width: 400 },
    { columnName: "quantity", width: 130 },
    { columnName: "sheet_code", width: 130 },
    { columnName: "is_draft", width: 180 },
    { columnName: "sheet", width: 120 },
    { columnName: "confirmed_by", width: 150 },
    { columnName: "confirmed_date", width: 150 },
    { columnName: "warehouse_name", width: 150 },
    { columnName: "note", width: 150 },
  ],
  columnsShowHeader: [
    { name: "SKU", title: "SKU", isShow: true },
    { name: "variant", title: "Sản phẩm", isShow: true },
    { name: "variant_batch", title: "Lô", isShow: true },
    { name: "quantity", title: "Số lượng", isShow: true },
    { name: "is_draft", title: "Trạng thái", isShow: true },
    { name: "sheet", title: "Phiếu kho", isShow: true },
    { name: "sheet_code", title: "Mã phiếu kho", isShow: true },
    { name: "created", title: "Ngày tạo", isShow: true },
    { name: "confirmed_by", title: "Người xác nhận", isShow: true },
    { name: "confirmed_date", title: "Ngày xác nhận", isShow: true },
    { name: "warehouse_name", title: "Kho", isShow: true },
    { name: "note", title: "Ghi chú", isShow: true },
  ],
  columnShowTable: [
    { name: "SKU", column: "SKU", title: "SKU", isShowTitle: false, isShow: true },
    { name: "variant", column: "variant", title: "Sản phẩm", isShowTitle: false, isShow: true },
    {
      name: "variant_batch",
      column: "variant_batch",
      title: "Lô",
      isShowTitle: false,
      isShow: true,
    },
    { name: "quantity", column: "quantity", title: "Số lượng", isShowTitle: false, isShow: true },
    {
      name: "is_draft",
      column: "is_draft",
      title: "Trạng thái xác nhận",
      isShowTitle: false,
      isShow: true,
    },
    { name: "sheet", column: "sheet", title: "Phiếu kho", isShowTitle: false, isShow: true },
    {
      name: "sheet_code",
      column: "sheet_code",
      title: "Mã phiếu kho",
      isShowTitle: false,
      isShow: true,
    },
    { name: "created", column: "created", title: "Ngày tạo", isShowTitle: false, isShow: true },
    {
      name: "confirmed_by",
      column: "confirmed_by",
      title: "Người xác nhận",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "confirmed_date",
      column: "confirmed_date",
      title: "Ngày xác nhận",
      isShowTitle: false,
      isShow: true,
    },
    {
      name: "warehouse_name",
      column: "warehouse_name",
      title: "Kho",
      isShowTitle: false,
      isShow: true,
    },
    { name: "note", column: "note", title: "Ghi chú", isShowTitle: false, isShow: true },
  ],
};

export const columnShowListProductStocking: ColumnShow = {
  columnWidths: [
    { columnName: "variant_batch", width: 120 },
    { columnName: "system_quantity", width: 120 },
    { columnName: "expiry_date", width: 110 },
    { columnName: "variant", width: 200 },
    { columnName: "thumb_img", width: 100 },
    { columnName: "actual_quantity", width: 120 },
    { columnName: "different", width: 120 },
    { columnName: "note_show", width: 120 },
    { columnName: "SKU_code", width: 120 },
  ],
  columnsShowHeader: [
    { name: "thumb_img", title: "Ảnh sản phẩm", isShow: true },
    { name: "variant", title: "Sản phẩm", isShow: true },
    { name: "SKU_code", title: "SKU", isShow: true },
    { name: "variant_batch", title: "Lô", isShow: true },
    { name: "system_quantity", title: "Tồn kho", isShow: true },
    { name: "actual_quantity", title: "Tồn thực tế", isShow: true },
    { name: "different", title: "Lệch", isShow: true },
    { name: "note_show", title: "Ghi chú", isShow: true },
    { name: "expiry_date", title: "Hạn sử dụng", isShow: true },
  ],
};

// Report Inventory
export const columnShowReportInventory: ColumnShow = {
  columnWidths: [
    { columnName: "product_name", width: 550 },
    { columnName: "product_SKU_code", width: 200 },
    { columnName: "product_last_inventory", width: 150 },
    { columnName: "product_first_inventory", width: 150 },
    { columnName: "product_c_import", width: 150 },
    { columnName: "product_c_export", width: 150 },
  ],
  columnsShowHeader: [
    { name: "product_name", title: "Sản phẩm", isShow: true },
    { name: "product_SKU_code", title: "SKU", isShow: true },
    { name: "product_first_inventory", title: "Tồn kho đầu", isShow: true },
    { name: "product_c_import", title: "Số lượng nhập", isShow: true },
    { name: "product_c_export", title: "Số lượng xuất", isShow: true },
    { name: "product_last_inventory", title: "Tồn kho cuối", isShow: true },
  ],
};

export const columnShowReportInventoryDetailVariant: ColumnShow = {
  columnWidths: [
    { columnName: "variant_name", width: 530 },
    { columnName: "variant_SKU_code", width: 200 },
    { columnName: "variant_last_inventory", width: 150 },
    { columnName: "variant_first_inventory", width: 150 },
    { columnName: "variant_c_import", width: 150 },
    { columnName: "variant_c_export", width: 150 },
  ],
  columnsShowHeader: [
    { name: "variant_name", title: "Sản phẩm", isShow: true },
    { name: "variant_SKU_code", title: "SKU", isShow: true },
    { name: "variant_first_inventory", title: "Tồn kho đầu", isShow: true },
    { name: "variant_c_import", title: "Số lượng nhập", isShow: true },
    { name: "variant_c_export", title: "Số lượng xuất", isShow: true },
    { name: "variant_last_inventory", title: "Tồn kho cuối", isShow: true },
  ],
};

export const columnShowReportInventoryDetailBatch: ColumnShow = {
  columnWidths: [
    { columnName: "batch_name", width: 540 },
    { columnName: "expiry_date", width: 200 },
    { columnName: "first_inventory", width: 150 },
    { columnName: "last_inventory", width: 150 },
    { columnName: "c_import", width: 150 },
    { columnName: "c_export", width: 150 },
  ],
  columnsShowHeader: [
    { name: "batch_name", title: "Lô", isShow: true },
    { name: "expiry_date", title: "Hạn sử dụng", isShow: true },
    { name: "first_inventory", title: "Tồn kho đầu", isShow: true },
    { name: "c_import", title: "Số lượng nhập", isShow: true },
    { name: "c_export", title: "Số lượng xuất", isShow: true },
    { name: "last_inventory", title: "Tồn kho cuối", isShow: true },
  ],
};

export const columnShowScanLogs: ColumnShow = {
  columnWidths: [
    { columnName: "scan_at", width: 250 },
    { columnName: "scan_by", width: 250 },
    { columnName: "turn_number", width: 250 },
    { columnName: "count", width: 250 },
  ],
  columnsShowHeader: [
    { name: "scan_at", title: "Thời gian quét", isShow: true },
    { name: "scan_by", title: "Người quét", isShow: true },
    { name: "turn_number", title: "Lần quét", isShow: true },
    { name: "count", title: "Tổng số phiếu", isShow: true },
  ],
};

export const columnShowScanDetailLogs: ColumnShow = {
  columnWidths: [
    { columnName: "scan_at", width: 150 },
    { columnName: "scan_by", width: 150 },
    { columnName: "order_key", width: 150 },
    { columnName: "turn_number", width: 150 },
    { columnName: "type", width: 150 },
    { columnName: "is_success", width: 150 },
    { columnName: "log_message", width: 350 },
  ],
  columnsShowHeader: [
    { name: "scan_at", title: "Thời gian quét", isShow: true },
    { name: "scan_by", title: "Người quét", isShow: true },
    { name: "order_key", title: "Mã quét", isShow: true },
    { name: "turn_number", title: "Lần quét", isShow: true },
    { name: "type", title: "Loại quét", isShow: true },
    { name: "is_success", title: "Đã xác nhận", isShow: true },
    { name: "log_message", title: "Ghi chú", isShow: true },
  ],
};

export const selectLotPopupType = {
  [TypeWarehouseSheet.IMPORTS]: titlePopupHandle.EDIT_BATCH,
  [TypeWarehouseSheet.EXPORTS]: titlePopupHandle.EDIT_BATCH,
  [TypeWarehouseSheet.TRANSFER]: titlePopupHandle.EDIT_BATCH,
};

export const informationWarehouseSheetColumnType = {
  [TypeWarehouseSheet.IMPORTS]: columnShowDetailSheet,
  [TypeWarehouseSheet.EXPORTS]: columnShowDetailSheet,
  [TypeWarehouseSheet.TRANSFER]: columnShowDetailSheet,
  [TypeWarehouseSheet.STOCKTAKING]: columnShowDetailSheetStocktaking,
};

export const dataFilterConfirm = [
  { label: "Tất cả", value: "all" },
  { label: "Đã xác nhận", value: true },
  { label: "Chưa xác nhận", value: false },
];

export const dataFilterSoftDeleted = [
  { label: "Tất cả", value: "all" },
  { label: "Đã hủy", value: "true" },
  { label: "Chưa hủy", value: "false" },
];

export const dataFilterDraft = [
  { label: "Tất cả", value: "all" },
  { label: "Đã xác nhận", value: false },
  { label: "Chưa xác nhận", value: true },
];

export const dataFilterSheetType = [
  { label: "Tất cả", value: "all" },
  { label: "Nhập hàng", value: TypeWarehouseSheet.IMPORTS },
  { label: "Xuất hàng", value: TypeWarehouseSheet.EXPORTS },
  { label: "Chuyển hàng", value: TypeWarehouseSheet.TRANSFER },
  { label: "Kiểm hàng hàng", value: TypeWarehouseSheet.STOCKTAKING },
];

export const paramsDefault = {
  is_deleted: getObjectPropSafely(() => dataFilterSoftDeleted[2].value),
  created_dateValue: -1,
  created_from: format(startOfMonth(new Date()), yyyy_MM_dd),
  created_to: format(new Date(), yyyy_MM_dd),
};

export const handleDataApi = (
  item: Partial<any>,
  columnSelected: string[],
  optional?: { color: string }
) => {
  return {
    order_number: {
      value: item.order_key,
      href: `${window.location.origin}/orders/${item?.order_id}`,
      endpoint: item.order_key,
    },
    code: {
      value: item.code,
      href: `/${STATUS_ROLE_WAREHOUSE.SHEET}/${getObjectPropSafely(() => item.id)}`,
      endpoint: item.code,
      color: optional?.color,
    },
    created_by: getObjectPropSafely(() => item.created_by.name),
    isCheck: columnSelected.includes(item.id),
    sheet_reason: getObjectPropSafely(() => item.sheet_reason.name),
    confirmed_by: getObjectPropSafely(() => item.confirmed_by.name),
    confirmed_date: fDateTime(item.confirmed_date),
  };
};

export const handleDataExport = (column: ColumnTypeDefault<FacebookType>[]) => {
  return column.length
    ? column.reduce((prevArr: any, current: any) => {
        return ["is_confirm"].includes(current.name)
          ? [
              ...prevArr,
              {
                name: current.name,
                title: "Trạng thái",
              },
            ]
          : !["isCheck"].includes(current.name)
          ? [
              ...prevArr,
              {
                name: current.name,
                title: current.title,
              },
            ]
          : prevArr;
      }, [])
    : [];
};

const converValueExport = (columnName: string, value: any) => {
  switch (true) {
    case ["is_confirm"].includes(columnName): {
      return value ? "Đã xác nhận" : "Chưa xác nhận";
    }
    default: {
      return value;
    }
  }
};

export const contentGetValueExport = {
  arrContentGetValue: ["is_confirm"],
  getValue: converValueExport,
};

export const TAB_HEADER_WAREHOUSE = (user: Partial<UserType> | null, roles: any) => [
  {
    label: "Danh sách kho",
    icon: <HolidayVillageIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.LIST_WAREHOUSE]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.LIST_WAREHOUSE]
    ),
  },
  {
    label: "Nhập hàng",
    icon: <PublishIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.IMPORTS]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.IMPORTS]
    ),
  },
  {
    label: "Xuất hàng",
    icon: <PublishIcon style={{ transform: "rotate(180deg)" }} />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.EXPORTS]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.EXPORTS]
    ),
  },
  {
    label: "Chuyển hàng",
    icon: <MoveDownIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.TRANSFER]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.TRANSFER]
    ),
  },
  {
    label: "Kiểm hàng",
    icon: <DifferenceIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.STOCKTAKING]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.STOCKTAKING]
    ),
  },
  {
    label: "Lịch sử quét",
    icon: <HistoryIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.SCAN_LOGS]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.SCAN_LOGS]
    ),
  },
  {
    label: "Lịch sử kho",
    icon: <HistoryIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.WAREHOUSE][STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.WAREHOUSE]?.[STATUS_ROLE_WAREHOUSE.WAREHOUSE_LOGS]
    ),
  },
];

export const defaultHiddenColumns = ["SKU", "warehouse_name", "note"];
