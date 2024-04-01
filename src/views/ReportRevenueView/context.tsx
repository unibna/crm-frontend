// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Types
import { DispatchAction } from "_types_/ColumnType";

// Constants
import {
  ActionType,
  columnShowReportByDate,
  columnShowReportByChannel,
  columnShowReportByProduct,
  columnShowReportByProvince,
  columnShowReportByCreatedBy,
  paramsDefault,
} from "views/ReportRevenueView/constants";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_REPORT_REVENUE } from "constants/rolesTab";

// -----------------------------------------------------------------------

const initialState: Partial<any> = {
  [STATUS_ROLE_REPORT_REVENUE.BY_CHANNEL]: {
    columnsShow: getColumnsShow(columnShowReportByChannel.columnShowTable),
    resultColumnsShow: columnShowReportByChannel.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportByChannel.columnShowTable).length,
    columnsWidthResize: columnShowReportByChannel.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_REPORT_REVENUE.BY_CREATED_BY]: {
    columnsShow: getColumnsShow(columnShowReportByCreatedBy.columnShowTable),
    resultColumnsShow: columnShowReportByCreatedBy.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportByCreatedBy.columnShowTable).length,
    columnsWidthResize: columnShowReportByCreatedBy.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_REPORT_REVENUE.BY_DATE]: {
    columnsShow: getColumnsShow(columnShowReportByDate.columnShowTable),
    resultColumnsShow: columnShowReportByDate.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportByDate.columnShowTable).length,
    columnsWidthResize: columnShowReportByDate.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_REPORT_REVENUE.BY_PRODUCT]: {
    columnsShow: getColumnsShow(columnShowReportByProduct.columnShowTable),
    resultColumnsShow: columnShowReportByProduct.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportByProduct.columnShowTable).length,
    columnsWidthResize: columnShowReportByProduct.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_REPORT_REVENUE.BY_PROVINCE]: {
    columnsShow: getColumnsShow(columnShowReportByProvince.columnShowTable),
    resultColumnsShow: columnShowReportByProvince.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportByProvince.columnShowTable).length,
    columnsWidthResize: columnShowReportByProvince.columnWidths,
    columnSelected: [],
  },
  params: paramsDefault,
};

const reducerShipping = (state: Partial<any>, action: DispatchAction): Partial<any> => {
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

const ReportRevenueContext = createContext<{
  state: Partial<any>;
  updateColumn: (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => void;
  updateCell: (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => void;
  resizeColumn: (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => void;
  orderColumn: (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => void;
  updateParams: (payload: Partial<any>) => void;
}>({
  state: initialState,
  updateColumn: () => {},
  updateCell: () => {},
  resizeColumn: () => {},
  orderColumn: () => {},
  updateParams: () => {},
});

const ReportRevenueProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerShipping, initialState);

  const updateColumn = (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => {
    dispatch({
      type,
      payload,
    });
  };

  const updateCell = (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => {
    const columns = handleToggleVisibleColumn(
      payload,
      getObjectPropSafely(() => state[type].columnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const resizeColumn = (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => {
    dispatch({
      type,
      payload: {
        columnsWidthResize: payload,
      },
    });
  };

  const orderColumn = (type: STATUS_ROLE_REPORT_REVENUE, payload: Partial<any>) => {
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

  return (
    <ReportRevenueContext.Provider
      value={{ state, updateColumn, updateCell, resizeColumn, orderColumn, updateParams }}
    >
      {children}
    </ReportRevenueContext.Provider>
  );
};

export { ReportRevenueProvider, ReportRevenueContext };
