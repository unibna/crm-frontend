// Libraries
import { createContext, Dispatch } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import produce from "immer";

// Constants
import { actionType, reportSellerByDateColumns, reportTeamByDateColumns } from "./constants";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { VariantNotificationType } from "contexts/ToastContext";
interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
}
interface InitialState {
  reportSellerByDate: ItemColumns;
  reportTeamByDate: ItemColumns;
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
  reportSellerByDate: {
    columnsShow: reportSellerByDateColumns.columnsShowHeader,
    resultColumnsShow: reportSellerByDateColumns.columnsShowHeader,
    countShowColumn: reportSellerByDateColumns.columnsShowHeader.length,
    columnsWidthResize: reportSellerByDateColumns.columnWidths,
  },
  reportTeamByDate: {
    columnsShow: reportTeamByDateColumns.columnsShowHeader,
    resultColumnsShow: reportTeamByDateColumns.columnsShowHeader,
    countShowColumn: reportTeamByDateColumns.columnsShowHeader.length,
    columnsWidthResize: reportTeamByDateColumns.columnWidths,
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
  const { columnsOrder } = payload;
  const arrResult = columnsOrder.reduce((prevArr: any, name: string) => {
    const column = arrResultColumnsShow.find((item) => item.name === name);
    return [...prevArr, column];
  }, []);

  return {
    resultColumnsShow: arrResult,
  };
};

const StoreSaleOnlineReport = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerSaleOnlineReport = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { reportSellerByDate, reportTeamByDate } = state;
  const tableName: "reportSellerByDate" | "reportTeamByDate" = payload.tableName;
  delete payload.tableName;

  switch (action.type) {
    case actionType.UPDATE_DATA_TABLE: {
      let columns: any = [];

      if (tableName === "reportSellerByDate") {
        columns = handleToggleVisibleColumn(
          payload,
          reportSellerByDate.columnsShow,
          reportSellerByDate.resultColumnsShow
        );
      } else {
        columns = handleToggleVisibleColumn(
          payload,
          reportTeamByDate.columnsShow,
          reportTeamByDate.resultColumnsShow
        );
      }

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
          ...payload,
        },
      };
    }

    case actionType.UPDATE_COLUMN_TABLE: {
      let columns: any = [];

      if (tableName === "reportSellerByDate") {
        columns = handleChangeColumnOrders(
          payload,

          reportSellerByDate.resultColumnsShow
        );
      } else {
        columns = handleChangeColumnOrders(
          payload,

          reportTeamByDate.resultColumnsShow
        );
      }

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

    case actionType.UPDATE_REPORT_SELLER_BY_DATE: {
      const columns = handleToggleVisibleColumn(
        payload,
        reportSellerByDate.columnsShow,
        reportSellerByDate.resultColumnsShow
      );

      return {
        ...state,
        reportSellerByDate: {
          ...state.reportSellerByDate,
          ...columns,
        },
      };
    }

    case actionType.UPDATE_REPORT_TEAM_BY_DATE: {
      const columns = handleToggleVisibleColumn(
        payload,
        reportTeamByDate.columnsShow,
        reportTeamByDate.resultColumnsShow
      );

      return {
        ...state,
        reportTeamByDate: {
          ...state.reportTeamByDate,
          ...columns,
        },
      };
    }

    case actionType.UPDATE_COLUMN_ORDER_REPORT_SELLER_BY_DATE: {
      const columns = handleChangeColumnOrders(payload, reportSellerByDate.resultColumnsShow);

      return {
        ...state,
        reportSellerByDate: {
          ...state.reportSellerByDate,
          ...columns,
        },
      };
    }

    case actionType.UPDATE_COLUMN_ORDER_REPORT_TEAM_BY_DATE: {
      const columns = handleChangeColumnOrders(payload, reportTeamByDate.resultColumnsShow);

      return {
        ...state,
        reportTeamByDate: {
          ...state.reportTeamByDate,
          ...columns,
        },
      };
    }

    case actionType.RESIZE_COLUMN_REPORT_SELLER_BY_DATE: {
      return {
        ...state,
        reportSellerByDate: {
          ...state.reportSellerByDate,
          ...payload,
        },
      };
    }

    case actionType.RESIZE_COLUMN_REPORT_TEAM_BY_DATE: {
      return {
        ...state,
        reportTeamByDate: {
          ...state.reportTeamByDate,
          ...payload,
        },
      };
    }

    default: {
      return { ...state };
    }
  }
};

export { StoreSaleOnlineReport, reducerSaleOnlineReport, initialState };
