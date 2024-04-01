// Libraries
import { createContext, Dispatch } from "react";
import { ColumnBands, TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import produce from "immer";

// Constants
import { actionType, totalReportColumns, totalRevenueColumns } from "./constants";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { VariantNotificationType } from "contexts/ToastContext";

export interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnsBand?: ColumnBands[];
}
interface InitialState {
  totalRevenue: ItemColumns;
  totalReport: ItemColumns;
  notifications: {
    message: string;
    variant: VariantNotificationType;
  };
}

interface DispatchAction {
  type: string;
  payload: any;
}

const initialState: InitialState = {
  totalRevenue: {
    columnsShow: totalRevenueColumns.columnsShowHeader,
    resultColumnsShow: totalRevenueColumns.columnsShowHeader,
    countShowColumn: totalRevenueColumns.columnsShowHeader.length,
    columnsWidthResize: totalRevenueColumns.columnWidths,
    columnsBand: [],
  },
  totalReport: {
    columnsShow: totalReportColumns.columnsShowHeader,
    resultColumnsShow: totalReportColumns.columnsShowHeader,
    countShowColumn: totalReportColumns.columnsShowHeader.length,
    columnsWidthResize: totalReportColumns.columnWidths,
  },
  notifications: {
    message: "",
    variant: "info",
  },
};

const handleToggleVisibleColumn = (
  column: any,
  arrColumnsShow: ColumnTypeDefault<FacebookType>[],
  arrResultColumnsShow: ColumnTypeDefault<FacebookType>[]
) => {
  const { isShow, name } = column;
  let resultColumnsShow = [];
  const index = arrColumnsShow.findIndex((item) => item.name === name);
  const columnsShow = produce(arrColumnsShow, (draft) => {
    draft[index].isShow = !isShow;
  });

  if (isShow) {
    resultColumnsShow = arrResultColumnsShow.filter((item) => item.name !== name);
  } else {
    resultColumnsShow = columnsShow.filter((item: ColumnTypeDefault<FacebookType>) => item.isShow);
  }

  return {
    columnsShow,
    resultColumnsShow,
    countShowColumn: resultColumnsShow.length,
  };
};

const handleChangeColumnOrders = (
  payload: any,
  arrResultColumnsShow: ColumnTypeDefault<FacebookType>[]
) => {
  const arrResult = payload.reduce((prevArr: any, name: string) => {
    const column = arrResultColumnsShow.find((item) => item.name === name);
    return [...prevArr, column];
  }, []);

  return {
    resultColumnsShow: arrResult,
  };
};

const StoreDashboard = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerDashboard = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const tableName: "totalRevenue" | "totalReport" = payload.tableName;
  delete payload.tableName;

  switch (action.type) {
    case actionType.CHANGE_COLUMN: {
      return {
        ...state,
        [tableName]: {
          ...state[tableName],
          ...payload,
        },
      };
    }

    case actionType.UPDATE_DATA_TABLE: {
      const columns = handleToggleVisibleColumn(
        payload.columns,
        state[tableName].columnsShow,
        state[tableName].resultColumnsShow
      );

      return {
        ...state,
        [tableName]: {
          ...state[tableName],
          ...columns,
        },
      };
    }

    case actionType.RESIZE_COLUMN_TABLE: {
      return {
        ...state,
        [tableName]: {
          ...state[tableName],
          columnsWidthResize: payload.columns,
        },
      };
    }

    case actionType.UPDATE_COLUMN_TABLE: {
      const columns = handleChangeColumnOrders(payload.column, state[tableName].resultColumnsShow);
      return {
        ...state,
        [tableName]: {
          ...state[tableName],
          ...columns,
        },
      };
    }

    case actionType.UPDATE_COLUMN_ORDER: {
      const columns = handleChangeColumnOrders(payload.columns, state[tableName].resultColumnsShow);
      return {
        ...state,
        [tableName]: {
          ...state[tableName],
          ...columns,
        },
      };
    }

    case actionType.UPDATE_NOTIFICATIONS: {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...payload,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export { StoreDashboard, reducerDashboard, initialState };
