import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { FacebookType } from "_types_/FacebookType";
import { ActionMap } from "./AuthenticationType";
export interface ColumnType<T> {
  title: string;
  name: keyof T;
}
export interface FacebookColumnType<T> {
  title?: string;
  name?: keyof T;
  isShow: boolean;
  field?: keyof T;
  headerName?: string;
}

export interface ColumnTypeDefault<T> {
  title: string;
  name: keyof T;
  isShow?: boolean;
  nameColumn?: string;
  description?: string;
  [key: string]: any;
}
export interface FacebookColumnTypeTest<T> {
  title: string;
  name: keyof T;
  isShow: boolean;
}

export interface ColumnWidthType<T> {
  width: number | string;
  columnName: keyof T;
}

type ColumnPosition = "left" | "center" | "right";

export interface MColumnType {
  title?: string;
  name?: string;
  isShow: boolean;
  field?: string;
  headerName?: string;
  align?: ColumnPosition;
  headerAlign?: ColumnPosition;
  minWidth?: number;
  disableColumnMenu?: boolean;
}

export interface ColumnsVisibleProps {
  isShow: boolean;
  title: string;
}
export interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnSelected: string[];
}
export interface ItemColumnsDatagrid<T> {
  columnsShow: ColumnTypeDefault<T>[];
  resultColumnsShow: ColumnTypeDefault<T>[];
  columnsWidthResize?: TableColumnWidthInfo[];
  countShowColumn?: number;
  columnSelected?: string[];
}
export interface DispatchAction {
  type: any;
  payload: any;
}

export enum ColumnActionTypes {
  SetCW = "SET_CW",
  SetCO = "SET_CO",
  SetParams = "SET_PARAMS",
  SetHC = "SET_HC",
  SetIsFullRow = "SET_ISFULLROW",
  SetSort = "SET_SORT",
}

export type TableActionPayload = {
  [ColumnActionTypes.SetCW]: {
    columnWidths: TableColumnWidthInfo[];
  };
  [ColumnActionTypes.SetCO]: {
    columnOrders: string[];
  };
  [ColumnActionTypes.SetParams]: {
    params: any;
  };
  [ColumnActionTypes.SetHC]: {
    hiddenColumns: string[];
  };
  [ColumnActionTypes.SetIsFullRow]: {
    isFullRow: boolean;
  };
  [ColumnActionTypes.SetSort]: {
    sort: any;
  };
};

export type TableActions = ActionMap<TableActionPayload>[keyof ActionMap<TableActionPayload>];
