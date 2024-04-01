import { Typography } from "@mui/material";
import { keyFilter } from "_apis_/marketing/report_marketing.api";
import { keyFilter as keyFilterOrder } from "_apis_/order.api";
import {
  COMPARISON_TYPE,
  CREDENTIAL_TYPE,
  EXP_COMBINATION_TYPE,
  EXP_TYPE,
  FlowType,
  NodeDataType,
  NodeFlowType,
  OPERATION_TYPE,
} from "_types_/DataFlowType";
import { ColumnShow, ColumnShowDatagrid } from "_types_/FacebookType";
import { SelectOptionType } from "_types_/SelectOptionType";
import { SORT_TYPE } from "_types_/SortType";
import { Span, LabelColor } from "components/Labels";
import { INIT_ATTRIBUTE_OPTIONS, TYPE_FORM_FIELD } from "constants/index";
import { ROLE_TAB, STATUS_ROLE_CONTENT_ID, STATUS_ROLE_REPORT_REVENUE } from "constants/rolesTab";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import { isArray } from "lodash";
import reduce from "lodash/reduce";
import { handleParams, handleParamsApi } from "utils/formatParamsUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { valueGetParamsDefault } from "views/AccountantView/constants/columns";
import { filterData } from "views/AccountantView/constants/utils";
import {
  campaignObjective,
  colorLabelStatus,
  funcDataRenderHeaderDefault,
  headerFilterStatusStage,
  paramsGetDefault,
} from "views/ReportContentIdView/constants";
import { DIMENSION_VALUE } from "views/ReportRevenueView/constants";
import vi from "locales/vi.json";
import { LEAD_STATUS_OPTIONS } from "features/lead/handleFilter";

export const KEY_STORAGE_DATA_FLOW = "DATA_FLOW";

export enum INCLUSIVE {
  BOTH = "both",
  NEITHER = "neither",
  LEFT = "left",
  RIGHT = "right",
}

export enum HOW_TYPE {
  INNER = "inner",
  OUTER = "outer",
  LEFT = "left",
  RIGHT = "right",
  CROSS = "cross",
}

export enum ActionType {
  UPDATE_DATA_FLOW = "UPDATE_DATA_FLOW",
  UPDATE_FLOW = "UPDATE_FLOW",
  UPDATE_DRAWER = "UPDATE_DRAWER",
  CREATE_FLOW = "CREATE_FLOW",
  EDIT_FLOW = "EDIT_FLOW",
  CREATE_NODE = "CREATE_NODE",
  EDIT_NODE = "EDIT_NODE",
  ADD_INTERVAL_TIME = "ADD_INTERVAL_TIME",
  ADD_CRON_TIME = "ADD_CRON_TIME",
}

export enum FORMAT_DISPLAY {
  JSON = "json",
  TABLE = "table",
  FIXED = "fixed",
  INPUT = "input",
}

export enum INPUT_DISPLAY_TYPE {
  FIXED = "fixed",
  EXP = "expression",
}

export enum NODE_TYPE {
  WORKPLACE_CHATBOT = "node_workplace_chatbot",
  SKY_FEATURE = "node_sky_feature",
  DATETIME_RANGE = "node_datetime_range",
  DATETIME_CALCULATE = "node_datetime_calculate",
  SHORT_CIRCUIT = "node_short_circuit",
  TRANSFORM = "node_transform",
  MERGE_PARAMETER = "node_merge",
}

export enum INTERVAL_TIME {
  DAYS = "days",
  MINUTES = "minutes",
  HOURS = "hours",
}

export const TYPE_DATA = {
  LEAD: `${import.meta.env.REACT_APP_API_URL}/api/lead/leads`,
  [STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID]: `${
    import.meta.env.REACT_APP_REPORT_API
  }/api/marketing/aggregated/content-id/`,
  [STATUS_ROLE_CONTENT_ID.FACEBOOK_BY_CONTENT_ID]: `${
    import.meta.env.REACT_APP_REPORT_API
  }/api/marketing/facebook/content-id/`,
  [STATUS_ROLE_CONTENT_ID.GOOGLE_BY_CONTENT_ID]: `${
    import.meta.env.REACT_APP_REPORT_API
  }/api/marketing/google/content-id/`,
  [ROLE_TAB.REPORT_REVENUE]: `${import.meta.env.REACT_APP_API_URL}/api/orders/report/revenue/`,
  [ROLE_TAB.LEAD]: `${import.meta.env.REACT_APP_API_URL}/api/lead/leads/`,
};

export const VALUE_ARRAY_IN_FILTER = {
  [TYPE_DATA[ROLE_TAB.REPORT_REVENUE]]: keyFilterOrder,
  [TYPE_DATA[STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID]]: keyFilter,
};

export const titlePopupHandle = {
  [CREDENTIAL_TYPE.GOOGLE]: "Chỉnh sửa dữ liệu Google",
  [CREDENTIAL_TYPE.SKY_FEATURE]: "Chỉnh sửa dữ liệu Sky",
  [CREDENTIAL_TYPE.WORKPLACE_CHATBOT]: "Chỉnh sửa dữ liệu Workplace",
  [ActionType.CREATE_FLOW]: "Thêm mới flow",
  [ActionType.EDIT_FLOW]: "Chỉnh sửa flow",
  [ActionType.CREATE_NODE]: "Thêm mới node",
  [ActionType.EDIT_NODE]: "Chỉnh sửa node",
  [ActionType.ADD_INTERVAL_TIME]: "Setup khoảng thời gian lặp lại",
  [ActionType.ADD_CRON_TIME]: "Setup khoảng thời gian tùy chỉnh",
};

export const contentRenderDefault = {
  [CREDENTIAL_TYPE.GOOGLE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "token",
      label: "Token",
      placeholder: "Nhập token",
    },
  ],
  [CREDENTIAL_TYPE.SKY_FEATURE]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "email",
      label: "Email",
      placeholder: "Nhập email",
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "password",
      label: "Password",
      placeholder: "Nhập password",
      typeInput: "password",
    },
  ],
  [CREDENTIAL_TYPE.WORKPLACE_CHATBOT]: [
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "name",
      label: "Tên tài khoản",
      placeholder: "Nhập tên tài khoản",
      required: true,
    },
    {
      type: TYPE_FORM_FIELD.TEXTFIELD,
      name: "api_token",
      label: "Token",
      placeholder: "Nhập token",
    },
  ],
};

export const randomIdFlow = () => {
  return `Flowid_${new Date().getTime()}`;
};

export const randomIdNode = () => {
  return `nodeId__${new Date().getTime()}`;
};

export const objGetParams = {
  [TYPE_DATA[STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID]]: [
    ...paramsGetDefault,
    "digital_fb",
    "digital_gg",
    "campaign_objective",
    "status",
  ],
  [TYPE_DATA[ROLE_TAB.REPORT_REVENUE]]: ["dimension", ...valueGetParamsDefault],
  [TYPE_DATA[ROLE_TAB.LEAD]]: [
    "lead_status",
    "handler_assigned_dateValue",
    "handler_assigned_from",
    "handler_assigned_to",
    "created_to",
    "created_from",
    "created_dateValue",
    "handle_by",
    "created_by",
    "channel",
    "fanpage",
    "bad_data_reason",
    "fail_reason",
    "data_status",
    "process_done_from",
    "process_done_to",
    "process_done_dateValue",
    "call_later_at_from",
    "call_later_at_to",
    "call_later_at_dateValue",
  ],
};

// Option value
export const OPTION_NODE_TYPE: {
  label: string;
  value: NODE_TYPE;
  color: LabelColor;
  description: string;
}[] = [
  {
    label: "Node lấy dữ liệu",
    value: NODE_TYPE.SKY_FEATURE,
    description: "Lấy dữ liệu từ các nguồn như Lead, Content ID",
    color: "error",
  },
  {
    label: "Node xử lí dữ liệu",
    value: NODE_TYPE.TRANSFORM,
    description: "Xử lí dữ liệu",
    color: "warning",
  },
  {
    label: "Node thông báo về Workplace",
    value: NODE_TYPE.WORKPLACE_CHATBOT,
    description: "Gửi thông báo về workplace qua chatbot",
    color: "info",
  },
  {
    label: "Node xử lí thời gian",
    value: NODE_TYPE.DATETIME_RANGE,
    description: "Setup khung thời gian",
    color: "success",
  },
  {
    label: "Node tính toán thời gian",
    value: NODE_TYPE.DATETIME_CALCULATE,
    description: "Thời gian tính toán",
    color: "secondary",
  },
  {
    label: "Node điều kiện",
    value: NODE_TYPE.SHORT_CIRCUIT,
    description: "Nhận nguồn dữ liệu True hoặc False, kiểm tra nếu True tiếp tục, False dừng",
    color: "primary",
  },
  {
    label: "Node sáp nhập nhiều nguồn dữ liệu",
    value: NODE_TYPE.MERGE_PARAMETER,
    description: "Merge 2 nguồn dữ liệu lại với nhau",
    color: "default",
  },
];

export const OPTION_SCHEDULE = [
  {
    label: "Chạy chỉ một lần",
    value: "@once",
  },
  {
    label: "Chạy ngay khi lần trước đó kết thúc",
    value: "@continuous",
  },
  {
    label: "Chạy mỗi giờ một lần",
    value: "@hourly",
  },
  {
    label: "Chạy một lần một ngày lúc nửa đêm",
    value: "@daily",
  },
  {
    label: "Chạy một lần một tuần lúc nửa đêm vào Chủ Nhật",
    value: "@weekly",
  },
  {
    label: "Chạy một lần một tháng lúc nửa đêm vào đầu tháng",
    value: "@monthly",
  },
  {
    label: "Chạy mỗi quý một lần vào lúc nửa đêm (24:00) vào ngày đầu tiên",
    value: "@quarterly",
  },
  {
    label: "Chạy mỗi năm một lần vào nửa đêm (24:00) ngày 1 tháng 1",
    value: "@yearly",
  },
];

export const OPTION_TIME = [
  {
    label: "Hôm nay",
    value: "@today",
  },
];

export const OPTION_INTERVAL_TIME = [
  { label: "Days", value: INTERVAL_TIME.DAYS },
  { label: "Hours", value: INTERVAL_TIME.HOURS },
  { label: "Minutes", value: INTERVAL_TIME.MINUTES },
];

// Node SkyFeature
export const OPTION_SOURCE_GET_DATA: {
  label: string;
  value: string;
}[] = [
  { label: "Lead", value: TYPE_DATA[ROLE_TAB.LEAD] },
  {
    label: "Content ID Total - By Content ID",
    value: TYPE_DATA[STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID],
  },
  // {
  //   label: "Content ID Facebook",
  //   value: TYPE_DATA.CONTENT_ID_FACEBOOK,
  // },
  // {
  //   label: "Content ID Google",
  //   value: TYPE_DATA.CONTENT_ID_GOOGLE,
  // },
  {
    label: "Báo cáo doanh thu",
    value: TYPE_DATA[ROLE_TAB.REPORT_REVENUE],
  },
];

export const OPTION_GET_FIELD = [
  {
    label: "results",
    value: "results",
  },
  {
    label: "count",
    value: "count",
  },
];

// Node Transform
export const OPTION_EXP_TYPE: {
  label: string;
  value: EXP_TYPE;
}[] = [
  { label: "Slice", value: EXP_TYPE.SLICE },
  { label: "Compare", value: EXP_TYPE.COMPARE },
  { label: "Sort", value: EXP_TYPE.SORT },
  { label: "Filter", value: EXP_TYPE.FILTER },
  { label: "Length", value: EXP_TYPE.LENGTH },
  { label: "Multi Select", value: EXP_TYPE.MULTISELECT },
  { label: "Index", value: EXP_TYPE.INDEX },
  { label: "Get Object", value: EXP_TYPE.GET_OBJECT },
];

export const OPTION_SORT = [
  { label: "Tăng dần", value: SORT_TYPE.ASCENDING },
  { label: "Giảm dần", value: SORT_TYPE.DESCENDING },
];

export const OPTION_COMBINATION_EXP = [
  { label: "And", value: EXP_COMBINATION_TYPE.AND },
  { label: "Or", value: EXP_COMBINATION_TYPE.OR },
];

export const OPTION_OPERATION = [
  {
    label: "bằng",
    value: OPERATION_TYPE.EQUAL,
    usableTypes: [COMPARISON_TYPE.BOOLEAN, COMPARISON_TYPE.NUMBER],
  },
  {
    label: "khác",
    value: OPERATION_TYPE.NOT_EQUAL,
    usableTypes: [COMPARISON_TYPE.BOOLEAN, COMPARISON_TYPE.NUMBER],
  },
  {
    label: "bé hơn",
    value: OPERATION_TYPE.SMALLER,
    usableTypes: [COMPARISON_TYPE.NUMBER],
  },
  {
    label: "bé hơn hoặc bằng",
    value: OPERATION_TYPE.SMALLER_OR_EQUAL,
    usableTypes: [COMPARISON_TYPE.NUMBER],
  },
  {
    label: "lớn hơn",
    value: OPERATION_TYPE.GREATER,
    usableTypes: [COMPARISON_TYPE.NUMBER],
  },
  {
    label: "lớn hơn hoặc bằng",
    value: OPERATION_TYPE.GREATER_OR_EQUAL,
    usableTypes: [COMPARISON_TYPE.NUMBER],
  },
  {
    label: "có chứa",
    value: OPERATION_TYPE.CONTAINS,
    usableTypes: [COMPARISON_TYPE.STRING],
  },
  {
    label: "không chứa",
    value: OPERATION_TYPE.NOT_CONTAINS,
    usableTypes: [COMPARISON_TYPE.STRING],
  },
  {
    label: "kết thúc với",
    value: OPERATION_TYPE.END_WITH,
    usableTypes: [COMPARISON_TYPE.STRING],
  },
  {
    label: "không kết thúc với",
    value: OPERATION_TYPE.NOT_ENDS_WITH,
    usableTypes: [COMPARISON_TYPE.STRING],
  },
  {
    label: "bắt đầu với",
    value: OPERATION_TYPE.STARTS_WITH,
    usableTypes: [COMPARISON_TYPE.STRING],
  },
  {
    label: "không bắt đầu với",
    value: OPERATION_TYPE.NOT_STARTS_WITH,
    usableTypes: [COMPARISON_TYPE.STRING],
  },
  {
    label: "bằng rỗng",
    value: OPERATION_TYPE.IS_EMPTY,
    usableTypes: [COMPARISON_TYPE.STRING, COMPARISON_TYPE.NUMBER],
  },
  {
    label: "khác rỗng",
    value: OPERATION_TYPE.IS_NOT_EMPTY,
    usableTypes: [COMPARISON_TYPE.STRING, COMPARISON_TYPE.NUMBER],
  },
];

export const OPTION_COMPARISON = [
  { label: "Boolean", value: COMPARISON_TYPE.BOOLEAN },
  { label: "Number", value: COMPARISON_TYPE.NUMBER },
  { label: "String", value: COMPARISON_TYPE.STRING },
];

// Node Datetime Range
export const OPTION_FREQ = ["A", "B", "C", "D"];

export const OPTION_INCLUSIVE = [
  INCLUSIVE.BOTH,
  INCLUSIVE.LEFT,
  INCLUSIVE.NEITHER,
  INCLUSIVE.RIGHT,
];

// Node ShortCircuit
export const OPTION_FUNC_TYPE = ["any", "all"];

// Node Datetime Caculate
export const OPTION_OPERATION_DATETIME = ["add", "subtract"];

export const OPTION_TIME_UNIT = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];

// Node Merge
export const OPTION_HOW: {
  label: string;
  value: HOW_TYPE;
}[] = [
  {
    label: HOW_TYPE.LEFT,
    value: HOW_TYPE.LEFT,
  },
  {
    label: HOW_TYPE.RIGHT,
    value: HOW_TYPE.RIGHT,
  },
  {
    label: HOW_TYPE.INNER,
    value: HOW_TYPE.INNER,
  },
  {
    label: HOW_TYPE.OUTER,
    value: HOW_TYPE.OUTER,
  },
  {
    label: HOW_TYPE.CROSS,
    value: HOW_TYPE.CROSS,
  },
];

// Other
export const OPTION_TYPE_REPORT_REVENUE = [
  {
    label: vi.by_date,
    value: DIMENSION_VALUE[STATUS_ROLE_REPORT_REVENUE.BY_DATE],
  },
  {
    label: vi.by_channel,
    value: DIMENSION_VALUE[STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL],
  },
  {
    label: vi.by_product,
    value: DIMENSION_VALUE[STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT],
  },
  {
    label: vi.by_province,
    value: DIMENSION_VALUE[STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE],
  },
  {
    label: vi.by_buyer,
    value: DIMENSION_VALUE[STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY],
  },
];

export const OPTION_FORMAT_TYPE: {
  label: string;
  value: FORMAT_DISPLAY;
}[] = [
  {
    label: "JSON",
    value: FORMAT_DISPLAY.JSON,
  },
  {
    label: "Table",
    value: FORMAT_DISPLAY.TABLE,
  },
];

export const OPTION_FORMAT_FILTER: {
  label: string;
  value: FORMAT_DISPLAY;
}[] = [
  {
    label: "Tĩnh",
    value: FORMAT_DISPLAY.FIXED,
  },
  {
    label: "Input",
    value: FORMAT_DISPLAY.INPUT,
  },
];

export const OPTION_INPUT_DISPLAY_TYPE: {
  label: string;
  value: INPUT_DISPLAY_TYPE;
}[] = [
  {
    label: "Fixed",
    value: INPUT_DISPLAY_TYPE.FIXED,
  },
  {
    label: "Expression",
    value: INPUT_DISPLAY_TYPE.EXP,
  },
];

// Columns
export const columnShowFlowList: ColumnShowDatagrid<FlowType> = {
  columnWidths: [
    { width: 170, columnName: "name" },
    { width: 170, columnName: "start_date" },
    { width: 170, columnName: "end_date" },
    { width: 170, columnName: "description" },
    { width: 150, columnName: "operation" },
    // { width: 150, columnName: "schedule" },
    { columnName: "is_paused", width: 120 },
  ],
  columnsShowHeader: [
    { name: "name", title: "Tên flow", isShow: true },
    { name: "description", title: "Mô tả", isShow: true },
    // { name: "schedule", title: "Trạng thái chạy", isShow: true },
    { name: "start_date", title: "Ngày bắt đầu", isShow: true },
    { name: "end_date", title: "Ngày kết thúc", isShow: true },
    { name: "is_paused", title: "Trạng thái", isShow: true },
    { name: "operation", title: "Thao tác", isShow: true },
  ],
  columnShowTable: [
    {
      title: "Tên flow",
      name: "name",
      column: "name",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Mô tả",
      name: "description",
      column: "description",
      isShow: true,
      isShowTitle: false,
    },
    // {
    //   title: "Trạng thái chạy",
    //   name: "schedule",
    //   column: "schedule",
    //   isShow: true,
    //   isShowTitle: false,
    // },
    {
      title: "Ngày bắt đầu",
      name: "start_date",
      column: "start_date",
      isShow: true,
      isShowTitle: false,
    },
    {
      title: "Ngày kết thúc",
      name: "end_date",
      column: "end_date",
      isShow: true,
      isShowTitle: false,
    },
  ],
};

// Default value
export const initFlowDefault = {
  id: randomIdFlow(),
  name: "",
  description: "",
  nodes: [],
  edges: [],
};

export const initNodeDefault: NodeFlowType = {
  id: randomIdNode(),
  name: "",
  description: "",
  type: NODE_TYPE.WORKPLACE_CHATBOT,
  position: { x: 500, y: 500 },
  data: {},
};

// Schema yup
export const convertSchema = (type: NODE_TYPE, yup: any) => {
  switch (type) {
    case NODE_TYPE.WORKPLACE_CHATBOT: {
      return {
        messages: yup.string(),
        recipient: yup.array(),
        credential: yup.string().required("Vui lòng chọn chứng chỉ"),
      };
    }
    case NODE_TYPE.SKY_FEATURE: {
      return {
        url: yup.string().required("Vui lòng chọn nguồn dữ liệu filter"),
        get_fields: yup.string(),
        query_parameters: yup.array(),
        credential: yup.string().required("Vui lòng chọn chứng chỉ"),
        filter: yup.mixed(),
      };
    }
    case NODE_TYPE.TRANSFORM: {
      return {
        entry_values: yup.string(),
        expressions: yup.array(),
      };
    }
    case NODE_TYPE.DATETIME_CALCULATE: {
      return {
        date_values: yup.string().required("Vui lòng giá trị ngày"),
        operation: yup.string(),
        periods: yup.string(),
        time_unit: yup.string(),
      };
    }
    case NODE_TYPE.DATETIME_RANGE: {
      return {
        start: yup.string(),
        end: yup.string(),
        freq: yup.string(),
        inclusive: yup.string(),
        unit: yup.string(),
        periods: yup.number(),
      };
    }
    case NODE_TYPE.SHORT_CIRCUIT: {
      return {
        entry_values: yup.string(),
        func_type: yup.string(),
      };
    }
    case NODE_TYPE.MERGE_PARAMETER: {
      return {
        right_values: yup.string(),
        left_values: yup.string(),
        how: yup.string(),
        on: yup.string().required("Vui lòng nhập giá trị"),
        sort: yup.bool(),
        indicator: yup.bool(),
      };
    }
    default: {
      return {};
    }
  }
};

export const convertDefaultData = (type: NODE_TYPE, defaultValue: Partial<any>) => {
  switch (type) {
    case NODE_TYPE.WORKPLACE_CHATBOT: {
      return {
        messages: getObjectPropSafely(() => defaultValue.data.messages) || "",
        recipient: getObjectPropSafely(() => defaultValue.data.recipient) || [],
        credential: getObjectPropSafely(() => defaultValue.data.credential) || "",
      };
    }
    case NODE_TYPE.SKY_FEATURE: {
      return {
        filter: {
          limit: 30,
          ...(getObjectPropSafely(() => defaultValue.data.filter) || {}),
        },
        url: getObjectPropSafely(() => defaultValue.data.url) || "",
        get_fields:
          getObjectPropSafely(() => defaultValue.data.get_fields) || OPTION_GET_FIELD[0].value,
        credential: getObjectPropSafely(() => defaultValue.data.credential) || "",
      };
    }
    case NODE_TYPE.TRANSFORM: {
      return {
        entry_values: getObjectPropSafely(() => defaultValue.data.entry_values) || "",
        expressions: getObjectPropSafely(() => defaultValue.data.expressions) || [],
      };
    }
    case NODE_TYPE.DATETIME_CALCULATE: {
      return {
        date_values: getObjectPropSafely(() => defaultValue.data.date_values) || "",
        operation: getObjectPropSafely(() => defaultValue.data.operation) || "add",
        periods: getObjectPropSafely(() => defaultValue.data.periods) || 1,
        time_unit: getObjectPropSafely(() => defaultValue.data.time_unit) || "days",
      };
    }
    case NODE_TYPE.DATETIME_RANGE: {
      return {
        start: getObjectPropSafely(() => defaultValue.data.start) || "",
        end: getObjectPropSafely(() => defaultValue.data.end) || "",
        freq: getObjectPropSafely(() => defaultValue.data.freq) || "D",
        inclusive: getObjectPropSafely(() => defaultValue.data.inclusive) || INCLUSIVE.BOTH,
        unit: getObjectPropSafely(() => defaultValue.data.unit) || "",
        periods: getObjectPropSafely(() => defaultValue.data.periods) || 1,
      };
    }
    case NODE_TYPE.SHORT_CIRCUIT: {
      return {
        entry_values: getObjectPropSafely(() => defaultValue.data.entry_values) || "",
        func_type: getObjectPropSafely(() => defaultValue.data.func_type) || "all",
      };
    }
    case NODE_TYPE.MERGE_PARAMETER: {
      return {
        right_values: getObjectPropSafely(() => defaultValue.data.right_values) || "",
        left_values: getObjectPropSafely(() => defaultValue.data.left_values) || "",
        how: getObjectPropSafely(() => defaultValue.data.how) || HOW_TYPE.INNER,
        on: getObjectPropSafely(() => defaultValue.data.on) || "",
        sort: getObjectPropSafely(() => defaultValue.data.sort) || false,
        indicator: getObjectPropSafely(() => defaultValue.data.indicator) || false,
      };
    }
    default: {
      return {};
    }
  }
};

export const convertParamsApiNode = (
  type: NODE_TYPE | string = NODE_TYPE.WORKPLACE_CHATBOT,
  value: NodeDataType
) => {
  switch (type) {
    case NODE_TYPE.WORKPLACE_CHATBOT: {
      return {
        messages: value.messages,
        recipient: value.recipient,
        credential: value.credential,
      };
    }
    case NODE_TYPE.SKY_FEATURE: {
      const newFilter = handleParamsApi(value.filter, [
        ...objGetParams[TYPE_DATA[STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID]],
        ...objGetParams[TYPE_DATA[ROLE_TAB.REPORT_REVENUE]],
        ...objGetParams[TYPE_DATA[ROLE_TAB.LEAD]],
      ]);

      const newQuery = reduce(
        Object.keys(newFilter || {}),
        (prevArr, current) => {
          if (isArray(getObjectPropSafely(() => value?.filter?.[current]))) {
            const values = reduce(
              getObjectPropSafely(() => value?.filter?.[current]),
              (prevArrChild, item) => {
                return [
                  ...prevArrChild,
                  {
                    key: current,
                    value: item,
                  },
                ];
              },
              []
            );

            return [...prevArr, ...values];
          }

          return [
            ...prevArr,
            handleParams({
              key: current,
              value: getObjectPropSafely(() => value?.filter?.[current]),
            }),
          ];
        },
        []
      );

      return {
        url: value.url,
        get_fields: [value.get_fields],
        query_parameters: newQuery,
        credential: value.credential,
      };
    }
    case NODE_TYPE.TRANSFORM: {
      return {
        entry_values: convertValueInputApi(value.entry_values),
        expressions: value.expressions,
      };
    }
    case NODE_TYPE.DATETIME_CALCULATE: {
      return {
        date_values: getObjectPropSafely(() => value.date_values),
        operation: getObjectPropSafely(() => value.operation),
        periods: getObjectPropSafely(() => value.periods),
        time_unit: getObjectPropSafely(() => value.time_unit),
      };
    }
    case NODE_TYPE.DATETIME_RANGE: {
      return {
        start: !value?.start
          ? ""
          : getObjectPropSafely(() => value?.static_data?.formatFilter.start) ===
            FORMAT_DISPLAY.INPUT
          ? value?.start
          : format(new Date(value?.start), yyyy_MM_dd),
        end: !value?.end
          ? ""
          : getObjectPropSafely(() => value?.static_data?.formatFilter.end) === FORMAT_DISPLAY.INPUT
          ? value?.end
          : format(new Date(value?.end), yyyy_MM_dd),
        inclusive: getObjectPropSafely(() => value.inclusive),
        periods: getObjectPropSafely(() => value.periods),
      };
    }
    case NODE_TYPE.SHORT_CIRCUIT: {
      return {
        entry_values: convertValueInputApi(value.entry_values),
        func_type: value.func_type,
      };
    }
    case NODE_TYPE.MERGE_PARAMETER: {
      return {
        right_values: convertValueInputApi(value?.right_values),
        left_values: convertValueInputApi(value?.left_values),
        how: value.how,
        on: value.on,
        sort: value.sort,
        indicator: value.indicator,
      };
    }
    default: {
      return {};
    }
  }
};

export const handleNodeGetApiFlow = (
  type: NODE_TYPE | string = NODE_TYPE.WORKPLACE_CHATBOT,
  value: Partial<any>,
  static_data?: {
    filterArray?: string[];
    formatFilter?: Partial<any>;
  }
) => {
  switch (type) {
    case NODE_TYPE.WORKPLACE_CHATBOT: {
      const newValue = {
        messages: value.messages,
        recipient: value.recipient,
        credential: value.credential,
      };

      if (getObjectPropSafely(() => value?.static_data?.messages.isGetInput)) {
        return {
          ...newValue,
          messages: "",
        };
      }

      if (getObjectPropSafely(() => value?.static_data?.recipient.isGetInput)) {
        return {
          ...newValue,
          recipient: [],
        };
      }

      return newValue;
    }
    case NODE_TYPE.SKY_FEATURE: {
      const filter = reduce(
        value.query_parameters,
        (prevObj, current) => {
          return (static_data?.filterArray || []).includes(current.key)
            ? {
                ...prevObj,
                [current.key]: [...(prevObj[current.key] || []), current.value],
              }
            : { ...prevObj, [current.key]: current.value };
        },
        {}
      );

      return {
        url: value.url,
        get_fields: value.get_fields[0],
        filter,
        credential: value.credential,
      };
    }
    case NODE_TYPE.TRANSFORM: {
      return {
        entry_values: convertInputGetApi(value.entry_values),
        expressions: value.expressions,
      };
    }
    case NODE_TYPE.DATETIME_CALCULATE: {
      return {
        date_values: getObjectPropSafely(() => value.date_values),
        operation: getObjectPropSafely(() => value.operation),
        periods: getObjectPropSafely(() => value.periods),
        time_unit: getObjectPropSafely(() => value.time_unit),
      };
    }
    case NODE_TYPE.DATETIME_RANGE: {
      return {
        start: getObjectPropSafely(() => value.start),
        end: getObjectPropSafely(() => value.end),
        freq: getObjectPropSafely(() => value.freq),
        inclusive: getObjectPropSafely(() => value.inclusive),
        unit: getObjectPropSafely(() => value.unit),
        periods: getObjectPropSafely(() => value.periods),
      };
    }
    case NODE_TYPE.SHORT_CIRCUIT: {
      return {
        entry_values: convertInputGetApi(value.entry_values),
        func_type: value.func_type,
      };
    }
    case NODE_TYPE.MERGE_PARAMETER: {
      return {
        right_values: convertInputGetApi(value.right_values),
        left_values: convertInputGetApi(value.left_values),
        how: value.how,
        on: value.on,
        sort: value.sort,
        indicator: value.indicator,
      };
    }
    default: {
      return {};
    }
  }
};

export const convertFilterSkyFeature = (
  type: string,
  dataFilter: {
    dataFilterCreator: SelectOptionType[];
    dataFilterDesign: SelectOptionType[];
    dataFilterTeam: SelectOptionType[];
    dataFilterProduct: SelectOptionType[];
    dataFilterDigitalFb: SelectOptionType[];
    dataFilterDigitalGg: SelectOptionType[];
    headerFilterChannel: SelectOptionType[];
    headerFilterCreatedBy: SelectOptionType[];
    headerFilterTelesale: SelectOptionType[];
    headerFilterProduct: SelectOptionType[];
    headerFilterFanpage: SelectOptionType[];
    headerFilterBadDataReason: SelectOptionType[];
    headerFilterFailReason: SelectOptionType[];
    headerFilterDataStatus: SelectOptionType[];
  }
) => {
  switch (type) {
    case TYPE_DATA[STATUS_ROLE_CONTENT_ID.TOTAL_BY_CONTENT_ID]: {
      return [
        {
          style: {
            width: 200,
          },
          title: "Digital Facebook",
          options: dataFilter.dataFilterDigitalFb,
          label: "digital_fb",
          defaultValue: dataFilter.dataFilterDigitalFb[0].value,
        },
        {
          style: {
            width: 200,
          },
          title: "Digital Google",
          options: dataFilter.dataFilterDigitalGg,
          label: "digital_gg",
          defaultValue: dataFilter.dataFilterDigitalGg[0].value,
        },
        {
          style: {
            width: 200,
          },
          title: "Mục tiêu Campaign",
          options: [
            {
              label: "Tất cả",
              value: "all",
            },
            ...campaignObjective,
          ],
          label: "campaign_objective",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Trạng thái",
          options: headerFilterStatusStage,
          label: "status",
          defaultValue: headerFilterStatusStage[0].value,
          renderOptionTitleFunc: ({ option }: any) => (
            <>
              {option.value !== "all" ? (
                <Span
                  variant="ghost"
                  color={
                    colorLabelStatus[getObjectPropSafely(() => option.label.trim())] || "default"
                  }
                >
                  {option.label}
                </Span>
              ) : (
                <Typography variant="body2">{option.label}</Typography>
              )}
            </>
          ),
        },
        ...funcDataRenderHeaderDefault(dataFilter),
      ];
    }
    case TYPE_DATA[ROLE_TAB.REPORT_REVENUE]: {
      return [
        {
          style: {
            width: 200,
          },
          title: "Báo cáo theo",
          options: OPTION_TYPE_REPORT_REVENUE,
          label: "dimension",
          defaultValue: OPTION_TYPE_REPORT_REVENUE[0].value,
          multiple: true,
        },
        ...filterData({
          optionChannel: dataFilter.headerFilterChannel,
          optionCreatedBy: dataFilter.headerFilterCreatedBy,
          optionTags: [],
        }),
      ];
    }
    case TYPE_DATA[ROLE_TAB.LEAD]: {
      return [
        {
          style: {
            width: 200,
          },
          title: "Trạng thái đơn",
          options: LEAD_STATUS_OPTIONS,
          label: "lead_status",
          defaultValue: LEAD_STATUS_OPTIONS[0].value,
        },
        {
          style: {
            width: 200,
          },
          title: "Người được chia số",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterTelesale],
          label: "handle_by",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Người tạo",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterCreatedBy],
          label: "created_by",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Kênh bán hàng",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterChannel],
          label: "channel",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Sản phẩm",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterProduct],
          label: "product",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Fanpage",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterFanpage],
          label: "fanpage",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Lý do dữ liệu KCL",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterBadDataReason],
          label: "bad_data_reason",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Lý do không mua",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterFailReason],
          label: "fail_reason",
          defaultValue: "all",
        },
        {
          style: {
            width: 200,
          },
          title: "Trạng thái dữ liệu",
          options: [...INIT_ATTRIBUTE_OPTIONS, ...dataFilter.headerFilterDataStatus],
          label: "data_status",
          defaultValue: "all",
        },
        {
          type: TYPE_FORM_FIELD.DATE,
          title: "Thời gian tạo",
          keyDateFrom: "created_from",
          keyDateTo: "created_to",
          keyDateValue: "created_dateValue",
        },
        {
          type: TYPE_FORM_FIELD.DATE,
          title: "Thời gian chia số",
          keyDateFrom: "handler_assigned_from",
          keyDateTo: "handler_assigned_to",
          keyDateValue: "handler_assigned_dateValue",
        },
        {
          type: TYPE_FORM_FIELD.DATE,
          title: "Thời gian hoàn tất xử lý",
          keyDateFrom: "process_done_from",
          keyDateTo: "process_done_to",
          keyDateValue: "process_done_dateValue",
        },
        {
          type: TYPE_FORM_FIELD.DATE,
          title: "Thời gian gọi lại",
          keyDateFrom: "call_later_at_from",
          keyDateTo: "call_later_at_to",
          keyDateValue: "call_later_at_dateValue",
        },
      ];
    }
    default: {
      return [];
    }
  }
};

export const convertInputGetApi = (value: string) => {
  const newReg = new RegExp(/[{{}}]/, "gi");
  return value.replace(newReg, "");
};

export const convertValueInputApi = (value: string = "") => {
  return `{{${value}}}`;
};

export const checkValueReg = (value: any, format: FORMAT_DISPLAY = FORMAT_DISPLAY.FIXED) => {
  return format === FORMAT_DISPLAY.INPUT || /[{{}}]/gi.test(value.toString()) ? "" : value;
};

// Columns
export const columnShowLogs: ColumnShow = {
  columnWidths: [
    // { width: 170, columnName: "dag_id" },
    { width: 120, columnName: "dag_run_id" },
    { width: 120, columnName: "state" },
    { width: 200, columnName: "logical_date" },
    { width: 120, columnName: "run_type" },
    // { width: 190, columnName: "last_scheduling_decision" },
    { width: 200, columnName: "start_date" },
    { width: 200, columnName: "end_date" },
    { width: 150, columnName: "duration" },
    { width: 150, columnName: "note" },
    // { width: 150, columnName: "execution_date" },
    // { width: 150, columnName: "external_trigger" },
    // { width: 170, columnName: "data_interval_start" },
    // { width: 170, columnName: "data_interval_end" },
  ],
  columnsShowHeader: [
    // { name: "dag_id", title: "FlowId", isShow: true },
    { name: "dag_run_id", title: "Lần chạy", isShow: true },
    { name: "state", title: "Trạng thái", isShow: true },
    { name: "logical_date", title: "Thời điểm chạy (lí thuyết)", isShow: true },
    { name: "run_type", title: "Loại kích hoạt", isShow: true },
    // { name: "last_scheduling_decision", title: "", isShow: true },
    { name: "start_date", title: "Thời điểm bắt đầu chạy (thực tế)", isShow: true },
    { name: "end_date", title: "Thời điểm kết thúc chạy", isShow: true },
    { name: "duration", title: "Tổng thời gian chạy", isShow: true },
    { name: "note", title: "Ghi chú", isShow: true },
    // { name: "execution_date", title: "Thao tác", isShow: true },
    // { name: "external_trigger", title: "Thao tác", isShow: true },
    // { name: "data_interval_start", title: "Ngày kết thúc", isShow: true },
    // { name: "data_interval_end", title: "Trạng thái", isShow: true },
  ],
};

export const TASK_STATUS = {
  failed: { value: "failed", label: "Thất bại", color: "error" },
  success: { value: "success", label: "Thành công", color: "success" },
};

export const RUN_TYPE = {
  manual: { value: "manual", label: "Thủ công", color: "warning" },
  scheduled: { value: "scheduled", label: "Tự động", color: "info" },
};
