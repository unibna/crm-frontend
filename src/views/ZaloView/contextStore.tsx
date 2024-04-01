// Libraries
import { createContext, ReactNode, useReducer, Dispatch } from "react";
import produce from "immer";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { SelectOptionType } from "_types_/SelectOptionType";

// Contants & Utils
import {
  columnShowListAccount,
  columnShowManualOanNotification,
  columnShowManualZnsNotification,
  columnShowAutomaticNotification,
  actionType,
} from "views/ZaloView/constants";
import { yyyy_MM_dd } from "constants/time";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
import { VariantNotificationType } from "contexts/ToastContext";

interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnSelected: string[];
}

interface DataFilterType {
  dataAccountOaZalo: SelectOptionType[];
}

interface InViewType {
  isViewListAccount: boolean;
  isViewTemplate: boolean;
  isViewOverview: boolean;
  isViewChartFollower: boolean;
  isViewChartNotification: boolean;
  isViewChartZns: boolean;
}

interface InitialStateType {
  listAccount: ItemColumns;
  manualOanNotification: ItemColumns;
  manualZnsNotification: ItemColumns;
  automaticNotification: ItemColumns;
  dataFilter: Partial<DataFilterType>;
  params: Partial<any>;
  oaFilter: Partial<any>;
  inView: Partial<InViewType>;
  isRefresh: boolean;
  notifications: {
    message: string;
    variant: VariantNotificationType;
  };
}

interface DispatchAction {
  type: string;
  payload: any;
}

const initialState: InitialStateType = {
  listAccount: {
    columnsShow: columnShowListAccount.columnsShowHeader,
    resultColumnsShow: columnShowListAccount.columnsShowHeader,
    countShowColumn: columnShowListAccount.columnsShowHeader.length,
    columnsWidthResize: columnShowListAccount.columnWidths,
    columnSelected: [],
  },
  manualOanNotification: {
    columnsShow: columnShowManualOanNotification.columnsShowHeader,
    resultColumnsShow: columnShowManualOanNotification.columnsShowHeader,
    countShowColumn: columnShowManualOanNotification.columnsShowHeader.length,
    columnsWidthResize: columnShowManualOanNotification.columnWidths,
    columnSelected: [],
  },
  manualZnsNotification: {
    columnsShow: columnShowManualZnsNotification.columnsShowHeader,
    resultColumnsShow: columnShowManualZnsNotification.columnsShowHeader,
    countShowColumn: columnShowManualZnsNotification.columnsShowHeader.length,
    columnsWidthResize: columnShowManualZnsNotification.columnWidths,
    columnSelected: [],
  },
  automaticNotification: {
    columnsShow: columnShowAutomaticNotification.columnsShowHeader,
    resultColumnsShow: columnShowAutomaticNotification.columnsShowHeader,
    countShowColumn: columnShowAutomaticNotification.columnsShowHeader.length,
    columnsWidthResize: columnShowAutomaticNotification.columnWidths,
    columnSelected: [],
  },
  dataFilter: {},
  params: {
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  },
  inView: {
    isViewListAccount: false,
    isViewTemplate: false,
    isViewOverview: false,
    isViewChartFollower: false,
    isViewChartNotification: false,
    isViewChartZns: false,
  },
  oaFilter: {},
  isRefresh: true,
  notifications: {
    message: "",
    variant: "info",
  },
};

const ZaloContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

type ZaloProviderProps = {
  children: ReactNode;
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

const reducerZalo = (state: InitialStateType, action: DispatchAction): InitialStateType => {
  const {
    listAccount,
    manualOanNotification,
    manualZnsNotification,
    automaticNotification,
    dataFilter,
    params,
    inView,
    oaFilter,
  } = state;
  const { payload = {} } = action;

  switch (action.type) {
    case actionType.UPDATE_LIST_ACCOUNT: {
      const columns = handleToggleVisibleColumn(
        payload,
        listAccount.columnsShow,
        listAccount.resultColumnsShow
      );

      return {
        ...state,
        listAccount: {
          ...state.listAccount,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_MANUAL_OAN_NOTIFICATION: {
      const columns = handleToggleVisibleColumn(
        payload,
        manualOanNotification.columnsShow,
        manualOanNotification.resultColumnsShow
      );

      return {
        ...state,
        manualOanNotification: {
          ...manualOanNotification,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_MANUAL_ZNS_NOTIFICATION: {
      const columns = handleToggleVisibleColumn(
        payload,
        manualZnsNotification.columnsShow,
        manualZnsNotification.resultColumnsShow
      );

      return {
        ...state,
        manualZnsNotification: {
          ...manualZnsNotification,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_AUTOMATIC_NOTIFICATION: {
      const columns = handleToggleVisibleColumn(
        payload,
        automaticNotification.columnsShow,
        automaticNotification.resultColumnsShow
      );

      return {
        ...state,
        automaticNotification: {
          ...automaticNotification,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_LIST_ACCOUNT: {
      return {
        ...state,
        listAccount: {
          ...state.listAccount,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_MANUAL_OAN_NOTIFICATION: {
      return {
        ...state,
        manualOanNotification: {
          ...manualOanNotification,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_MANUAL_ZNS_NOTIFICATION: {
      return {
        ...state,
        manualZnsNotification: {
          ...manualZnsNotification,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_AUTOMATIC_NOTIFICATION: {
      return {
        ...state,
        automaticNotification: {
          ...automaticNotification,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_LIST_ACCOUNT: {
      const columns = handleChangeColumnOrders(payload, listAccount.resultColumnsShow);

      return {
        ...state,
        listAccount: {
          ...state.listAccount,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_MANUAL_OAN_NOTIFICATION: {
      const columns = handleChangeColumnOrders(payload, manualOanNotification.resultColumnsShow);

      return {
        ...state,
        manualOanNotification: {
          ...manualOanNotification,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_MANUAL_ZNS_NOTIFICATION: {
      const columns = handleChangeColumnOrders(payload, manualZnsNotification.resultColumnsShow);

      return {
        ...state,
        manualZnsNotification: {
          ...manualZnsNotification,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_AUTOMATIC_NOTIFICATION: {
      const columns = handleChangeColumnOrders(payload, automaticNotification.resultColumnsShow);

      return {
        ...state,
        automaticNotification: {
          ...automaticNotification,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_LIST_ACCOUNT: {
      return {
        ...state,
        listAccount: {
          ...listAccount,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_DATA_FILTER: {
      return {
        ...state,
        dataFilter: {
          ...dataFilter,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_PARAMS: {
      return {
        ...state,
        params: {
          ...params,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_OA_FILTER: {
      return {
        ...state,
        oaFilter: {
          ...oaFilter,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_IN_VIEW: {
      return {
        ...state,
        inView: {
          ...inView,
          ...payload,
        },
      };
    }
    case actionType.REFRESH_DATA: {
      return {
        ...state,
        ...payload,
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

const ZaloProvider = ({ children }: ZaloProviderProps) => {
  const [state, dispatch] = useReducer(reducerZalo, initialState);

  return (
    <ZaloContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ZaloContext.Provider>
  );
};

export { ZaloProvider, ZaloContext };
