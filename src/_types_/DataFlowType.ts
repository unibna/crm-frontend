import { NODE_TYPE } from "views/DataFlow/constants";
import { GeneralType } from "./GeneralType";

// export type EXP_TYPE =
//   | "slice"
//   | "sort"
//   | "filter"
//   | "length"
//   | "multiselect"
//   | "index"
//   | "get_object";

export enum EXP_TYPE {
  COMPARE = "compare",
  SLICE = "slice",
  SORT = "sort",
  FILTER = "filter",
  LENGTH = "length",
  MULTISELECT = "multiselect",
  INDEX = "index",
  GET_OBJECT = "get_object",
}

export enum COMPARISON_TYPE {
  BOOLEAN = "boolean",
  NUMBER = "number",
  STRING = "string",
}

export enum OPERATION_TYPE {
  EQUAL = "==",
  NOT_EQUAL = "!=",
  SMALLER = "<",
  SMALLER_OR_EQUAL = "<=",
  GREATER = ">",
  GREATER_OR_EQUAL = ">=",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  END_WITH = "ends_with",
  NOT_ENDS_WITH = "not_ends_with",
  STARTS_WITH = "starts_with",
  NOT_STARTS_WITH = "not_starts_with",
  IS_EMPTY = "is_empty",
  IS_NOT_EMPTY = "is_not_empty",
}

export enum CONTENT_TYPE {
  LEAD = "lead",
  CONTENT_ID = "content_id",
}

export enum EXP_COMBINATION_TYPE {
  AND = "and",
  OR = "or",
}
export interface FlowType extends GeneralType {
  id?: string;
  name?: string;
  schedule?: string;
  start_date?: string;
  end_date?: string;
  is_paused?: boolean;
  description?: string;
  nodes?: NodeFlowType[];
  edges?: EdgeFlowType[];
  tags?: string[];
}

export interface ConditionType {
  key: string;
  value?: string;
  operation: OPERATION_TYPE;
  type: COMPARISON_TYPE;
}

export interface NodeDataType {
  value?: string;
  name?: string;
  static_data?: Partial<any>;
  description?: string;

  // Workplace Chatbot
  messages?: string;
  recipient?: string[];
  credential?: string;

  // Sky Feature
  url?: string;
  get_fields?: string;
  query_parameters?: string;
  filter?: Partial<any>;

  // Transform
  entry_values?: string;
  expressions?: any[];

  // Datetime Caculate
  date_values?: string;
  operation?: string;
  periods?: number;
  time_unit?: string;

  // Datetime Range
  start?: string;
  end?: string;
  freq?: string;
  inclusive?: string;
  unit?: string;

  // Short Circuit
  func_type?: "all" | "any";

  // Merge
  right_values?: string;
  left_values?: string;
  how?: string;
  on?: string;
  sort?: boolean;
  indicator?: boolean;
}
export interface NodeFlowType {
  id: string;
  type?: NODE_TYPE | string;
  position: {
    x: number;
    y: number;
  };
  name?: string;
  static_data?: Partial<any>;
  description?: string;
  data: NodeDataType;
  dependencies?: string[];
}

export interface EdgeFlowType {
  id: string;
  source: string;
  target: string;
}

// Attributes
export enum CREDENTIAL_TYPE {
  GOOGLE = "google",
  SKY_FEATURE = "sky_feature",
  WORKPLACE_CHATBOT = "workplace_chatbot",
}

export interface DATA_CREDENTIAL_TYPE {
  name?: string;
  credential?: {
    type?: CREDENTIAL_TYPE;
    data?: {
      token?: string;
      url?: string;
      email?: string;
      password?: string;
      api_token?: string;
    };
  };
  id?: string;
}

export interface FlowLogType extends GeneralType {
  dag_id?: string;
  state?: string;
  dag_run_id?: string;
  data_interval_start?: string;
  data_interval_end?: string;
  start_date?: string;
  end_date?: string;
  execution_date?: string;
  external_trigger?: boolean;
  last_scheduling_decision?: string;
  logical_date?: string;
  note?: string | null;
  run_type?: string;
  duration?: number;
  conf?: any
}
