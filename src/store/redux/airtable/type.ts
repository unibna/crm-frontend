import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";

export const UPDATE_CSKH_AIRTABLE = 'airtable/updateCskh';
export const RESIZE_COLUMN_CSKH_AIRTABLE = 'airtable/resizeColumnCskh';
export const UPDATE_COLUMN_ORDER_CSKH_AIRTABLE = 'airtable/updateColumnOrderCskh';
export const UPDATE_DATA_FILTER_AIRTABLE = 'airtable/updateDataFilter';
export const UPDATE_PARAMS_AIRTABLE = 'airtable/updateParams';

export type UpdateColumnAction = {
  type: typeof UPDATE_CSKH_AIRTABLE,
  payload: {
    column: ColumnTypeDefault<FacebookType>
  }
}

export type ResizeColumnAction = {
  type: typeof RESIZE_COLUMN_CSKH_AIRTABLE,
  payload: {
    columnsWidthResize: TableColumnWidthInfo[]
  }
}

export type UpdateColumnOrderAction = {
  type: typeof UPDATE_COLUMN_ORDER_CSKH_AIRTABLE,
  payload: {
    columnsOrder: string[]
  }
}

export type UpdateDataFilterAction = {
  type: typeof UPDATE_DATA_FILTER_AIRTABLE,
  payload: {
    [key: string]: any
  }
}

export type UpdateParamsAction = {
  type: typeof UPDATE_PARAMS_AIRTABLE,
  payload: {
    [key: string]: any
  }
}