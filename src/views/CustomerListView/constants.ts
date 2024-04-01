import { random } from "utils/randomUtil";

export const keyFilter = {
  STATUS: "STATUS",
  OBJECTIVE: "OBJECTIVE",
  AD_ACCOUNT: "AD_ACCOUNT",
  CAMPAIGN: "CAMPAIGN",
  AD_SET: "AD_SET",
  AD: "AD",
  CONTENT_CREATOR: "CONTENT_CREATOR",
  DESIGNER: "DESIGNER",
  FANPAGE: "FANPAGE",
  POST: "POST",
  CONTENT_ID: "CONTENT_ID",
  ATTIBUTES: "ATTIBUTES",
  ATTIBUTES_VALUE: "ATTIBUTES_VALUE",
};

export const titlePopup = {
  CREATE_CUSTOMER: 'Tạo tập khách hàng',
  EDIT_CUSTOMER: 'Chỉnh sửa tập khách hàng'
}

export const typeFilter = {
  INCLUDE: 'Lựa chọn',
  EXCLUDE: 'Loại trừ'
}

export const typeComponent = {
  INPUT_TEXT: 'INPUT_TEXT',
  INPUT_NUMBER: 'INPUT_NUMBER',
  SINGLE_SELECT: 'SINGLE_SELECT',
  MULTIPLE_SELECT: 'MULTIPLE_SELECT',
  RANGE_DATE: 'RANGE_DATE'
}

export const getIdCustomers = () => {
  return random(5)
}

export interface FilterChild {
  id: string | undefined,
  type: string
  field: string,
  operator: string,
  value: string | number,
  isValid: boolean,
}

export const initCustomers: FilterChild = {
  id: getIdCustomers(),
  type: typeFilter.INCLUDE,
  field: '',
  operator: '',
  value: '',
  isValid: true,
}

// Type dispatch reducer in component
export const actionType = {
  UPDATE_LOADING: "UPDATE_LOADING",
  UPDATE_PARAMS: "UPDATE_PARAMS",
  UPDATE_TOTAL_ROW: "UPDATE_TOTAL_ROW",
  UPDATE_DATA: "UPDATE_DATA",
  UPDATE_COLUMN: "UPDATE_COLUMN",
  UPDATE_POPUP: "UPDATE_POPUP",
  UPDATE_NAME: "UPDATE_NAME",
  ADD_FILTER_PARENT: "ADD_CUSTOMER_PARENT",
  REMOVE_FILTER_PARENT: "REMOVE_CUSTOMER_PARENT",
  ADD_FILTER_CHILD: "ADD_CUSTOMER_CHILD",
  REMOVE_FILTER_CHILD: 'REMOVE_CUSTOMER_CHILD',
  UPDATE_CUSTOMER_FILTER: 'UPDATE_CUSTOMER_FILTER',
  UPDATE_CUSTOMER_STATE: 'UPDATE_CUSTOMER_STATE',
  INIT_CUSTOMER: 'INIT_CUSTOMER',
  UPDATE_DATA_TOTAL_TABLE: "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_HEADER_FILTER: "UPDATE_DATA_HEADER_FILTER",
  UPDATE_DATA_TOTAL: "UPDATE_DATA_TOTAL",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
};

// Show column
export const columnShowCustomerList: any = {
  columnWidths: [
    { columnName: "name", width: 150 },
    { columnName: "customers_match", width: 250 },
    { columnName: "account_sync", width: 250 },
    { columnName: "status_sync", width: 250 },
    { columnName: "operation", width: 150 },
  ],
  columnsShowHeader: [
    {
      name: "name",
      title: "Tên",
      isShow: true,
    },
    {
      name: "customers_match",
      title: "Số khách hàng khớp",
      isShow: true,
    },
    {
      name: "account_sync",
      title: "Tài khoản đồng bộ",
      isShow: true,
    },
    {
      name: "status_sync",
      title: "Trạng thái đồng bộ",
      isShow: true,
    },
    {
      name: "operation",
      title: "Thao tác",
      isShow: true,
    },
  ],
};

// Data filter header
export const headerFilterStatus = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Đang hoạt động",
    value: "ACTIVE",
  },
  {
    label: "Không hoạt động",
    value: "NONE_ACTIVE",
  },
];

export const headerFilterObjecttive = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chuyển đổi",
    value: "CONVERSIONS",
  },
  {
    label: "Tin nhắn",
    value: "MESSAGES",
  },
  {
    label: "Bài viết",
    value: "POST_ENGAGEMENT",
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
    label: "effective_status",
    defaultValue: headerFilterStatus[0].value,
  },
  {
    style: {
      width: 180,
    },
    status: keyFilter.OBJECTIVE,
    title: "Mục tiêu",
    options: headerFilterObjecttive,
    label: "objective",
    defaultValue: headerFilterObjecttive[0].value,
  },
];

export const typeFilterOptions = [
  {
    label: 'Tiêu chí lựa chọn',
    value: typeFilter.INCLUDE
  },
  {
    label: 'Tiêu chí loại trừ',
    value: typeFilter.EXCLUDE
  }
]

export const fieldOptions = [
  {
    value: 'total_revenue',
    label: 'Tổng doanh thu',
  },
  {
    value: 'total_order',
    label: 'Tổng đơn hàng',
  },
  {
    value: 'last_order_date',
    label: 'Ngày đặt hàng gần nhất',
  },
  {
    value: 'products_purchased',
    label: 'Sản phẩm đã mua',
  },
  {
    value: 'categories_purchased',
    label: 'Danh mục đã mua',
  },
]

export const operatorOptionsByField: any = {
  total_revenue: [
    {
      value: 'equal',
      label: 'bằng',
    },
    {
      value: 'less_than',
      label: 'nhỏ hơn',
    },
    {
      value: 'greater_than',
      label: 'lớn hơn',
    },
  ],
  total_order: [
    {
      value: 'equal',
      label: 'bằng',
    },
    {
      value: 'less_than',
      label: 'nhỏ hơn',
    },
    {
      value: 'greater_than',
      label: 'lớn hơn',
    },
  ],
  last_order_date: [
    {
      value: 'in',
      label: 'trong vòng',
    },
  ],
  products_purchased: [
    {
      value: 'contain',
      label: 'bao gồm',
    },
  ],
  categories_purchased: [
    {
      value: 'contain',
      label: 'bao gồm',
    },
  ],
}

export const valueOptions: any = {
  total_revenue: {
    unit: 'đ',
    type: typeComponent.INPUT_NUMBER
  },
  total_order: {
    unit: 'đơn',
    type: typeComponent.INPUT_NUMBER
  },
  last_order_date: {
    unit: 'ngày',
    type: typeComponent.INPUT_NUMBER
  },
  products_purchased: {
    unit: '',
    type: typeComponent.MULTIPLE_SELECT
  },
  categories_purchased: {
    unit: '',
    type: typeComponent.MULTIPLE_SELECT
  },
}

export const exampleData = [
  {
    label: 'Tất cả',
    value: 'all'
  },
  {
    label: 'Kem',
    value: 'kem'
  },
  {
    label: 'Viên thuốc',
    value: 'thuoc'
  },
]

