import {
  UPDATE_CSKH_AIRTABLE,
  RESIZE_COLUMN_CSKH_AIRTABLE,
  UPDATE_COLUMN_ORDER_CSKH_AIRTABLE,
  UPDATE_DATA_FILTER_AIRTABLE,
  UPDATE_PARAMS_AIRTABLE,

  UpdateColumnAction,
  ResizeColumnAction,
  UpdateColumnOrderAction,
  UpdateDataFilterAction,
  UpdateParamsAction
} from "./type"

export const updateCskhColumn = (params?: any): UpdateColumnAction => {
  return {
    type: UPDATE_CSKH_AIRTABLE,
    payload: params
  }
}

export const resizeColumnCskh = (params?: any): ResizeColumnAction => {
  return {
    type: RESIZE_COLUMN_CSKH_AIRTABLE,
    payload: params
  }
}

export const updateColumnOrderCskh = (params?: any): UpdateColumnOrderAction => {
  return {
    type: UPDATE_COLUMN_ORDER_CSKH_AIRTABLE,
    payload: params
  }
}

export const updateDataFilter = (params?: any): UpdateDataFilterAction => {
  return {
    type: UPDATE_DATA_FILTER_AIRTABLE,
    payload: params
  }
}

export const updateParams = (params?: any): UpdateParamsAction => {
  return {
    type: UPDATE_PARAMS_AIRTABLE,
    payload: params
  }
}

