import { ROLE_TYPE } from "constants/rolesTab";
import FilterSet from "views/AirtableV2/components/Filter/FilterSet";

export enum AirTableColumnLabels {
  LINK_TO_RECORD = "Link to another record",
  SINGLE_LINE_TEXT = "Single Line Text",
  LONG_TEXT = "Long Text",
  ATTACHMENT = "Attachment",
  CHECKBOX = "Checkbox",
  MULTIPLE_SELECT = "Multiple Select",
  SINGLE_SELECT = "Single Select",
  SINGLE_USER = "Single User",
  MULTIPLE_USER = "Multiple User",
  DATE = "Date",
  DATETIME = "Date Time",
  DURATION = "Duration",
  PHONE_NUMBER = "Phone Number",
  EMAIL = "Email",
  URL = "URL",
  NUMBER = "Number",
  CURRENCY = "Currency",
  PERCENT = "Percent",
  AUTO_NUMBER = "Auto Number",
}

export enum AirTableColumnTypes {
  LINK_TO_RECORD = "LINK_TO_RECORD",
  SINGLE_LINE_TEXT = "SINGLE_LINE_TEXT",
  LONG_TEXT = "LONG_TEXT",
  ATTACHMENT = "ATTACHMENT",
  CHECKBOX = "CHECKBOX",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  SINGLE_SELECT = "SINGLE_SELECT",
  MULTIPLE_USER = "MULTIPLE_USER",
  SINGLE_USER = "SINGLE_USER",
  DATE = "DATE",
  DATETIME = "DATETIME",
  DURATION = "DURATION",
  PHONE_NUMBER = "PHONE_NUMBER",
  EMAIL = "EMAIL",
  URL = "URL",
  NUMBER = "NUMBER",
  CURRENCY = "CURRENCY",
  PERCENT = "PERCENT",
  AUTO_NUMBER = "AUTO_NUMBER",
}

export enum Alignment {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export enum HISTORY_ACTION_TYPE {
  PUT_TABLE = "put_table",
  PUT_VIEW = "put_view",
  PUT_FIELD = "put_field",
  PUT_RECORD = "put_record",
  PUT_CELL = "put_cell",
}

export enum MATH_FUNCTIONS {
  SUM = "SUM",
  AVERAGE = "AVERAGE",
  MIN = "MIN",
  MAX = "MAX",
  EMPTY = "EMPTY",
  FILLED = "FILLED",
}

export enum ActionType {
  UPDATE_PARAMS = "UPDATE_PARAMS",
  UPDATE_LOADING = "UPDATE_LOADING",
  UPDATE_DATA = "UPDATE_DATA",
}

export enum SortDirection {
  ASCENDING = "Ascending",
  DESCENDING = "Descending",
}

export enum ROW_HEIGHT_TYPES {
  SHORT = "short",
  MEDIUM = "medium",
  TALL = "tall",
  EXTRA_TALL = "extra_tall",
}

export enum AirTableViewTypes {
  GRID = "grid",
  // FORM = "form",
  KANBAN = "kanban",
}

export interface AirTableColumn {
  id: string;
  width: number;
  name: string;
  description?: string;
  type: AirTableColumnTypes;
  options?: {
    choices?: AirTableOption[];
    choiceOrder?: AirTableOption["id"][];
    recordDisplay?: string;
    feType?: AirTableColumnTypes;
    tableLinkToRecordId?: string;
  };
  isCreateByFe?: boolean;
}

export interface AirTableFieldConfig {
  field_id: string;
  visible: boolean;
  width: number;
  field_configs?: any;
}

export interface AirTableView {
  id?: string;
  type: AirTableViewTypes;
  name: string;
  description?: string;
  visible_fields: AirTableFieldConfig[];
  options?: {
    filterSet?: FilterSet;
    sortSet?: SortItem[];
    permission?: {
      [key: string]: ROLE_TYPE;
    };
    fieldKanban?: string;
    rowHeight?: ROW_HEIGHT_TYPES;
    fixedFields?: string[];
  };
}

export interface AirTableField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: {
    choices?: { [key: string]: AirTableOption };
    choiceOrder?: string[];
    feType?: AirTableColumnTypes;
  };
}

export interface AirTableBase {
  id: string;
  description: string;
  name: string;
  next_auto_value?: number;
  primary_key?: string;
  records?: {
    [key: string]: {
      id: string;
      field: string;
      value: any;
    }[];
  };
  views: AirTableView[];
  fields: AirTableField[];
  options?: {
    permission?: {
      [key: string]: ROLE_TYPE;
    };
  };
}

export interface AirTableLogs {
  id: string;
  created: string;
  user_id: string;
  user_name: string;
  object: any;
  object_type: string;
  object_id: string;
  type: string;
}

export interface SortItem {
  id: string;
  columnId: string;
  ascending: boolean;
}

export type AirTableOption = {
  id: string;
  name: string | any;
  color?: string;
  image?: any;
};

export type AirTableCell = {
  id: string;
  created?: string;
  field: string;
  record: string;
  table: string;
  cell: {
    type: string;
    value: any;
  };
};

export type AirTableRow = {
  id: string;
  fields: {
    id: string;
    field: string;
    value: any;
  }[];
};

export type AirTableData = {
  [key: string]: // key là id của column(field)
  | {
        id: string; // id của cell
        value: any; // value của cell
      }
    | any;

  id?: string; // id của row(record)
};

export type InsertColumnProps = {
  column: AirTableColumn;
  direction: "left" | "right";
  duplicateData?: boolean;
};

export type InsertRowProps = {
  row: AirTableRow;
  direction: "above" | "below";
  duplicateData?: boolean;
};

export type BaseProps = {
  id: string;
  name: string;
  description?: string;
  views?: any;
  fields?: any[];
  icon?: any;
  color?: string;
};

export interface BaseBoxProps extends BaseProps {
  onClick: any;
  MenuComponent?: JSX.Element;
}

export type LinkRecordProps = {
  dataTable?: AirTableBase;
  cell?: {
    id?: string;
    value?: {
      record_id: string;
      record_display: string;
    }[];
  };
  column: AirTableColumn;
  row: any;
  records: any;
  onChange: (
    cell: any,
    column: AirTableColumn,
    row: any,
    records: any[]
  ) => (newValues: any) => void;
};

export type SelectedCellRangeType = {
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
};

export type ReactTableRowType = {
  allCells: {
    column: any;
    row: any;
    value: { id: string; value: any };
    render: (type: any, userProps: any) => any;
    getCellProps: (userProps: any) => any;
  }[];
  cells: {
    column: any;
    row: any;
    value: { id: string; value: any };
    render: (type: any, userProps: any) => any;
    getCellProps: (userProps: any) => any;
  }[];
  depth: number;
  id: string;
  index: number;
  original: AirTableData;
  originalSubRows: any[];
  subRows: any[];
  value: {
    [key: string]: {
      id?: string;
      value?: any;
    };
  };
};

export interface GridViewPropsType {
  columns: AirTableColumn[];
  data: AirTableData[];
  view: AirTableView;
  fieldConfigsObject: { [key: string]: AirTableFieldConfig };
  viewPermission?: ROLE_TYPE;
  linkTables: { [key: string]: AirTableBase };
  setLinkTables: (newLinkTables: { [key: string]: AirTableBase }) => void;
  onChangeColumn: (
    column: AirTableColumn,
    optional?: {
      insertColumn?: InsertColumnProps;
      action?: () => void;
      actionSuccess?: () => void;
      actionError?: () => void;
    }
  ) => void;
  onChangeRow: (
    row: AirTableData,
    records: AirTableRow[],
    optional?: {
      insertRow?: InsertRowProps;
      action?: (result?: any) => void;
    }
  ) => void;
  onChangeCell: (cell: AirTableCell, records: AirTableRow[], optional?: any) => void;
  onChangeMultiCell: (cells: AirTableCell[], records: AirTableRow[], optional?: any) => void;
  onChangeView: (view: AirTableView, optional?: any) => void;
  onDeleteField: (id: AirTableColumn["id"]) => void;
  onDeleteRow: (id: AirTableRow["id"]) => void;
  onOpenLinkRecordPopup: (props: LinkRecordProps) => void;
  onUpdateTable: (data: Partial<AirTableBase>, action?: (newData: AirTableBase) => any) => void;
}
