// Libraries
import { SummaryItem } from "@devexpress/dx-react-grid";
import filter from "lodash/filter";
import reduce from "lodash/reduce";

// Types
import { ColumnShow, ColumnShowDatagrid } from "_types_/FacebookType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { ShippingType } from "_types_/ShippingType";

// Components
import { LabelColor } from "components/Labels/Span";
import { TabWrap } from "components/Tabs";
import OrderHistoryTable from "views/OrderView/components/OrderHistoryTable";

// Constants & Utils
import { TYPE_FORM_FIELD } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_SHIPPING } from "constants/rolesTab";
import { LABEL_STATUS_SHIPPING } from "constants/shipping";
import { toSimplest } from "utils/stringsUtil";

// icons
import CancelIcon from "@mui/icons-material/Cancel";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import ElectricMopedIcon from "@mui/icons-material/ElectricMoped";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import NearbyErrorIcon from "@mui/icons-material/NearbyError";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import TaskIcon from "@mui/icons-material/Task";
import { AttributeType } from "_types_/AttributeType";
import { SHIPPING_COMPANIES } from "_types_/GHNType";
import { PATH_DASHBOARD } from "routes/paths";
import { isMatchRoles } from "utils/roleUtils";
import ShippingHistoryTable from "components/OrderShippingTransportationHistory/ShippingHistoryTable";
import TransportationHistoryTable from "components/OrderShippingTransportationHistory/TransportationHistoryTable";
import { UserType } from "_types_/UserType";

export const SELECT_OPTIONS_FILTER_COLOR = [
  { label: "status", color: "#91f7a4", title: "Trạng thái vận đơn" },
  { label: "payment_type_id", color: "#91f7a4", title: "Tuỳ chọn thanh toán" },
];

export const DATE_OPTIONS_FILTER_COLOR = [
  { label: "date_from", color: "#91f7a4", title: "Ngày tạo đơn từ" },
  { label: "date_to", color: "#91f7a4", title: "Ngày tạo đơn tới" },
];

export const GHN_SHIPP_STATUS = [
  { label: "Đang chờ bàn giao", value: "ready_to_pick" },
  { label: "Đang giao hàng", value: "delivering" },
  { label: "Đơn đang hoàn", value: "returning" },
  { label: "Chờ giao lại", value: "waiting_to_return" },
  { label: "Đơn huỷ", value: "cancel" },
  { label: "Đơn thất lạc", value: "lost" },
];

export const CHECK_PRODUCT_OPTIONSGhn = [
  { label: "Cho xem không cho thử", value: "CHOXEMHANGKHONGTHU" },
  { label: "Không cho xem hàng", value: "KHONGCHOXEMHANG" },
  { label: "Cho thử hàng", value: "CHOTHUHANG" },
];

export const CHECK_PRODUCT_OPTIONSVnPost = [
  { label: "Cho xem hàng", value: true },
  { label: "Không cho xem hàng", value: false },
];

export const SHIPPING_VEHICEL_OPTIONS = [
  { label: "Xe tải", value: "truck" },
  { label: "Máy bay", value: "plane" },
];

export const optionPickupType = [
  { label: "Thu gom tận nơi", value: 1 },
  { label: "Gửi hàng tại bưu cục", value: 2 },
];

export const paymentTypeValue: { label: string; value: number }[] = [
  { value: 1, label: "Người giao" },
  { value: 2, label: "Người nhận" },
];

export const TYPE_SHIPPING_COMPANIES: {
  label: string;
  value: SHIPPING_COMPANIES;
  color: LabelColor;
}[] = [
  {
    label: "Chưa có",
    value: SHIPPING_COMPANIES.NONE,
    color: "default",
  },
  {
    label: "Giao hàng nhanh",
    value: SHIPPING_COMPANIES.GHN,
    color: "warning",
  },
  {
    label: "Bưu điện",
    value: SHIPPING_COMPANIES.VNPOST,
    color: "info",
  },
  {
    label: "Lalamove",
    value: SHIPPING_COMPANIES.LALAMOVE,
    color: "primary",
  },
  {
    label: "Viettel Post",
    value: SHIPPING_COMPANIES.VIETTEL_POST,
    color: "secondary",
  },
  {
    label: "Thương mại điện tử",
    value: SHIPPING_COMPANIES.E_COMMERCE,
    color: "error",
  },
  {
    label: "Grab",
    value: SHIPPING_COMPANIES.GRAB,
    color: "success",
  },
  {
    label: "Khác",
    value: SHIPPING_COMPANIES.OTHER,
    color: "default",
  },
];

export enum REPORT_BY {
  CREATED_AT = "created_at",
  SKYLINK_USER = "skylink_user",
  TRACKING_COMPANY = "tracking_company",
  TRACKING_CREATED_AT = "tracking_created_at",
  DATE_DELIVERED = "date_delivered",
}

export const keyFilter = {
  ZALO_OA: "ZALO_OA",
  STATUS: "STATUS",
  TYPE: "TYPE",
  RECEIVED: "RECEIVED",
  DELIVERY_COMPANY: "DELIVERY_COMPANY",
  STATUS_COD: "STATUS_COD",
  SHIPPING_STATUS: "SHIPPING_STATUS",
  CHANNEL: "CHANNEL",
};

export const titlePopupHandle = {
  ADD_SHIPPING_COMPANIES: "Thêm đơn vị vận chuyển",
  EDIT_SHIPPING_COMPANIES: "Chỉnh sửa đơn vị vận chuyển",
};

export const typeHandle = {
  SHIPPING_COMPANIES: "SHIPPING_COMPANIES",
};

export const message: any = {
  [titlePopupHandle.ADD_SHIPPING_COMPANIES]: {
    OPERATION_SUCCESS: "Tạo đơn vị vận chuyển thành công",
    OPERATION_FAILED: "Tạo đơn vị vận chuyển thất bại",
  },
  [titlePopupHandle.EDIT_SHIPPING_COMPANIES]: {
    OPERATION_SUCCESS: "Cập nhật đơn vị vận chuyển thành công",
    OPERATION_FAILED: "Cập nhật đơn vị vận chuyển thất bại",
  },
};

export enum ActionType {
  UPDATE_PARAMS = "UPDATE_PARAMS",
  UPDATE_LOADING = "UPDATE_LOADING",
  UPDATE_POPUP = "UPDATE_POPUP",
  UPDATE_DATA = "UPDATE_DATA",
  UPDATE_DATA_TOTAL_TABLE = "UPDATE_DATA_TOTAL_TABLE",
  UPDATE_DATA_TOTAL_FILTER = "UPDATE_DATA_TOTAL_FILTER",
  UPDATE_DATA_FILTER = "UPDATE_DATA_FILTER",
  UPDATE_DATA_TOTAL = "UPDATE_DATA_TOTAL",
  UPDATE_COLUMNS_REPORT = "UPDATE_COLUMNS_REPORT",
  UPDATE_REPORT = "UPDATE_REPORT",
  RESIZE_COLUMN_REPORT = "RESIZE_COLUMN_REPORT",
  RESIZE_COLUMN_COMPLETED = "RESIZE_COLUMN_COMPLETED",
  UPDATE_COLUMN_ORDER_REPORT = "UPDATE_COLUMN_ORDER_REPORT",
  UPDATE_TOTAL_ROW = "UPDATE_TOTAL_ROW",
  UPDATE_SHOW_FULL_TABLE = "UPDATE_SHOW_FULL_TABLE",
}

// Column
export const columnShowTabContainer: ColumnShowDatagrid<ShippingType> = {
  columnWidths: [
    { width: 170, columnName: "time" },
    { width: 240, columnName: "customer" },
    { width: 270, columnName: "delivery" },
    { width: 150, columnName: "carrier_status" },
    { width: 150, columnName: "note" },
    { width: 240, columnName: "sender" },
    { width: 240, columnName: "payment" },
    { width: 240, columnName: "product" },
    { width: 110, columnName: "operation" },
    { width: 50, columnName: "isCheck" },
  ],
  columnsShowHeader: [
    { name: "isCheck", title: "Chọn", isShow: false },
    {
      name: "operation",
      title: "Thao tác",
      isShow: false,
    },
    { title: "Thời gian", name: "time", isShow: true },
    { title: "Vận chuyển", name: "delivery", isShow: true },
    { title: "Trạng thái", name: "carrier_status", isShow: true },
    { title: "Sản phẩm", name: "product", isShow: true },
    { title: "Bên nhận", name: "customer", isShow: true },
    { title: "Bên gửi", name: "sender", isShow: true },
    { title: "Thanh toán", name: "payment", isShow: true },
    { title: "Ghi chú", name: "note", isShow: true },
  ],
  columnShowTable: [
    {
      title: "Ngày tạo vận đơn",
      name: "created",
      column: "time",
      isShow: true,
    },
    {
      title: "Ngày hoàn thành",
      name: "finish_date",
      column: "time",
      isShow: true,
    },
    {
      title: "Nhà vận chuyển",
      name: "delivery_company_type_show",
      column: "delivery",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Người tạo vận đơn",
      name: "created_by_name",
      column: "delivery",
      isShow: true,
    },
    {
      title: "Mã đơn hàng",
      name: "client_order_code",
      column: "delivery",
      isShow: true,
    },
    {
      title: "Mã vận đơn",
      name: "tracking_number",
      column: "delivery",
      isShow: true,
    },
    {
      title: "Ngày giao dự kiến",
      name: "expected_delivery_time",
      column: "delivery",
      isShow: true,
    },
    {
      title: "Trạng thái",
      name: "carrier_status_show",
      column: "carrier_status",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tên sản phẩm",
      name: "product_name",
      column: "product",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Giá",
      name: "product_price",
      column: "product",
      isShow: true,
    },
    {
      title: "Số lượng",
      name: "product_quantity",
      column: "product",
      isShow: true,
    },
    {
      title: "SDT khách hàng",
      name: "to_phone",
      column: "customer",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tên khách hàng",
      name: "to_name",
      column: "customer",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Địa chỉ khách hàng",
      name: "to_full_address",
      column: "customer",
      isShow: true,
    },
    {
      title: "SDT khách hàng",
      name: "return_phone",
      column: "sender",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Tên khách hàng",
      name: "return_name",
      column: "sender",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Địa chỉ khách hàng",
      name: "return_full_address",
      column: "sender",
      isShow: true,
    },
    {
      title: "Loại thanh toán",
      name: "payment_type_show",
      column: "payment",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "COD",
      name: "cod_amount",
      column: "payment",
      isShow: true,
    },
    {
      title: "Trạng thái thu hộ",
      name: "cod_transferred_show",
      column: "payment",
      isShow: true,
    },
    {
      title: "Bảo hiểm hàng hóa",
      name: "insurance_value",
      column: "payment",
      isShow: true,
    },
    {
      title: "Ghi chú",
      name: "note",
      column: "note",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

const columnShowHeaderReportDefault = [
  { title: "Tổng đơn hàng", name: "total_order", isShow: true },
  { title: "Tổng đơn hàng xác nhận", name: "total_order_completed", isShow: true },
  { title: "Tổng đơn hàng chưa xác nhận", name: "total_order_draft", isShow: true },
  { title: "Tổng đơn hàng hủy", name: "total_order_cancel", isShow: true },
  { title: "Tổng đơn hàng không hủy", name: "total_order_not_cancel", isShow: true },
  { title: "Tổng đơn hàng có mã vận đơn", name: "total_order_shipment", isShow: true },
  {
    title: "Tổng đơn hàng chưa có mã vận đơn",
    name: "total_order_not_shipment",
    isShow: true,
  },
  {
    title: "Tổng đơn hàng hoàn thành",
    name: "total_order_finish",
    isShow: true,
  },
  { title: "Chờ lấy hàng", name: "waiting_for_delivery", isShow: true },
  { title: "Đang giao hàng", name: "delivering", isShow: true },
  { title: "Chờ giao lại", name: "waiting_to_return", isShow: true },
  { title: "Đang hoàn", name: "return_transporting", isShow: true },
  { title: "Đã hoàn", name: "returned", isShow: true },
  { title: "Thành công", name: "delivered", isShow: true },
  { title: "Đã hủy", name: "cancelled", isShow: true },
  { title: "Thất lạc", name: "lost", isShow: true },
];

export const columnShowHeaderReport: Partial<any> = {
  [REPORT_BY.CREATED_AT]: [
    { title: "Ngày tạo", name: "created_at", isShow: true },
    ...columnShowHeaderReportDefault,
  ],
  [REPORT_BY.SKYLINK_USER]: [
    { title: "Người tạo", name: "skylink_user", isShow: true },
    ...columnShowHeaderReportDefault,
  ],
  [REPORT_BY.TRACKING_COMPANY]: [
    { title: "Đơn vị vận chuyển", name: "tracking_company", isShow: true },
    ...columnShowHeaderReportDefault,
  ],
  [REPORT_BY.TRACKING_CREATED_AT]: [
    { title: "Ngày tạo mã vận đơn", name: "tracking_created_at", isShow: true },
    ...columnShowHeaderReportDefault,
  ],
  [REPORT_BY.DATE_DELIVERED]: [
    { title: "Ngày giao thành công", name: "finish_date", isShow: true },
    { title: "Thành công", name: "delivered", isShow: true },
    // ...columnShowHeaderReportDefault,
  ],
};

export const columnWidthsReport = [
  { width: 100, columnName: "created_at" },
  { width: 150, columnName: "finish_date" },
  { width: 150, columnName: "skylink_user" },
  { width: 150, columnName: "tracking_company" },
  { width: 150, columnName: "tracking_created_at" },
  { width: 150, columnName: "delivered_at" },
  { width: 110, columnName: "total_order" },
  { width: 150, columnName: "total_order_completed" },
  { width: 150, columnName: "total_order_draft" },
  { width: 150, columnName: "total_order_cancel" },
  { width: 150, columnName: "total_order_not_cancel" },
  { width: 150, columnName: "total_order_shipment" },
  { width: 150, columnName: "total_order_not_shipment" },
  { width: 130, columnName: "delivering" },
  { width: 120, columnName: "waiting_for_delivery" },
  { width: 120, columnName: "return_transporting" },
  { width: 120, columnName: "delivered" },
  { width: 120, columnName: "waiting_to_return" },
  { width: 120, columnName: "returned" },
  { width: 120, columnName: "cancelled" },
  { width: 120, columnName: "lost" },
  { width: 120, columnName: "total_order_finish" },
];

export const columnShowHistory: ColumnShow = {
  columnWidths: [
    { columnName: "history_date", width: 170 },
    { columnName: "modified_by", width: 170 },
    { columnName: "history_type", width: 150 },
    { columnName: "is_cod_transferred", width: 170 },
    { columnName: "carrier_status", width: 150 },
    { columnName: "carrier_status_manual", width: 190 },
    { columnName: "carrier_status_system", width: 220 },
    { columnName: "cod_transfer_date", width: 200 },
    { columnName: "finish_date", width: 200 },
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
      name: "carrier_status",
      title: "Trạng thái",
      isShow: true,
    },
    {
      name: "carrier_status_system",
      title: "Trạng thái giao hàng (3rd)",
      isShow: true,
    },
    {
      name: "carrier_status_manual",
      title: "Trạng thái thủ công",
      isShow: true,
    },
    {
      name: "is_cod_transferred",
      title: "Trạng thái thu hộ",
      isShow: true,
    },
    {
      name: "cod_transfer_date",
      title: "Thời gian chuyển COD",
      isShow: true,
    },
    {
      name: "finish_date",
      title: "Ngày hoàn thành",
      isShow: true,
    },
    {
      name: "history_type",
      title: "Loại thao tác",
      isShow: true,
    },
  ],
};

// Summary
export const summaryColumnReport: SummaryItem[] = [
  { type: "sum", columnName: "total_order" },
  { type: "sum", columnName: "total_order_completed" },
  { type: "sum", columnName: "total_order_draft" },
  { type: "sum", columnName: "total_order_cancel" },
  { type: "sum", columnName: "total_order_not_cancel" },
  { type: "sum", columnName: "total_order_shipment" },
  { type: "sum", columnName: "total_order_not_shipment" },
  { type: "sum", columnName: "total_order_finish" },
  { type: "sum", columnName: "delivering" },
  { type: "sum", columnName: "waiting_for_delivery" },
  { type: "sum", columnName: "return_transporting" },
  { type: "sum", columnName: "delivered" },
  { type: "sum", columnName: "waiting_to_return" },
  { type: "sum", columnName: "returned" },
  { type: "sum", columnName: "cancelled" },
  { type: "sum", columnName: "lost" },
];

export const domainGhn = "https://donhang.ghn.vn/?order_code=";

export const domainVnPost = "http://www.vnpost.vn/vi-vn/dinh-vi/buu-pham?key=";
export const deliveryLazadaUrl = "https://logistics.lazada.vn/search?trackingNumber=";
export const deliveryTiktokUrl = "https://jtexpress.vn/vi/tracking?type=track&billcode=";
export const deliveryShopeeUrl = "https://spx.vn/m/tracking-detail/";

export const SHIPPING_STATUS = {
  [STATUS_ROLE_SHIPPING.PICKING]: "waiting_for_delivery",
  [STATUS_ROLE_SHIPPING.DELIVERING]: "delivering",
  [STATUS_ROLE_SHIPPING.RETURNED]: "returned",
  [STATUS_ROLE_SHIPPING.RETURNING]: "return_transporting",
  [STATUS_ROLE_SHIPPING.SUCCESS]: "delivered",
  [STATUS_ROLE_SHIPPING.WAIT_DELIVERY]: "waiting_to_return",
  [STATUS_ROLE_SHIPPING.CANCELLED]: "cancelled",
  [STATUS_ROLE_SHIPPING.LOST]: "lost",
  [STATUS_ROLE_SHIPPING.ALL]: "all",
};

export const optionStatusShipping: { label: string; value: string; color?: LabelColor }[] = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chưa có",
    value: "null",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.PICKING],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.PICKING],
    color: "primary",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.DELIVERING],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.DELIVERING],
    color: "secondary",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.WAIT_DELIVERY],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.WAIT_DELIVERY],
    color: "default",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.RETURNING],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.RETURNING],
    color: "warning",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.RETURNED],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.RETURNED],
    color: "info",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.CANCELLED],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.CANCELLED],
    color: "error",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.LOST],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.LOST],
    color: "error",
  },
  {
    label: LABEL_STATUS_SHIPPING[STATUS_ROLE_SHIPPING.SUCCESS],
    value: SHIPPING_STATUS[STATUS_ROLE_SHIPPING.SUCCESS],
    color: "success",
  },
];

const optionStatusCod = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Chờ chuyển COD",
    value: false,
  },
  {
    label: "Đã chuyển COD",
    value: true,
  },
];

export const optionReportBy = [
  {
    label: "Ngày tạo",
    value: REPORT_BY.CREATED_AT,
  },
  {
    label: "Người tạo",
    value: REPORT_BY.SKYLINK_USER,
  },
  {
    label: "Đơn vị vận chuyển",
    value: REPORT_BY.TRACKING_COMPANY,
  },
  {
    label: "Ngày tạo mã vận đơn",
    value: REPORT_BY.TRACKING_CREATED_AT,
  },
  {
    label: "Ngày giao hàng thành công",
    value: REPORT_BY.DATE_DELIVERED,
  },
];

export const arrColumnOptional = [
  "customer",
  "delivery",
  "package",
  "sender",
  "payment",
  "product",
  "carrier_status",
];

export const paramsDefault = {
  created_dateValue: "all",
  created_from: "",
  created_to: "",
};

export const paramsGetDefault = [
  "is_cod_transferred",
  "delivery_company_type",
  "order_source",
  "carrier_status",
  "created__date__gte",
  "created__date__lte",
];

export const contentRenderDefault = [
  {
    type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
    name: "carrier_status_manual",
    label: "Trạng thái vận đơn",
    options: reduce(
      optionStatusShipping,
      (prevArr, current) => {
        return current.value !== "all"
          ? [
              ...prevArr,
              {
                ...current,
                disabled: [
                  SHIPPING_STATUS[STATUS_ROLE_SHIPPING.PICKING],
                  SHIPPING_STATUS[STATUS_ROLE_SHIPPING.DELIVERING],
                  SHIPPING_STATUS[STATUS_ROLE_SHIPPING.RETURNED],
                ].includes(current.value),
              },
            ]
          : prevArr;
      },
      []
    ),
  },
  {
    type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
    name: "is_cod_transferred",
    label: "Trạng thái thu hộ",
    options: [
      {
        label: "Chờ chuyển COD",
        value: false,
      },
      {
        label: "Đã chuyển COD",
        value: true,
      },
    ],
  },
];

export const filterData = ({ optionChannel }: { optionChannel: SelectOptionType[] }) => {
  return [
    {
      style: {
        width: 200,
      },
      status: keyFilter.DELIVERY_COMPANY,
      title: "Nhà vận chuyển",
      options: [
        {
          label: "Tất cả",
          value: "all",
        },
        ...filter(TYPE_SHIPPING_COMPANIES, (item) => item.value !== SHIPPING_COMPANIES.NONE),
      ],
      label: "delivery_company_type",
      defaultValue: "all",
    },
    {
      style: {
        width: 200,
      },
      status: keyFilter.CHANNEL,
      title: "Kênh bán hàng",
      options: [
        {
          label: "Tất cả",
          value: "all",
        },
        {
          label: "Chưa có",
          value: "none",
        },
        ...optionChannel,
      ],
      label: "order_source",
      defaultValue: "all",
    },
    {
      style: {
        width: 200,
      },
      status: keyFilter.STATUS_COD,
      title: "Trạng thái thu hộ",
      options: optionStatusCod,
      label: "is_cod_transferred",
      defaultValue: "all",
    },
    {
      type: TYPE_FORM_FIELD.DATE,
      title: "Ngày tạo mã vận đơn",
      keyDateFrom: "created_from",
      keyDateTo: "created_to",
      keyDateValue: "created_dateValue",
    },
  ];
};

export const renderTableDetail = (row: any, value: number, optional: any) => {
  return (
    <>
      <TabWrap value={value} index={0}>
        <ShippingHistoryTable isFullTable={optional.isShowFullTable} row={row} />
      </TabWrap>
      <TabWrap value={value} index={1}>
        <OrderHistoryTable orderID={row.order} />
      </TabWrap>
      <TabWrap value={value} index={2}>
        <TransportationHistoryTable isFullTable={optional.isShowFullTable} id={row.order} />
      </TabWrap>
    </>
  );
};

export const deliveryCodeUrl = ({
  deliveryType,
  trackingNumber,
  source,
}: {
  deliveryType?: SHIPPING_COMPANIES;
  trackingNumber?: string | number;
  source?: AttributeType;
}) =>
  deliveryType === SHIPPING_COMPANIES.GHN
    ? domainGhn + trackingNumber
    : deliveryType === SHIPPING_COMPANIES.VNPOST
    ? domainVnPost + trackingNumber
    : deliveryType === SHIPPING_COMPANIES.E_COMMERCE
    ? toSimplest(source?.name).includes("lazada")
      ? deliveryLazadaUrl + trackingNumber
      : toSimplest(source?.name).includes("tiktok")
      ? deliveryTiktokUrl + trackingNumber
      : toSimplest(source?.name).includes("shopee")
      ? deliveryShopeeUrl + trackingNumber
      : ""
    : "";

export const TAB_HEADER_SHIPPING = (user: Partial<UserType> | null, roles?: any) => [
  {
    label: "Chưa có mã vận đơn",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.COMPLETED]}`,
    icon: <NoteAltIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.COMPLETED]
    ),
  },
  {
    label: "Tất cả phiếu giao hàng",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.ALL]}`,
    icon: <TaskIcon />,
    roles: isMatchRoles(user?.is_superuser, roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.ALL]),
  },
  {
    label: "Chờ lấy hàng",
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.PICKING]}`,
    icon: <HourglassBottomIcon />,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.PICKING]
    ),
  },
  {
    label: "Đang giao hàng",
    icon: <DeliveryDiningIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.DELIVERING]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.DELIVERING]
    ),
  },
  {
    label: "Chờ giao lại",
    icon: <ElectricMopedIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.WAIT_DELIVERY]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.WAIT_DELIVERY]
    ),
  },
  {
    label: "Đang hoàn",
    icon: <KeyboardReturnIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.RETURNING]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.RETURNING]
    ),
  },
  {
    label: "Đã hoàn",
    icon: <PublishedWithChangesIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.RETURNED]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.RETURNED]
    ),
  },
  {
    label: "Giao thành công",
    icon: <DownloadDoneIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.SUCCESS]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.SUCCESS]
    ),
  },
  {
    label: "Đã hủy",
    icon: <CancelIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.CANCELLED]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.CANCELLED]
    ),
  },
  {
    label: "Thất lạc",
    icon: <NearbyErrorIcon />,
    path: `/${PATH_DASHBOARD[ROLE_TAB.SHIPPING][STATUS_ROLE_SHIPPING.LOST]}`,
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.SHIPPING]?.[STATUS_ROLE_SHIPPING.LOST]
    ),
  },
];
