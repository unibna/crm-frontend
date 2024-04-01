// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Types
import { DispatchAction } from "_types_/ColumnType";

// Constants
import { ActionType } from "constants/index";
import { ACCOUNTANT_PATH } from "routes/paths";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import {
  columnShowReportOrder,
  columnShowReportOrderItem,
  columnShowReportOrderKpi,
} from "views/AccountantView/constants/columns";
import { paramsDefault } from "views/AccountantView/constants";

// -----------------------------------------------------------------------

const initialState: Partial<any> = {
  [ACCOUNTANT_PATH.REPORT_ORDER]: {
    columnsShow: getColumnsShow(columnShowReportOrder.columnShowTable),
    resultColumnsShow: columnShowReportOrder.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportOrder.columnShowTable).length,
    columnsWidthResize: columnShowReportOrder.columnWidths,
    columnSelected: [],
  },
  [ACCOUNTANT_PATH.REPORT_ORDER_ITEM]: {
    columnsShow: getColumnsShow(columnShowReportOrderItem.columnShowTable),
    resultColumnsShow: columnShowReportOrderItem.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportOrderItem.columnShowTable).length,
    columnsWidthResize: columnShowReportOrderItem.columnWidths,
    columnSelected: [],
  },
  [ACCOUNTANT_PATH.REPORT_KPI]: {
    columnsShow: getColumnsShow(columnShowReportOrderKpi.columnShowTable),
    resultColumnsShow: columnShowReportOrderKpi.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportOrderKpi.columnShowTable).length,
    columnsWidthResize: columnShowReportOrderKpi.columnWidths,
    columnSelected: [],
  },
  params: paramsDefault,
  tags: [],
  dataPopup: {},
};

const reducerReportOrder = (state: Partial<any>, action: DispatchAction): Partial<any> => {
  const { payload = {} } = action;

  switch (action.type) {
    case ActionType.UPDATE_PARAMS: {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        },
      };
    }
    case ActionType.UPDATE_TAGS: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          ...payload,
        },
      };
    }
  }
};

const ReportOrderContext = createContext<{
  state: Partial<any>;
  updateColumn: (type: ACCOUNTANT_PATH, payload: Partial<any>) => void;
  updateCell: (type: ACCOUNTANT_PATH, payload: Partial<any>) => void;
  resizeColumn: (type: ACCOUNTANT_PATH, payload: Partial<any>) => void;
  orderColumn: (type: ACCOUNTANT_PATH, payload: Partial<any>) => void;
  updateParams: (payload: Partial<any>) => void;
  updateTags: (payload: Partial<any>) => void;
}>({
  state: initialState,
  updateColumn: () => {},
  updateCell: () => {},
  resizeColumn: () => {},
  orderColumn: () => {},
  updateParams: () => {},
  updateTags: () => {},
});

const ReportOrderProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerReportOrder, initialState);

  const updateColumn = (type: ACCOUNTANT_PATH, payload: Partial<any>) => {
    dispatch({
      type,
      payload,
    });
  };

  const updateCell = (type: ACCOUNTANT_PATH, payload: Partial<any>) => {
    const columns = handleToggleVisibleColumn(
      payload,
      getObjectPropSafely(() => state[type].columnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const resizeColumn = (type: ACCOUNTANT_PATH, payload: Partial<any>) => {
    dispatch({
      type,
      payload: {
        columnsWidthResize: payload,
      },
    });
  };

  const orderColumn = (type: ACCOUNTANT_PATH, payload: Partial<any>) => {
    const columns = handleChangeColumnOrders(
      payload,
      getObjectPropSafely(() => state[type].resultColumnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const updateParams = (payload: Partial<any>) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload: payload,
    });
  };

  const updateTags = (payload: Partial<any>) => {
    dispatch({
      type: ActionType.UPDATE_TAGS,
      payload: payload,
    });
  };

  return (
    <ReportOrderContext.Provider
      value={{
        state,
        updateColumn,
        updateCell,
        resizeColumn,
        orderColumn,
        updateParams,
        updateTags,
      }}
    >
      {children}
    </ReportOrderContext.Provider>
  );
};

export { ReportOrderContext, ReportOrderProvider };
