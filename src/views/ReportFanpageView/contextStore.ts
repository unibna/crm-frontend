// Libraries
import { createContext, Dispatch } from "react";
import produce from "immer";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

// Constants
import { actionType } from "views/ReportFanpageView/constants";
import { columnShowFanpage, columnShowPost } from "views/ReportFanpageView/constants";
import { yyyy_MM_dd } from "constants/time";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import format from "date-fns/format";
import subDays from "date-fns/subDays";

interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnSelected: string[];
  dataFilter?: any;
}

interface InitialState {
  fanpage: ItemColumns;
  post: ItemColumns;
  params:
    | {
        date_from?: string;
        date_to?: string;
        dateValue?: string | number;
        effective_status?: string | string[];
        objective?: string | string[];
      }
    | any;
}

interface DispatchAction {
  type: string;
  payload: any;
}

const initialState: InitialState = {
  fanpage: {
    columnsShow: columnShowFanpage.columnsShowHeader,
    resultColumnsShow: columnShowFanpage.columnsShowHeader,
    countShowColumn: columnShowFanpage.columnsShowHeader.length,
    columnsWidthResize: columnShowFanpage.columnWidths,
    columnSelected: [],
    dataFilter: {
      dataFilterFanpage: [
        {
          label: "Tất cả",
          value: "all",
        },
      ],
    },
  },
  post: {
    columnsShow: columnShowPost.columnsShowHeader,
    resultColumnsShow: columnShowPost.columnsShowHeader,
    countShowColumn: columnShowPost.columnsShowHeader.length,
    columnsWidthResize: columnShowPost.columnWidths,
    columnSelected: [],
    dataFilter: {
      dataFilterFanpage: [
        {
          label: "Tất cả",
          value: "all",
        },
      ],
    },
  },
  params: {
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  },
};

const StoreReportFanpage = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

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

const reducerReportFanpage = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { fanpage, post } = state;

  switch (action.type) {
    case actionType.UPDATE_FANPAGE: {
      const columns = handleToggleVisibleColumn(
        payload,
        fanpage.columnsShow,
        fanpage.resultColumnsShow
      );

      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_POST: {
      const columns = handleToggleVisibleColumn(payload, post.columnsShow, post.resultColumnsShow);

      return {
        ...state,
        post: {
          ...state.post,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_FANPAGE: {
      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_POST: {
      return {
        ...state,
        post: {
          ...state.post,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_FANPAGE: {
      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_FANPAGE: {
      const columns = handleChangeColumnOrders(payload, fanpage.resultColumnsShow);

      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_POST: {
      const columns = handleChangeColumnOrders(payload, post.resultColumnsShow);

      return {
        ...state,
        post: {
          ...state.post,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_DATA_FILTER_POST: {
      return {
        ...state,
        post: {
          ...state.post,
          dataFilter: {
            ...state.post.dataFilter,
            ...payload,
          },
        },
      };
    }
    case actionType.UPDATE_DATA_FILTER_FANPAGE: {
      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          dataFilter: {
            ...state.fanpage.dataFilter,
            ...payload,
          },
        },
      };
    }
    case actionType.UPDATE_PARAMS: {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export { StoreReportFanpage, reducerReportFanpage, initialState };
