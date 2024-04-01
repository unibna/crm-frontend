import { ColumnShowDatagrid } from "_types_/FacebookType";
import { LabelColor } from "components/Labels/Span";
import { ColumnShow } from "_types_/FacebookType";
import { random } from "utils/randomUtil";
import {
  AttributeVariant,
  ECOMMERCE_PLARFORM,
  HistoryVariant,
  STATUS_PRODUCT,
  VARIANT_TYPE,
} from "_types_/ProductType";
import { TYPE_DATA, TYPE_FORM_FIELD } from "constants/index";
import { ReportOrderType } from "_types_/ReportOrderType";
import { isMatchRoles } from "utils/roleUtils";
import {
  ROLE_TAB,
  STATUS_ROLE_ECOMMERCE,
  STATUS_ROLE_LIST_PRODUCT,
  STATUS_ROLE_PRODUCT,
} from "constants/rolesTab";

//icons
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import TaskIcon from "@mui/icons-material/Task";
import { PATH_DASHBOARD } from "routes/paths";
import { InventoryType } from "_types_/WarehouseType";
import { UserType } from "_types_/UserType";

export const optionFilterOperation = [
  {
    label: "Đang kinh doanh",
    value: STATUS_PRODUCT.ACTIVE,
  },
  {
    label: "Ngừng kinh doanh",
    value: STATUS_PRODUCT.INACTIVE,
  },
];

export const optionPlatformEcommerce: {
  label: string;
  value: ECOMMERCE_PLARFORM;
  color: LabelColor;
}[] = [
  {
    label: "Lazada",
    value: ECOMMERCE_PLARFORM.LAZADA,
    color: "info",
  },
  {
    label: "Tiktok",
    value: ECOMMERCE_PLARFORM.TIKTOK,
    color: "warning",
  },
  {
    label: "Shopee",
    value: ECOMMERCE_PLARFORM.SHOPEE,
    color: "error",
  },
  {
    label: "Tiki",
    value: ECOMMERCE_PLARFORM.TIKI,
    color: "secondary",
  },
];

export const dataRenderInfomationVariant = [
  {
    label: "SKU",
    value: "SKU_code",
  },
  {
    label: "Mã vạch",
    value: "barcode",
  },
  {
    label: "Ngày tạo",
    value: "created",
    type: TYPE_DATA.DATE_TIME,
  },
  {
    label: "Ngày chỉnh sửa",
    value: "modified",
    type: TYPE_DATA.DATE_TIME,
  },
  {
    label: "Người tạo",
    value: "created_by",
  },
  {
    label: "Người chỉnh sửa",
    value: "modified_by",
  },
  // {
  //   label: "Giá mua",
  //   value: "purchase_price",
  //   type: TYPE_DATA.VND,
  // },
  {
    label: "Giá niêm yết",
    value: "neo_price",
    type: TYPE_DATA.VND,
  },
  {
    label: "Mô tả",
    value: "description",
  },
  {
    label: "Giá bán",
    value: "sale_price",
    type: TYPE_DATA.VND,
  },
];

export const typeAttribute = {
  TITLE: "TITLE",
  WEIGHT: "WEIGHT",
  VOLUME: "VOLUME",
};

export const typeRenderComponent = {
  DEFAULT: "Quản lí sản phẩm",
  CREATE: "Tạo mới sản phẩm",
  EDIT: "Chỉnh sửa sản phẩm",
};

export const routeNavigation = {
  [typeRenderComponent.CREATE]: "createProduct",
  [typeRenderComponent.EDIT]: "editProduct",
};

export const typeHandleProduct = {
  CATEGORY: "category",
  TYPE: "type",
  BRAND: "brand",
  UNIT: "unit",
  ATTRIBUTE: "attribute",
  TAGS: "tags",
  SUPPLIER: "supplier",
  CANCEL_UPDATE_PRODUCT: "CANCEL_UPDATE_PRODUCT",
  OPERATION_STOP_BUSINESS: "OPERATION_STOP_BUSINESS",
  OPERATION_BUSINESSING: "OPERATION_BUSINESSING",
  CREATE_PRODUCT: "CREATE_PRODUCT",
  CREATE_COMBO: "CREATE_COMBO",
  EDIT_PRODUCT: "EDIT_PRODUCT",
  EDIT_VARIANT: "EDIT_VARIANT",
  ADD_VARIANT: "ADD_VARIANT",
  DELETE_VARIANT: "DELETE_VARIANT",
  EDIT_PRICE: "EDIT_PRICE",
  EDIT_SKU: "EDIT_SKU",
  EDIT_BARCODE: "EDIT_BARCODE",
  EDIT_ATTRIBUTE_VALUE: "EDIT_ATTRIBUTE_VALUE",
  SORT_ATTRIBUTE: "SORT_ATTRIBUTE",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  SHOW_DETAIL_VARIANT: "SHOW_DETAIL_VARIANT",
  MAP_ECOMMERCE: "MAP_ECOMMERCE",
  EDIT_MAP_ECOMMERCE: "EDIT_MAP_ECOMMERCE",
};

export const titlePopupHandleProduct = {
  ADD_CATEGORY: "Thêm mới nhóm sản phẩm",
  EDIT_CATEGORY: "Chỉnh sửa nhóm sản phẩm",
  ADD_TYPE: "Thêm mới loại sản phẩm",
  EDIT_TYPE: "Chỉnh sửa loại sản phẩm",
  ADD_UNIT: "Thêm mới đơn vị tính",
  EDIT_UNIT: "Chỉnh sửa đơn vị tính",
  ADD_BRAND: "Thêm mới thương hiệu",
  EDIT_BRAND: "Chỉnh sửa thương hiệu",
  ADD_ATTRIBUTE: "Thêm mới thuộc tính",
  EDIT_ATTRIBUTE: "Chỉnh sửa thuộc tính",
  ADD_TAGS: "Thêm mới nhãn",
  EDIT_TAGS: "Chỉnh sửa nhãn",
  ADD_SUPPLIER: "Thêm mới nhà sản xuất",
  EDIT_SUPPLIER: "Chỉnh sửa nhà sản xuất",
  CANCEL_UPDATE_PRODUCT: "Lưu ý",
  EDIT_VARIANT: "Cập nhật sản phẩm",
  ADD_VARIANT: "Thêm biến thể sản phẩm",
  DELETE_VARIANT: "Xóa sản phẩm",
  OPERATION_STOP_BUSINESS: "Ngừng kinh doanh",
  OPERATION_BUSINESSING: "Kích hoạt kinh doanh",
  EDIT_PRICE: "Chỉnh sửa giá",
  EDIT_SKU: "Chỉnh sửa mã sản phẩm/ SKU",
  EDIT_BARCODE: "Chỉnh sửa mã vạch/ Barcode",
  EDIT_ATTRIBUTE_VALUE: "Chỉnh sửa thuộc tính",
  SORT_ATTRIBUTE: "Sắp xếp thứ tự thuộc tính",
  DELETE_PRODUCT: "Xóa sản phẩm",
  CREATE_PRODUCT: "Thêm mới sản phẩm",
  CREATE_COMBO: "Thêm mới combo",
  EDIT_PRODUCT: "Chỉnh sửa sản phẩm",
  SHOW_DETAIL_VARIANT: "Chi tiết sản phẩm",
  MAP_ECOMMERCE: "Map dữ liệu sàn",
  EDIT_MAP_ECOMMERCE: "Chính sửa dữ liệu sàn",
  ADD_VARIANT_ECOMMERCE: "Chính sửa dữ liệu sàn",
};

export const message: any = {
  [typeHandleProduct.CATEGORY]: {
    ADD_SUCCESS: "Thêm nhóm sản phẩm thành công",
    ADD_FAILED: "Thêm nhóm sản phẩm thất bại",
  },
  [titlePopupHandleProduct.EDIT_CATEGORY]: {
    EDIT_SUCCESS: "Chỉnh sửa nhóm sản phẩm thành công",
    EDIT_FAILED: "Chỉnh sửa nhóm sản phẩm thất bại",
  },
  [titlePopupHandleProduct.EDIT_TYPE]: {
    EDIT_SUCCESS: "Chỉnh sửa loại sản phẩm thành công",
    EDIT_FAILED: "Chỉnh sửa loại sản phẩm thất bại",
  },
  [titlePopupHandleProduct.EDIT_BRAND]: {
    EDIT_SUCCESS: "Chỉnh sửa thương hiệu thành công",
    EDIT_FAILED: "Chỉnh sửa thương hiệu thất bại",
  },
  [titlePopupHandleProduct.EDIT_UNIT]: {
    EDIT_SUCCESS: "Chỉnh sửa đơn vị chính thành công",
    EDIT_FAILED: "Chỉnh sửa đơn vị chính thất bại",
  },
  [titlePopupHandleProduct.EDIT_SUPPLIER]: {
    EDIT_SUCCESS: "Chỉnh sửa nhà sản xuất thành công",
    EDIT_FAILED: "Chỉnh sửa nhà sản xuất thất bại",
  },
  [typeHandleProduct.TYPE]: {
    ADD_SUCCESS: "Thêm loại sản phẩm thành công",
    ADD_FAILED: "Thêm loại sản phẩm thất bại",
  },
  [typeHandleProduct.UNIT]: {
    ADD_SUCCESS: "Thêm đơn vị tính thành công",
    ADD_FAILED: "Thêm đơn vị tính thất bại",
  },
  [typeHandleProduct.SUPPLIER]: {
    ADD_SUCCESS: "Thêm nhà sản xuất thành công",
    ADD_FAILED: "Thêm nhà sản xuất thất bại",
  },
  [typeHandleProduct.BRAND]: {
    ADD_SUCCESS: "Thêm thương hiệu thành công",
    ADD_FAILED: "Thêm thương hiệu thất bại",
  },
  [typeHandleProduct.ATTRIBUTE]: {
    ADD_SUCCESS: "Thêm thuộc tính sản phẩm thành công",
    ADD_FAILED: "Thêm thuộc tính sản phẩm thất bại",
  },
  [typeHandleProduct.TAGS]: {
    ADD_SUCCESS: "Thêm nhãn thành công",
    ADD_FAILED: "Thêm nhãn thất bại",
  },
  [typeRenderComponent.CREATE]: {
    UPDATE_PRODUCT_SUCCESS: "Tạo sản phẩm thành công",
  },
  [typeHandleProduct.CREATE_PRODUCT]: {
    UPDATE_PRODUCT_SUCCESS: "Tạo sản phẩm thành công",
  },
  [typeHandleProduct.CREATE_COMBO]: {
    UPDATE_PRODUCT_SUCCESS: "Tạo combo sản phẩm",
  },
  [typeHandleProduct.EDIT_PRODUCT]: {
    UPDATE_PRODUCT_SUCCESS: "Chỉnh sửa sản phẩm thành công",
  },
  [typeRenderComponent.EDIT]: {
    UPDATE_PRODUCT_SUCCESS: "Chỉnh sửa sản phẩm thành công",
  },
  [typeHandleProduct.MAP_ECOMMERCE]: {
    UPDATE_PRODUCT_SUCCESS: "Map sản phẩm thành công",
  },
  [typeHandleProduct.EDIT_MAP_ECOMMERCE]: {
    UPDATE_PRODUCT_SUCCESS: "Map sản phẩm thành công",
  },
  SKU_code: "SKU đã tồn tại. Vui lòng chọn mã sản phẩm khác",
  barcode: "Mã vạch đã tồn tại. Vui lòng chọn mã vạch khác",
  purchase_price: "Giá mua không hợp lệ. Vui lòng nhập giá mua khác",
  sale_price: "Giá bán không hợp lệ. Vui lòng nhập giá bán khác",
  name: "Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác",
  variants: "Vui lòng nhập mã bán lẻ cho các biến thể",
  VALUE_EXISTS: "Có vài giá trị đã tồn tại. Vui lòng chọn các giá trị khác",
  SYSTEM_ERROR: "Rất tiếc ! Đã xảy ra lỗi hệ thống, vui lòng thử lại",
  CHOOSE_VARIANT: "Vui lòng chọn ít nhất một sản phẩm biến thể",
  UPLOAD_IMAGE_SUCCESS: "Tải hình ảnh thành công",
  UPLOAD_IMAGE_FAILED: "Tải hình ảnh thất bại",
  NONE_ADD_VARIANT: "Không thể tạo biến thể cho sản phẩm này",
  [typeHandleProduct.OPERATION_BUSINESSING]: {
    OPERATION_SUCCESS: "Đã kích hoạt kinh doanh thành công",
    OPERATION_FAILED: "Đã kích hoạt kinh doanh thất bại",
  },
  [typeHandleProduct.OPERATION_STOP_BUSINESS]: {
    OPERATION_SUCCESS: "Đã ngừng kinh doanh thành công",
    OPERATION_FAILED: "Đã ngừng kinh doanh thất bại",
  },
  [typeHandleProduct.EDIT_VARIANT]: {
    OPERATION_SUCCESS: "Cập nhật biến thể thành công",
    OPERATION_FAILED: "Cập nhật biến thể thất bại",
  },
  [typeHandleProduct.DELETE_VARIANT]: {
    OPERATION_SUCCESS: "Xóa biến thể thành công",
    OPERATION_FAILED: "Xóa biến thể thất bại",
  },
  [typeHandleProduct.EDIT_SKU]: {
    OPERATION_SUCCESS: "Cập nhật mã sản phẩm/ SKU thành công",
    OPERATION_FAILED: "Cập nhật mã sản phẩm/ SKU thất bại",
  },
  [typeHandleProduct.EDIT_BARCODE]: {
    OPERATION_SUCCESS: "Cập nhật mã vạch/ Barcode thành công",
    OPERATION_FAILED: "Cập nhật mã vạch/ Barcode thất bại",
  },
  [typeHandleProduct.EDIT_PRICE]: {
    OPERATION_SUCCESS: "Cập nhật giá thành công",
    OPERATION_FAILED: "Cập nhật giá thất bại",
  },
  [typeHandleProduct.EDIT_ATTRIBUTE_VALUE]: {
    OPERATION_SUCCESS: "Cập nhật biến thể thành công",
    OPERATION_FAILED: "Cập nhật biến thể thất bại",
  },
  [typeHandleProduct.SORT_ATTRIBUTE]: {
    OPERATION_SUCCESS: "Sắp xếp thuộc tính thành công",
    OPERATION_FAILED: "Sắp xếp thuộc tính thất bại",
  },
  [typeHandleProduct.DELETE_PRODUCT]: {
    OPERATION_SUCCESS: "Xóa sản phẩm thành công",
    OPERATION_FAILED: "Xóa sản phẩm thất bại",
  },
};

export const keyDataFilter = {
  [typeHandleProduct.CATEGORY]: "dataFilterCategory",
  [typeHandleProduct.TYPE]: "dataType",
  [typeHandleProduct.UNIT]: "dataFilterUnit",
  [typeHandleProduct.BRAND]: "dataBrand",
  [typeHandleProduct.ATTRIBUTE]: "dataFilterAttribute",
  [typeHandleProduct.TAGS]: "dataFilterTags",
  [typeHandleProduct.SUPPLIER]: "dataFilterSupplier",
};

export const contentRenderDefault: any = {
  [titlePopupHandleProduct.ADD_CATEGORY]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên nhóm sản phẩm *",
      placeholder: "Nhập tên nhóm sản phẩm",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "code",
      label: "Mã nhóm",
      placeholder: "Nhập mã nhóm",
    },
  ],
  [titlePopupHandleProduct.EDIT_CATEGORY]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên nhóm sản phẩm *",
      placeholder: "Nhập tên nhóm sản phẩm",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "code",
      label: "Mã nhóm",
      placeholder: "Nhập mã nhóm",
    },
  ],
  [titlePopupHandleProduct.ADD_TYPE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên loại sản phẩm *",
      placeholder: "Nhập tên loại sản phẩm",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "code",
      label: "Mã loại",
      placeholder: "Nhập mã loại",
    },
  ],
  [titlePopupHandleProduct.EDIT_TYPE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên loại sản phẩm *",
      placeholder: "Nhập tên loại sản phẩm",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "code",
      label: "Mã loại",
      placeholder: "Nhập mã loại",
    },
  ],
  [titlePopupHandleProduct.ADD_BRAND]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên thương hiệu *",
      placeholder: "Nhập tên thương hiệu",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "code",
      label: "Mã thương hiệu",
      placeholder: "Nhập mã thương hiệu",
    },
  ],
  [titlePopupHandleProduct.EDIT_BRAND]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên thương hiệu *",
      placeholder: "Nhập tên thương hiệu",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "code",
      label: "Mã thương hiệu",
      placeholder: "Nhập mã thương hiệu",
    },
  ],
  [titlePopupHandleProduct.ADD_SUPPLIER]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên nhà sản xuất",
      placeholder: "Nhập tên nhà sản xuất",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "business_code",
      label: "Mã số doanh nghiệp",
      placeholder: "Nhập mã số doanh nghiệp",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "tax_number",
      label: "Mã số thuế",
      placeholder: "Nhập mã nhà sản xuất",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "country",
      label: "Quốc gia",
      placeholder: "Nhập quốc gia",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "address",
      label: "Địa chỉ",
      placeholder: "Nhập địa chỉ",
    },
    {
      type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
      name: "status",
      label: "Trạng thái",
      options: optionFilterOperation,
    },
  ],
  [titlePopupHandleProduct.EDIT_SUPPLIER]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên nhà sản xuất",
      placeholder: "Nhập tên nhà sản xuất",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "business_code",
      label: "Mã số doanh nghiệp",
      placeholder: "Nhập mã số doanh nghiệp",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "tax_number",
      label: "Mã số thuế",
      placeholder: "Nhập mã nhà sản xuất",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "country",
      label: "Quốc gia",
      placeholder: "Nhập quốc gia",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "address",
      label: "Địa chỉ",
      placeholder: "Nhập địa chỉ",
    },
    {
      type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
      name: "status",
      label: "Địa chỉ",
      options: optionFilterOperation,
    },
  ],
  [titlePopupHandleProduct.ADD_ATTRIBUTE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên thuộc tính *",
      placeholder: "Nhập tên thuộc tính",
    },
  ],
  [titlePopupHandleProduct.EDIT_ATTRIBUTE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên thuộc tính *",
      placeholder: "Nhập tên thuộc tính",
    },
  ],
  [titlePopupHandleProduct.ADD_TAGS]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên nhãn *",
      placeholder: "Nhập tên nhãn",
    },
  ],
  [titlePopupHandleProduct.EDIT_TAGS]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên nhãn *",
      placeholder: "Nhập tên nhãn",
    },
  ],
  [titlePopupHandleProduct.CANCEL_UPDATE_PRODUCT]:
    "Dữ liệu chưa được lưu! Bạn có chắc chắn muốn thoát?",
  [titlePopupHandleProduct.OPERATION_STOP_BUSINESS]: [
    "Khi sản phẩm bị ngừng kinh doanh, hệ thống sẽ không cho phép người dùng thực hiện các chức năng như nhập kho hoặc tạo đơn hàng",
    "Bạn có chắc chắn muốn ngừng kinh doanh",
  ],
  [titlePopupHandleProduct.OPERATION_BUSINESSING]: [
    "Khi sản phẩm được kích hoạt kinh doanh, hệ thống sẽ cho phép người dùng thực hiện các chức năng như nhập kho hoặc tạo đơn hàng",
    "Bạn có chắc chắn muốn kích hoạt kinh doanh",
  ],
  [titlePopupHandleProduct.EDIT_VARIANT]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "sale_price",
      label: "Giá bán",
      typeInput: "number",
      placeholder: "0 đ",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "purchase_price",
      label: "Giá mua",
      typeInput: "number",
      placeholder: "0 đ",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "SKU_code",
      label: "SKU",
      placeholder: "Nhập SKU",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "barcode",
      label: "Barcode",
      placeholder: "Nhập Barcode",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "description",
      label: "Mô tả",
      placeholder: "Nhập mô tả",
    },
    {
      type: TYPE_FORM_FIELD.UPLOAD_IMAGE,
      name: "image",
      label: "Hình đại diện của sản phẩm (Sẽ hiển thị trên các trang bán hàng)",
    },
  ],
};

export const getIdCustomers = () => {
  return random(5);
};

export const keyFilter = {
  STATUS: "STATUS",
  CATEGORY: "CATEGORY",
  TYPE: "TYPE",
  ECOMMERCE: "ECOMMERCE",
};

export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_COLUMN_SELECTED: "UPDATE_COLUMN_SELECTED",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  ADD_ATTRIBUTES: "ADD_ATTRIBUTES",
  REMOVE_ATTRIBUTES: "REMOVE_ATTRIBUTES",
  UPDATE_ATTRIBUTES: "UPDATE_ATTRIBUTES",
  UPDATE_COLUMN_WIDTH: "UPDATE_COLUMN_WIDTH",
  UPDATE_COLUMN_SELECTED_PRODUCT: "UPDATE_COLUMN_SELECTED_PRODUCT",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_NAME: "UPDATE_NAME",
  UPDATE_SHOW_FULL_TABLE: "UPDATE_SHOW_FULL_TABLE",
  UPDATE_DATA_FILTER: "UPDATE_DATA_FILTER",
  UPDATE_TAB_HEADER: "UPDATE_TAB_HEADER",
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER: "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_PARAMS_FILTER: "UPDATE_PARAMS_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_DATA_POPUP: "UPDATE_DATA_POPUP",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  UPDATE_VARIANT: "UPDATE_VARIANT",
  UPDATE_ECOMMERCE: "UPDATE_ECOMMERCE",
  RESIZE_COLUMN_ATTRIBUTE_VARIANT_POPUP: "RESIZE_COLUMN_ATTRIBUTE_VARIANT_POPUP",
  RESIZE_COLUMN_PRODUCT: "RESIZE_COLUMN_PRODUCT",
  RESIZE_COLUMN_VARIANT: "RESIZE_COLUMN_VARIANT",
  RESIZE_COLUMN_ECOMMERCE: "RESIZE_COLUMN_ECOMMERCE",
  UPDATE_COLUMN_ORDER_ATTRIBUTE_VARIANT_POPUP: "UPDATE_COLUMN_ORDER_ATTRIBUTE_VARIANT_POPUP",
  UPDATE_COLUMN_ORDER_VARIANT: "UPDATE_COLUMN_ORDER_VARIANT",
  UPDATE_COLUMN_ORDER_PRODUCT: "UPDATE_COLUMN_ORDER_PRODUCT",
  UPDATE_COLUMN_ORDER_ECOMMERCE: "UPDATE_COLUMN_ORDER_ECOMMERCE",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  UPDATE_POPUP: "UPDATE_POPUP",
};

export const columnShowProduct: ColumnShow = {
  columnWidths: [
    { columnName: "product", width: 500 },
    { columnName: "info", width: 250 },
    { columnName: "action", width: 300 },
    { columnName: "operation", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "product",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "info",
      title: "Thông tin",
      isShow: true,
    },
    {
      name: "action",
      title: "Xử lí",
      isShow: true,
    },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      title: "Tên sản phẩm",
      name: "name",
      column: "product",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "SKU",
      name: "SKU_code",
      column: "product",
      isShow: true,
    },

    {
      title: "Trạng thái",
      name: "status",
      column: "info",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Nhóm sản phẩm",
      name: "category",
      column: "info",
      isShow: true,
    },
    {
      title: "Loại sản phẩm",
      name: "type",
      column: "info",
      isShow: true,
    },
    {
      title: "Nhà sản xuất",
      name: "supplier",
      column: "info",
      isShow: true,
    },
    {
      title: "Ngày tạo",
      name: "created",
      column: "action",
      isShow: true,
    },
    {
      title: "Cập nhật lần cuối",
      name: "modified",
      column: "action",
      isShow: true,
    },
    {
      title: "Người tạo",
      name: "created_by",
      column: "action",
      isShow: true,
    },
    {
      title: "Người chỉnh sửa",
      name: "modified_by",
      column: "action",
      isShow: true,
    },
  ],
};

export const columnShowAttributeVariantPopup: ColumnShowDatagrid<any> = {
  columnWidths: [
    { columnName: "sale_price", width: 100 },
    { columnName: "purchase_price", width: 100 },
    { columnName: "variant", width: 230 },
    { columnName: "operation", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "variant",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "sale_price",
      title: "Giá bán",
      isShow: true,
    },
    {
      name: "purchase_price",
      title: "Giá mua",
      isShow: true,
    },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      title: "Tên sản phẩm",
      name: "name",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Combo",
      name: "isCombo",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Giá bán",
      name: "sale_price",
      column: "sale_price",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Giá mua",
      name: "purchase_price",
      column: "purchase_price",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const columnShowDetailVariant: ColumnShowDatagrid<AttributeVariant> = {
  columnWidths: [
    { columnName: "variant", width: 500 },
    { columnName: "isCheck", width: 50 },
    { columnName: "info", width: 250 },
    { columnName: "action", width: 300 },
    { columnName: "operation", width: 150 },
    { columnName: "ecommerce", width: 200 },
  ],
  columnsShowHeader: [
    {
      name: "isCheck",
      title: "Chọn biến thể",
      isShow: true,
    },
    {
      name: "variant",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "info",
      title: "Thông tin",
      isShow: true,
    },
    {
      name: "action",
      title: "Xử lí",
      isShow: true,
    },
    {
      name: "ecommerce",
      title: "TMDT",
      isShow: true,
    },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      title: "Tên sản phẩm",
      name: "name",
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
      title: "Giá niêm yết",
      name: "neo_price",
      column: "variant",
      isShow: true,
    },
    {
      title: "Giá bán",
      name: "sale_price",
      column: "variant",
      isShow: true,
    },
    {
      title: "Trạng thái combo",
      name: "status_combo",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Trạng thái",
      name: "status",
      column: "info",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tồn thực tổng các kho",
      name: "total_inventory",
      column: "info",
      isShow: true,
    },
    {
      title: "SL sản phẩm đã đặt XN",
      name: "quality_confirm",
      column: "info",
      isShow: true,
    },
    {
      title: "SL sản phẩm đã đặt chưa XN",
      name: "quality_non_confirm",
      column: "info",
      isShow: true,
    },
    // {
    //   title: "Ngày tạo",
    //   name: "created",
    //   column: "action",
    //   isShow: true,
    // },
    // {
    //   title: "Cập nhật lần cuối",
    //   name: "modified",
    //   column: "action",
    //   isShow: true,
    // },
    {
      title: "Người tạo",
      name: "created_by",
      column: "action",
      isShow: true,
    },
    {
      title: "Người chỉnh sửa",
      name: "modified_by",
      column: "action",
      isShow: true,
    },
    {
      title: "Platform",
      name: "ecommerce_platform",
      column: "ecommerce",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const columnShowDetailVariantCombo: ColumnShowDatagrid<AttributeVariant> = {
  columnWidths: [
    { columnName: "variant", width: 500 },
    { columnName: "info", width: 250 },
    { columnName: "action", width: 300 },
    { columnName: "ecommerce", width: 200 },
  ],
  columnsShowHeader: [
    {
      name: "variant",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "info",
      title: "Thông tin",
      isShow: true,
    },
    {
      name: "action",
      title: "Xử lí",
      isShow: true,
    },
    {
      name: "ecommerce",
      title: "TMDT",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      title: "Tên sản phẩm",
      name: "name",
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
      title: "Giá niêm yết",
      name: "neo_price",
      column: "variant",
      isShow: true,
    },
    {
      title: "Giá bán",
      name: "sale_price",
      column: "variant",
      isShow: true,
    },
    // {
    //   title: "Giá khi mua combo",
    //   name: "variant_total",
    //   column: "variant",
    //   isShow: true,
    // },
    {
      title: "Số lượng",
      name: "quantity",
      column: "variant",
      isShow: true,
    },
    {
      title: "Trạng thái",
      name: "status",
      column: "info",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tồn thực tổng các kho",
      name: "total_inventory",
      column: "info",
      isShow: true,
    },
    {
      title: "SL sản phẩm đã đặt XN",
      name: "quality_confirm",
      column: "info",
      isShow: true,
    },
    {
      title: "SL sản phẩm đã đặt chưa XN",
      name: "quality_non_confirm",
      column: "info",
      isShow: true,
    },
    {
      title: "Ngày tạo",
      name: "created",
      column: "action",
      isShow: true,
    },
    {
      title: "Cập nhật lần cuối",
      name: "modified",
      column: "action",
      isShow: true,
    },
    {
      title: "Người tạo",
      name: "created_by",
      column: "action",
      isShow: true,
    },
    {
      title: "Người chỉnh sửa",
      name: "modified_by",
      column: "action",
      isShow: true,
    },
    {
      title: "Platform",
      name: "ecommerce_platform",
      column: "ecommerce",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const columnShowInventory: ColumnShowDatagrid<InventoryType> = {
  columnWidths: [
    { columnName: "batch_name", width: 400 },
    { columnName: "expiry_date", width: 150 },
    { columnName: "quantity", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "batch_name",
      title: "Lô",
      isShow: true,
    },
    {
      name: "quantity",
      title: "Tồn kho",
      isShow: true,
    },
    {
      name: "expiry_date",
      title: "Hạn sử dụng",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "batch_name",
      column: "batch_name",
      isShowTitle: false,
      title: "Lô",
      isShow: true,
    },
    {
      name: "quantity",
      column: "quantity",
      isShowTitle: false,
      title: "Tồn kho",
      isShow: true,
    },
    {
      name: "expiry_date",
      column: "expiry_date",
      isShowTitle: false,
      title: "Hạn sử dụng",
      isShow: true,
    },
  ],
};

export const columnShowInventoryDetailWarehouse: ColumnShowDatagrid<InventoryType> = {
  columnWidths: [
    { columnName: "warehouse", width: 430 },
    { columnName: "quantity", width: 100 },
  ],
  columnsShowHeader: [
    {
      name: "warehouse",
      title: "Kho",
      isShow: true,
    },
    {
      name: "quantity",
      title: "Tồn kho",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "warehouse",
      column: "warehouse",
      isShowTitle: false,
      title: "Kho",
      isShow: true,
    },
    {
      name: "quantity",
      column: "quantity",
      isShowTitle: false,
      title: "Tồn kho",
      isShow: true,
    },
  ],
};

export const columnShowInventoryDetailHistoryVariant: ColumnShowDatagrid<HistoryVariant> = {
  columnWidths: [
    { columnName: "variant_batch", width: 130 },
    { columnName: "created", width: 180 },
    { columnName: "quantity", width: 100 },
    { columnName: "is_draft", width: 170 },
    { columnName: "warehouse", width: 100 },
    { columnName: "sheet", width: 120 },
    { columnName: "sheet_code", width: 120 },
    { columnName: "order_number", width: 120 },
    { columnName: "warehouse_show", width: 200 },
  ],
  columnsShowHeader: [
    {
      name: "warehouse_show",
      title: "Kho",
      isShow: true,
    },
    {
      name: "quantity",
      title: "Số lượng",
      isShow: true,
    },
    {
      name: "is_draft",
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "sheet",
      title: "Phiếu kho",
      isShow: true,
    },
    {
      name: "sheet_code",
      title: "Mã phiếu kho",
      isShow: true,
    },
    {
      name: "order_number",
      title: "Mã đơn hàng",
      isShow: true,
    },
    {
      name: "created",
      title: "Ngày tạo",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      name: "warehouse",
      column: "warehouse_show",
      isShowTitle: false,
      title: "Kho",
      isShow: true,
    },
    {
      name: "variant_batch",
      column: "warehouse_show",
      title: "Lô",
      isShow: true,
    },
    {
      name: "quantity",
      column: "quantity",
      isShowTitle: false,
      title: "Số lượng",
      isShow: true,
    },
    {
      name: "is_draft",
      column: "is_draft",
      isShowTitle: false,
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "sheet",
      column: "sheet",
      isShowTitle: false,
      title: "Phiếu kho",
      isShow: true,
    },
    {
      name: "sheet_code",
      column: "sheet_code",
      isShowTitle: false,
      title: "Mã phiếu kho",
      isShow: true,
    },
    {
      name: "order_number",
      column: "order_number",
      isShowTitle: false,
      title: "Mã đơn hàng",
      isShow: true,
    },
    {
      name: "created",
      column: "created",
      isShowTitle: false,
      title: "Ngày tạo",
      isShow: true,
    },
  ],
};

export const columnShowEcommerce: ColumnShow = {
  columnWidths: [
    { columnName: "variant", width: 450 },
    { columnName: "ecommerce", width: 450 },
    { columnName: "operation", width: 150 },
    { columnName: "status_sync", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "ecommerce",
      title: "Sàn",
      isShow: true,
    },
    {
      name: "status_sync",
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "variant",
      title: "Sản phẩm",
      isShow: true,
    },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
  columnShowTable: [
    {
      title: "Tên sản phẩm sàn",
      name: "ecommerce_name",
      column: "ecommerce",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "SKU sàn",
      name: "ecommerce_sku",
      column: "ecommerce",
      isShow: true,
    },
    {
      title: "Giá sàn",
      name: "ecommerce_price",
      column: "ecommerce",
      isShow: true,
    },
    {
      title: "Sàn",
      name: "ecommerce_platform",
      column: "ecommerce",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Trạng thái",
      name: "status_sync",
      column: "status_sync",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tên sản phẩm",
      name: "variant_name",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "SKU",
      name: "variant_SKU_code",
      column: "variant",
      isShow: true,
    },
    {
      title: "Giá bán",
      name: "sale_price",
      column: "variant",
      isShow: true,
    },
    {
      title: "Trạng thái sản phẩm",
      name: "status",
      column: "variant",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

export const columnShowReportOrderItem: ColumnShowDatagrid<ReportOrderType> = {
  columnWidths: [
    { width: 200, columnName: "info" },
    { width: 300, columnName: "order" },
    { width: 200, columnName: "shipping" },
    { width: 200, columnName: "cost" },
    { width: 200, columnName: "status" },
  ],
  columnsShowHeader: [
    { name: "info", title: "Thông tin", isShow: true },
    { name: "status", title: "Trạng thái", isShow: true },
    { name: "order", title: "Đơn hàng", isShow: true },
    { name: "cost", title: "Phí", isShow: true },
    { name: "shipping", title: "Vận chuyển", isShow: true },
  ],
  columnShowTable: [
    { name: "order_key", title: "Mã đơn hàng", column: "info", isShow: true },
    { name: "created", title: "Ngày tạo", column: "info", isShow: true },
    { name: "created_by__name", title: "Người tạo", column: "info", isShow: true },
    // { name: "quantity_variant", title: "SL sản phẩm", column: "info", isShow: true },

    // Status
    {
      name: "status",
      title: "Trạng thái",
      column: "status",
      isShow: true,
      isShowTitle: false,
    },

    // Order
    { name: "source__name", title: "Kênh bán hàng", column: "order", isShow: true },
    { name: "total_variant_all", title: "Tiền hàng trước KM", column: "order", isShow: true },
    { name: "total_variant_actual", title: "Tiền hàng sau KM", column: "order", isShow: true },
    { name: "total_actual", title: "Tổng giá trị đơn hàng", column: "order", isShow: true },

    // Cost
    { name: "fee_delivery", title: "Phí ship", column: "cost", isShow: true },
    { name: "fee_additional", title: "Phụ thu", column: "cost", isShow: true },
    { name: "discount_promotion", title: "Khuyển mãi trên đơn", column: "cost", isShow: true },
    { name: "note", title: "Ghi chú nội bộ", column: "cost", isShow: true },

    // Shipping
    {
      name: "shipping__carrier_status",
      title: "Trạng thái vận đơn",
      column: "shipping",
      isShow: true,
      isShowTitle: false,
    },
    { name: "shipping__tracking_number", title: "Mã vận đơn", column: "shipping", isShow: true },
    { name: "shipping__delivery_company_name", title: "Đơn vị", column: "shipping", isShow: true },
    { name: "shipping__created", title: "Ngày tạo vận đơn", column: "shipping", isShow: true },
    { name: "shipping_address", title: "Địa chỉ nhận hàng", column: "shipping", isShow: true },
  ],
};

// Data filter header

export const optionEditVariant = [
  {
    label: "Chỉnh sửa giá",
    value: titlePopupHandleProduct.EDIT_PRICE,
  },
  {
    label: "Chỉnh sửa mã sản phẩm/SKU",
    value: titlePopupHandleProduct.EDIT_SKU,
  },
  {
    label: "Chỉnh sửa mã vạch/Barcode",
    value: titlePopupHandleProduct.EDIT_BARCODE,
  },
];

export const optionSettingAttribute = [
  {
    label: "Chỉnh sửa thuộc tính",
    value: titlePopupHandleProduct.EDIT_ATTRIBUTE_VALUE,
  },
  {
    label: "Sắp xếp thứ tự thuộc tính",
    value: titlePopupHandleProduct.SORT_ATTRIBUTE,
  },
];

export const headerFilterStatus = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đang kinh doanh",
    value: STATUS_PRODUCT.ACTIVE,
  },
  {
    label: "Ngừng kinh doanh",
    value: STATUS_PRODUCT.INACTIVE,
  },
];

export const headerFilterStatusMap = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đã đồng bộ",
    value: true,
  },
  {
    label: "Chưa đồng bộ",
    value: false,
  },
];

export const headerFilterVariantType = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Simple",
    value: VARIANT_TYPE.SIMPLE,
  },
  {
    label: "Combo",
    value: VARIANT_TYPE.BUNDLE,
  },
];

export const dataRenderHeaderShare = [
  {
    style: {
      width: 180,
    },
    status: keyFilter.STATUS,
    title: "Trạng thái",
    options: headerFilterStatus,
    label: "status",
    defaultValue: headerFilterStatus[1].value,
  },
];

export const initAttribuesVariant: AttributeVariant = {
  id: random(6),
  value: "",
  sale_price: 0,
  purchase_price: 0,
  status: false,
  description: "",
  SKU_code: "",
  barcode: "",
  image: [],
  imageApi: [],
  batchesSelected: [],
  name: "",
  quantity: 0,
};

export const randomSkuCode = () => {
  return `SP_${random(10)}`;
};

export const TAB_HEADER_ECOMMERCE = (user: Partial<UserType> | null, roles?: any) => [
  {
    label: "Tất cả",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.MAP_ECOMMERCE][STATUS_ROLE_ECOMMERCE.ALL]
    }`,
    icon: <NoteAltIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
  {
    label: "Lazada",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.MAP_ECOMMERCE][
        STATUS_ROLE_ECOMMERCE.LAZADA
      ]
    }`,
    icon: <TaskIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
  {
    label: "TikTok",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.MAP_ECOMMERCE][
        STATUS_ROLE_ECOMMERCE.TIKTOK
      ]
    }`,
    icon: <HourglassBottomIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
  {
    label: "Shopee",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.MAP_ECOMMERCE][
        STATUS_ROLE_ECOMMERCE.SHOPEE
      ]
    }`,
    icon: <InsertDriveFileIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.MAP_ECOMMERCE]
    ),
  },
];

export const TAB_HEADER_LIST_PRODUCT = (user: Partial<UserType> | null, roles?: any) => [
  {
    label: "Sản phẩm đơn",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.LIST_PRODUCT][
        STATUS_ROLE_LIST_PRODUCT.SINGLE
      ]
    }`,
    icon: <TaskIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
    ),
  },
  {
    label: "Combo",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.LIST_PRODUCT][
        STATUS_ROLE_LIST_PRODUCT.COMBO
      ]
    }`,
    icon: <HourglassBottomIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
    ),
  },
  {
    label: "Tất cả",
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.PRODUCT][STATUS_ROLE_PRODUCT.LIST_PRODUCT][
        STATUS_ROLE_LIST_PRODUCT.ALL
      ]
    }`,
    icon: <NoteAltIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.PRODUCT]?.[STATUS_ROLE_PRODUCT.LIST_PRODUCT]
    ),
  },
];
