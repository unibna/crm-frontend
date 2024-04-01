// Libraries
import { Column, TableColumnWidthInfo } from "@devexpress/dx-react-grid";

// Components
import { FilterChipType } from "components/Tables/HeaderWrapper";

// Utils & Constants
import { FilterOptionProps } from "_types_/HeaderType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { TransportationCareTaskType } from "_types_/TransportationType";
import vi from "locales/vi.json";
import { ALL_OPTION } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_TRANSPORTATION } from "constants/rolesTab";
import { filter, initial, map } from "lodash";
import { PATH_DASHBOARD } from "routes/paths";
import { compareDateSelected, fDateTime } from "utils/dateUtil";
import { isMatchRoles } from "utils/roleUtils";
import { formatOptionSelect } from "utils/selectOptionUtil";
import { DELIVERY_FILTER } from "views/OrderView/constants";
import { TYPE_SHIPPING_COMPANIES, optionStatusShipping } from "views/ShippingView/constants";

//icons
import AddIcon from "@mui/icons-material/Add";
import BallotIcon from "@mui/icons-material/Ballot";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import PauseIcon from "@mui/icons-material/Pause";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { SHIPPING_COMPANIES } from "_types_/GHNType";
import { ORDER_STATUS } from "views/OrderView/constants/options";
import { EDIT_HANDLE_BY_COLUMN } from "views/LeadCenterView/constants";
import { UserType } from "_types_/UserType";

export const TRANSPORTATION_COLUMNS: Column[] = [
  { name: EDIT_HANDLE_BY_COLUMN, title: "Người nhận xử lý" },
  { name: "task", title: "Thông tin task" },
  { name: "handle", title: "Thông tin xử lý" },
  { name: "reason_action", title: "Hướng xử lý và lý do xử lý" },
  { name: "customer", title: "Khách hàng" },
  { name: "order", title: "Thông tin đơn hàng" },
  { name: "order_modified", title: "Xử lý đơn hàng" },
  { name: "shipping", title: "Thông tin vận chuyển" },
  { name: "shipping_modified", title: "Xử lý vận chuyển" },
];

export const TRANSPORTATION_COLUMN_WIDTHS: TableColumnWidthInfo[] = [
  { columnName: EDIT_HANDLE_BY_COLUMN, width: 200 },
  { columnName: "task", width: 240 },
  { columnName: "handle", width: 340 },
  { columnName: "reason_action", width: 240 },
  { columnName: "customer", width: 240 },
  { columnName: "order", width: 400 },
  { columnName: "order_modified", width: 400 },
  { columnName: "shipping", width: 400 },
  { columnName: "shipping_modified", width: 400 },
];

export const TRANSPORTATION_COLUMNS_SHOW_SORT = [
  {
    name: "task",
    fields: [
      {
        title: "Ngày tạo task",
        name: "created",
      },
    ],
  },
  {
    name: "handle",
    fields: [
      { name: "modified", title: "Ngày xử lý" },
      { name: "appointment_date", title: "Ngày hẹn gọi lại" },
    ],
  },
  {
    name: "order",
    fields: [
      { name: "order_order_key", title: "Mã đơn hàng" },
      { name: "order_created", title: "Ngày tạo đơn" },
      { name: "order_completed_time", title: "Ngày xác nhận đơn" },
      { name: "order_total_actual", title: "Tổng đơn hàng" },
    ],
  },
  {
    name: "shipping",
    fields: [
      { name: "order_shipping_created", title: "Ngày tạo MVĐ" },
      { name: "order_shipping_estimated_delivery_date", title: "Ngày GH dự kiến" },
      { name: "order_shipping_finish_date", title: "Ngày GH thành công" },
    ],
  },
];

const USER_FILTER_COLOR = [
  {
    label: "handle_by",
    color: "#f7e391",
    title: "Người nhận xử lý",
  },
  {
    label: "modified_by",
    color: "#ed90bb",
    title: "Người xử lý",
  },
  {
    label: "assign_by",
    color: "#2b74af",
    title: "Người chia số",
  },
  {
    label: "order_created_by",
    color: "#2b74af",
    title: "Người tạo đơn",
  },
];

export const TASK_REASON_LABELS = {
  LATE: "Đơn giao chậm hơn dự kiến",
  WAIT_RETURN: "Đơn giao thất bại",
  RETURNING: "Đơn đang hoàn",
  RETURNED: "Đơn đã hoàn",
};

export const OPTIONS_REASON_CREATED: {
  value: string;
  label: string;
  color: any;
}[] = [
  { value: "late", label: TASK_REASON_LABELS.LATE, color: "error" },
  { value: "wait_return", label: TASK_REASON_LABELS.WAIT_RETURN, color: "warning" },
  { value: "returning", label: TASK_REASON_LABELS.RETURNING, color: "info" },
  { value: "returned", label: TASK_REASON_LABELS.RETURNED, color: "success" },
];

export const TRANSPORTATION_STATUS: {
  id: number;
  value?: string;
  label: string;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}[] = [
  { id: 0, label: "Mới", value: "new", color: "default" },
  { id: 1, label: "Chờ xử lý", value: "pending", color: "warning" },
  { id: 2, label: "Đang xử lý", value: "processing", color: "secondary" },
  { id: 3, label: "Đã xử lý", value: "handled", color: "success" },
  { id: 4, label: "Hoàn thành", value: "completed", color: "success" },
  { id: 5, label: "Tất cả", value: undefined },
  { id: 6, label: "Thuộc tính", value: "attribute" },
];

export const titlePopupHandle = {
  ADD_LATE_REASON: `Thêm lí do ${vi.late}`,
  EDIT_LATE_REASON: `Chỉnh sửa lí do ${vi.late}`,
  ADD_RETURNING_REASON: `Thêm lí do ${vi.returning}`,
  EDIT_RETURNING_REASON: `Chỉnh sửa lí do ${vi.returning}`,
  ADD_WAIT_RETURN_REASON: `Thêm lí do ${vi.wait_return}`,
  EDIT_WAIT_RETURN_REASON: `Chỉnh sửa lí do ${vi.wait_return}`,
  ADD_RETURNED_REASON: `Thêm lí do ${vi.returned}`,
  EDIT_RETURNED_REASON: `Chỉnh sửa lí do ${vi.returned}`,
  ADD_LATE_ACTION: `Thêm hướng xử lý ${vi.late}`,
  EDIT_LATE_ACTION: `Chỉnh sửa hướng xử lý ${vi.late}`,
  ADD_RETURNING_ACTION: `Thêm hướng xử lý ${vi.returning}`,
  EDIT_RETURNING_ACTION: `Chỉnh sửa hướng xử lý ${vi.returning}`,
  ADD_WAIT_RETURN_ACTION: `Thêm hướng xử lý ${vi.wait_return}`,
  EDIT_WAIT_RETURN_ACTION: `Chỉnh sửa hướng xử lý ${vi.wait_return}`,
  ADD_RETURNED_ACTION: `Thêm hướng xử lý ${vi.returned}`,
  EDIT_RETURNED_ACTION: `Chỉnh sửa hướng xử lý ${vi.returned}`,
};

export const DATE_OPTIONS_FILTER = [
  {
    title: "Ngày XN đơn",
    keyFilters: [
      { label: "order_completed_time_from", color: "#91f7a4", title: "Ngày XN đơn từ" },
      { label: "order_completed_time_to", color: "#91f7a4", title: "Ngày XN đơn đến" },
    ],
  },
  {
    title: "Ngày tạo MVĐ",
    keyFilters: [
      { label: "tracking_created_from", color: "#91f7a4", title: "Ngày tạo MVĐ từ" },
      { label: "tracking_created_to", color: "#91f7a4", title: "Ngày tạo  MVĐ đến" },
    ],
  },
  {
    title: "Ngày tạo CSVĐ",
    keyFilters: [
      { label: "date_from", color: "#91f7a4", title: "Ngày tạo CSVĐ từ" },
      { label: "date_to", color: "#91f7a4", title: "Ngày tạo  CSVĐ đến" },
    ],
  },
  {
    title: "Ngày chia số",
    keyFilters: [
      { label: "assigned_at_from", color: "#91f7a4", title: "Ngày chia số từ" },
      { label: "assigned_at_to", color: "#91f7a4", title: "Ngày chia số đến" },
    ],
  },
];

export const formatExportTransportation = (item: any) => {
  let newItem: any = {
    // Thông tin task
    status: TRANSPORTATION_STATUS.find((itemStatus) => itemStatus?.value === item.status)?.label,
    created: fDateTime(item.created),
    created_by: item?.assign_by?.name,

    // Người nhận xử lý
    handle_by: item?.handle_by?.name,

    // Thông tin xử lý
    modified: fDateTime(item.created),
    modified_by: item?.modified_by?.name,
    appointment_date: fDateTime(item.appointment_date),
    note: item.note,

    // Ngày tạo lí do, lí do và hướng xử lý
    late_created: fDateTime(item.late_created),
    late_reason: item?.late_reason?.label,
    late_action: item?.late_action?.label,
    wait_return_created: fDateTime(item.wait_return_created),
    wait_return_reason: item?.wait_return_reason?.label,
    wait_return_action: item?.wait_return_action?.label,
    returning_created: fDateTime(item.returning_created),
    returning_reason: item?.returning_reason?.label,
    returning_action: item?.returning_action?.label,
    returned_reason: item?.returning_reason?.label,
    returned_action: item?.returning_action?.label,

    // Thông tin khách hàng
    customer_name: item?.order?.customer_name,
    customer_phone: item?.order?.customer_phone,

    // Thông tin đơn hàng
    order_key: item?.order?.order_key,
    order_status: ORDER_STATUS.find((itemStatus) => itemStatus?.value === item?.order?.status)
      ?.label,
    order_created: fDateTime(item?.order?.created),
    order_created_by: item?.order?.created_by?.name,
    order_complete_time: fDateTime(item?.order?.completed_time),
    order_total_actual: item?.order?.total_actual,
    order_source: item?.order?.source?.name,

    // Thông tin vận đơn
    shipping_status:
      optionStatusShipping.find((itemStatus) => itemStatus.value === item?.shipping?.carrier_status)
        ?.label || "",
    shipping_delivery_company:
      TYPE_SHIPPING_COMPANIES.find(
        (itemType) => itemType?.value === item?.shipping?.delivery_company?.type
      )?.label || "",
    shipping_created: fDateTime(item?.shipping?.created),
    shipping_created_by: item?.shipping?.created_by?.name,
    shipping_tracking_number: item?.shipping?.tracking_number,
    shipping_expected_delivery_time: fDateTime(item?.shipping?.expected_delivery_time),
    shipping_finish_date: fDateTime(item?.shipping?.finish_date),
  };
  const TRANSPORTATION = "transportation";

  const objExport = Object.keys(newItem).reduce((prev: any, current: any) => {
    return {
      ...prev,
      [vi[TRANSPORTATION][current as keyof typeof vi.transportation]]: newItem[current],
    };
  }, {});
  return objExport;
};

interface MultiSelectFilterType {
  key: string;
  filterProps?: (value: string | number | (string | number)[]) => void;
  options: {
    label: any;
    value: any;
  }[];
  title: string;
  defaultValue?: string | number | (string | number)[];
}

interface RangeDateFilterType {
  key: string;
  filterProps?: (
    from: string | undefined,
    to: string | undefined,
    dateValue: number | string | undefined
  ) => void;
  title: string;
  defaultValue?: any;
  fromValue?: string;
  toValue?: string;
}

export const transportationFilterOptions = ({
  userSlice,
  leadSlice,
  attributesTransporationCare,
  ...props
}: any): FilterOptionProps[] => {
  const {
    lateReason,
    lateAction,
    waitReturnReason,
    waitReturnAction,
    returningReason,
    returningAction,
    returnedReason,
    returnedAction,
  } = attributesTransporationCare;

  const formatOptions = (options: any) => [
    ALL_OPTION,
    ...map(options, (item) => ({
      label: item.label,
      value: item.id,
    })),
  ];

  const multiSelectFilters: MultiSelectFilterType[] = [
    {
      key: "status",
      filterProps: props.filterHandleStatus,
      options: [
        ALL_OPTION,
        ...(initial(
          TRANSPORTATION_STATUS.slice(0, TRANSPORTATION_STATUS.length - 1)
        ) as SelectOptionType[]),
      ],
      title: vi.transportation_care_status,
      defaultValue: props.handleStatusDefault,
    },
    {
      key: "late_reason",
      filterProps: props.filterLateReason,
      options: formatOptions(lateReason),
      title: vi.late_reason,
      defaultValue: props.lateReasonDefault,
    },
    {
      key: "late_action",
      filterProps: props.filterLateAction,
      options: formatOptions(lateAction),
      title: vi.late_action,
      defaultValue: props.lateActionDefault,
    },
    {
      key: "wait_return_reason",
      filterProps: props.filterWaittingForReturnReason,
      options: formatOptions(waitReturnReason),
      title: vi.wait_return_reason,
      defaultValue: props.waittingForReturnReasonDefault,
    },
    {
      key: "wait_return_action",
      filterProps: props.filterWaittingForReturnAction,
      options: formatOptions(waitReturnAction),
      title: vi.wait_return_action,
      defaultValue: props.waittingForReturnActionDefault,
    },
    {
      key: "returning_reason",
      filterProps: props.filterReturningReason,
      options: formatOptions(returningReason),
      title: vi.returning_reason,
      defaultValue: props.returningReasonDefault,
    },
    {
      key: "returning_action",
      filterProps: props.filterReturningAction,
      options: formatOptions(returningAction),
      title: vi.returning_action,
      defaultValue: props.returningActionDefault,
    },
    {
      key: "returned_reason",
      filterProps: props.filterReturnedReason,
      options: formatOptions(returnedReason),
      title: vi.returned_reason,
      defaultValue: props.returnedReasonDefault,
    },
    {
      key: "returned_action",
      filterProps: props.filterReturnedAction,
      options: formatOptions(returnedAction),
      title: vi.returned_action,
      defaultValue: props.returnedActionDefault,
    },
    {
      key: "reasons_created",
      filterProps: props.filterReasonCreated,
      options: [ALL_OPTION, ...OPTIONS_REASON_CREATED],
      title: vi.reason_created,
      defaultValue: props.reasonCreatedDefault,
    },
    {
      key: "handle_by",
      filterProps: props.filterHandleBy,
      options: [ALL_OPTION, ...map(userSlice.leaderAndTelesaleUsers, formatOptionSelect)],
      title: vi.transportation_care_handle_by,
      defaultValue: props.handleByDefault,
    },
    {
      key: "order_created",
      filterProps: props.filterOrderCreatedBy,
      options: [ALL_OPTION, ...map(userSlice.leaderAndTelesaleUsers, formatOptionSelect)],
      title: vi.order_created_by,
      defaultValue: props.orderCreatedByDefault,
    },

    {
      key: "tracking_status",
      filterProps: props.filterTrackingStatus,
      options: optionStatusShipping,
      title: vi.tracking_status,
      defaultValue: props.skylinkStatusDefault,
    },
    {
      key: "source",
      filterProps: props.filterReferringSite,
      options: [ALL_OPTION, ...map(leadSlice.attributes.channel, formatOptionSelect)],
      title: vi.source,
      defaultValue: props.referringSiteDefault,
    },
    {
      key: "tracking_company",
      filterProps: props.filterTrackingCompany,
      options: [
        ALL_OPTION,
        ...filter(TYPE_SHIPPING_COMPANIES, (item) => item.value !== SHIPPING_COMPANIES.NONE),
      ],
      title: vi.tracking_company,
      defaultValue: props.trackingCompanyDefault,
    },
  ];

  const rangeDateFilters: RangeDateFilterType[] = [
    {
      key: "tracking_created",
      filterProps: props.filterTrackingCreatedDate,
      title: vi.tracking_created,
      defaultValue: props?.trackingCreatedDefault,
      fromValue: props.params?.tracking_created_from,
      toValue: props.params?.tracking_created_to,
    },
    {
      key: "created",
      filterProps: props.filterDate,
      title: vi.TRANSPORTATION_CARE_CREATED_DATE,
      defaultValue: props?.filterDateDefault,
      fromValue: props.date_from,
      toValue: props.date_to,
    },
    {
      key: "completed_time",
      filterProps: props.filterConfirmDate,
      title: vi.ORDER_COMPLETED_TIME,
      defaultValue: props?.completedTimeDefault,
      fromValue: props.params?.completed_time_from,
      toValue: props.params?.completed_time_to,
    },
    {
      key: "assigned_date",
      filterProps: props.filterAssignedDate,
      title: vi.ASSIGNED_DATE,
      defaultValue: props?.assignedDateDefault,
      fromValue: props.params?.assigned_at_from,
      toValue: props.params?.assigned_at_to,
    },
  ];

  const listSelect: any[] = multiSelectFilters.map(
    (item) =>
      item.filterProps && {
        type: "select",
        multiSelectProps: {
          onChange: item.filterProps,
          options: item.options,
          title: item.title,
          defaultValue: item.defaultValue,
          style: selectorStyle,
        },
        key: item.key,
      }
  );

  const listRangeDate: any[] = rangeDateFilters.map(
    (item) =>
      item.filterProps && {
        type: "time",
        timeProps: {
          roadster: true,
          size: "small",
          sxProps: dateInputStyle,
          handleSubmit: (from: string, to: string, value: string | number) => {
            const { date_from, date_to, value: toValue } = compareDateSelected(from, to, value);
            [item.filterProps] && item.filterProps?.(date_from, date_to, toValue);
          },
          defaultDateValue: item.defaultValue,
          label: item.title,
          created_from: item.fromValue,
          created_to: item.toValue,
        },
      }
  );

  return [...listSelect, ...listRangeDate];
};

const selectorStyle = { width: 180 };
const dateInputStyle = { width: 180, marginLeft: 1 };

const KEYS_FILTER = {
  CALL_TIME: {
    label: "status",
    color: "#91f7a4",
    title: "Số lần gọi",
  },
  SOURCE: {
    label: "source",
    title: "Kênh bán hàng",
    color: "red",
  },
  TRACKING_STATUS: {
    label: "shipping_carrier_status",
    title: "Trạng thái vận đơn",
    color: "red",
  },
};

const { LATE, WAIT_RETURN, RETURNING, RETURNED } = TransportationCareTaskType;

export const transportationFilterChipOptions = ({
  userSlice,
  leadSlice,
  attributesTransporationCare,
  ...props
}: any): FilterChipType[] => {
  const {
    lateReason,
    lateAction,
    waitReturnReason,
    waitReturnAction,
    returningReason,
    returningAction,
    returnedReason,
    returnedAction,
  } = attributesTransporationCare;

  const listPerson: any = USER_FILTER_COLOR.map((item) => ({
    type: "select",
    options: [...map(userSlice.leaderAndTelesaleUsers, formatOptionSelect)],
    keysFilter: item,
  }));

  return [
    { type: "date", dateFilterKeys: DATE_OPTIONS_FILTER },
    {
      type: "select",
      options: initial(
        TRANSPORTATION_STATUS.slice(0, TRANSPORTATION_STATUS.length - 1) //bỏ tab thuộc tính
      ) as SelectOptionType[],
      keysFilter: { ...KEYS_FILTER.CALL_TIME, disabled: !props.isTabAll },
    },
    {
      type: "select",
      options: initial(
        TRANSPORTATION_STATUS.slice(0, TRANSPORTATION_STATUS.length - 1) //bỏ tab thuộc tính
      ) as SelectOptionType[],
      keysFilter: { ...KEYS_FILTER.CALL_TIME, disabled: !props.isTabAll },
    },
    {
      type: "select",
      options: lateReason,
      keysFilter: {
        label: `${LATE}_reason`,
        title: vi.late_reason,
        color: "primary",
      },
    },
    {
      type: "select",
      options: lateAction,
      keysFilter: {
        label: `${LATE}_action`,
        title: vi.late_action,
        color: "primary",
      },
    },
    {
      type: "select",
      options: waitReturnReason,
      keysFilter: {
        label: `${WAIT_RETURN}_reason`,
        title: vi.wait_return_reason,
        color: "primary",
      },
    },
    {
      type: "select",
      options: waitReturnAction,
      keysFilter: {
        label: `${WAIT_RETURN}_action`,
        title: vi.wait_return_action,
        color: "primary",
      },
    },
    {
      type: "select",
      options: returningReason,
      keysFilter: {
        label: `${RETURNING}_reason`,
        title: vi.returning_reason,
        color: "primary",
      },
    },
    {
      type: "select",
      options: returningAction,
      keysFilter: {
        label: `${RETURNING}_action`,
        title: vi.returning_action,
        color: "primary",
      },
    },
    {
      type: "select",
      options: returnedReason,
      keysFilter: {
        label: `${RETURNED}_reason`,
        title: vi.returned_reason,
        color: "primary",
      },
    },
    {
      type: "select",
      options: returnedAction,
      keysFilter: {
        label: `${RETURNED}_action`,
        title: vi.returned_action,
        color: "primary",
      },
    },
    {
      type: "select",
      options: [ALL_OPTION, ...OPTIONS_REASON_CREATED],
      keysFilter: {
        label: `reasons_created`,
        title: vi.reason_created,
        color: "primary",
      },
    },
    ...listPerson,
    {
      type: "select",
      options: [ALL_OPTION, ...map(leadSlice?.attributes.channel, formatOptionSelect)],
      keysFilter: KEYS_FILTER.SOURCE,
    },
    {
      type: "select",
      options: optionStatusShipping,
      keysFilter: KEYS_FILTER.TRACKING_STATUS,
    },
    {
      type: "select",
      options: [
        ALL_OPTION,
        ...filter(TYPE_SHIPPING_COMPANIES, (item: any) => item.value !== SHIPPING_COMPANIES.NONE),
      ],
      keysFilter: DELIVERY_FILTER,
    },
  ];
};

export const EXPORT_DATA_TO_GMAIL_KEY: { [key in string]: string } = {
  status: "Trạng thái CSVĐ",
  created: "Ngày tạo CSVĐ",
  "assign_by.name": "Người tạo CSVĐ",
  "handle_by.name": "Người nhận xử lý",
  modified: "Ngày xử lý",
  "modified_by.name": "Người xử lý",
  appointment_date: "Ngày hẹn gọi lại",
  note: "Ghi chú",
  late_created: `Ngày tạo ${vi.late}`,
  "late_reason.label": `Lí do ${vi.late}`,
  "late_action.label": `Hướng xử lý ${vi.late}`,
  wait_return_created: `Ngày tạo ${vi.wait_return}`,
  "wait_return_reason.label": `Lí do ${vi.wait_return}`,
  "wait_return_action.label": `Hướng xử lý ${vi.wait_return}`,
  returning_created: `Ngày tạo ${vi.returning}`,
  "returning_reason.label": `Lí do ${vi.returning}`,
  "returning_action.label": `Hướng xử lý ${vi.returning}`,
  returned_created: `Ngày tạo ${vi.returned}`,
  "returned_reason.label": `Lí do ${vi.returned}`,
  "returned_action.label": `Hướng xử lý ${vi.returned}`,
  "order.customer_name": "Tên khách hàng",
  "order.customer_phone": "SĐT khách hàng",
  "order.order_key": "Mã đơn hàng",
  "order.status": "Trạng thái đơn ",
  "order.created": "Ngày tạo đơn",
  "order.created_by.name": "Người tạo đơn",
  "order.completed_time": "Ngày xác nhận đơn",
  "order.total_actual": "Tổng đơn hàng",
  "order.source.name": "Kênh bán hàng",
  "order.shipping.carrier_status": "Trạng thái giao hàng",
  "order.shipping.delivery_company.name": "Đơn vị vận chuyển",
  "order.shipping.created": "Ngày tạo vận đơn",
  "order.shipping.created_by.name": "Người tạo vận đơn",
  "order.shipping.tracking_number": "Mã vận đơn",
  "order.shipping.expected_delivery_time": "Ngày giao dự kiến",
  "order.shipping.finish_date": "Ngày giao thành công",
};

export const TRANSPORTATION_TABS = (user: Partial<UserType> | null, roles: any) => [
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
        STATUS_ROLE_TRANSPORTATION.ALL
      ]
    }`,
    label: "Tất cả",
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    icon: <BallotIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
        STATUS_ROLE_TRANSPORTATION.NEW
      ]
    }`,
    label: "Mới",
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    icon: <AddIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
        STATUS_ROLE_TRANSPORTATION.PENDING
      ]
    }`,
    label: "Chờ xử lý",
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    icon: <PauseIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
        STATUS_ROLE_TRANSPORTATION.PROCESSING
      ]
    }`,
    label: "Đang xử lý",
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    icon: <ManageHistoryIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
        STATUS_ROLE_TRANSPORTATION.HANDLED
      ]
    }`,
    label: "Đã xử lý",
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    icon: <CheckCircleOutlineIcon />,
  },
  {
    path: `/${
      PATH_DASHBOARD[ROLE_TAB.TRANSPORTATION][STATUS_ROLE_TRANSPORTATION.STATUS][
        STATUS_ROLE_TRANSPORTATION.COMPLETED
      ]
    }`,
    label: "Hoàn thành",
    roles: isMatchRoles(
      user?.is_superuser,
      roles?.[ROLE_TAB.TRANSPORTATION]?.[STATUS_ROLE_TRANSPORTATION.STATUS]
    ),
    icon: <TaskAltIcon />,
  },
];

export const columnShowReport: {
  columnWidths: { columnName: string; width: number }[];
  columnsShowHeader: {
    name: string;
    title: string;
    isShow: boolean;
  }[];
} = {
  columnWidths: [
    { columnName: "name", width: 170 },
    { columnName: "reason", width: 170 },
    { columnName: "label", width: 170 },
    { columnName: "total", width: 170 },
    { columnName: "pending", width: 170 },
    { columnName: "processing", width: 170 },
    { columnName: "handled", width: 170 },
    { columnName: "completed", width: 170 },
  ],
  columnsShowHeader: [
    {
      name: "name",
      title: "Người được chia",
      isShow: true,
    },
    {
      name: "reason",
      title: "Lý do tạo task",
      isShow: true,
    },
    {
      name: "label",
      title: "Lý do cụ thể",
      isShow: true,
    },
    {
      name: "total",
      title: "Tổng",
      isShow: true,
    },
    {
      name: "pending",
      title: "Chờ xử lý",
      isShow: true,
    },
    {
      name: "processing",
      title: "Đang xử lý",
      isShow: true,
    },
    {
      name: "handled",
      title: "Đã xử lý",
      isShow: true,
    },
    {
      name: "completed",
      title: "Hoàn thành",
      isShow: true,
    },
  ],
};

export const ASSIGNED_REPORT_DIMENSIONS = [
  {
    label: "Người được chia",
    value: "handle_by__name",
  },
  {
    label: "Lí do",
    value: "reason_type",
  },
  {
    label: `Lí do ${vi.late}`,
    value: "late_reason__label",
  },
  {
    label: `Lí do ${vi.wait_return}`,
    value: "wait_return_reason__label",
  },
  {
    label: `Lí do ${vi.returning}`,
    value: "returning_reason__label",
  },
  {
    label: `Lí do ${vi.returned}`,
    value: "returned_reason__label",
  },
];

export const TRANSPORTATION_STATUS_OPTIONS: (SelectOptionType & {
  color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
})[] = [
  { label: "Mới", value: "new", color: "default" },
  { label: "Chờ xử lý", value: "pending", color: "info" },
  { label: "Đang xử lý", value: "processing", color: "warning" },
  { label: "Đã xử lý", value: "handled", color: "success" },
  { label: "Hoàn thành", value: "completed", color: "success" },
];
