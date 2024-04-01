// Libraries
import { createContext, Dispatch } from "react";
import produce from "immer";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";

// Constants
import {
  actionType,
  columnShowManage,
} from "views/ManageFileView/constants";

// -------------------------------------------------------------------
interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnSelected: string[];
}

interface InitialState {
  manage: ItemColumns;
}
interface DispatchAction {
  type: string;
  payload: any;
}

const initialState: InitialState = {
  manage: {
    columnsShow: columnShowManage.columnsShowHeader,
    resultColumnsShow: columnShowManage.columnsShowHeader,
    countShowColumn: columnShowManage.columnsShowHeader.length,
    columnsWidthResize: columnShowManage.columnWidths,
    columnSelected: [],
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

const StoreManageFile = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerManageFile = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { manage } = state;

  switch (action.type) {
    case actionType.UPDATE_MANAGE: {
      const columns = handleToggleVisibleColumn(
        payload,
        manage.columnsShow,
        manage.resultColumnsShow
      );

      return {
        ...state,
        manage: {
          ...state.manage,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_MANAGE: {
      return {
        ...state,
        manage: {
          ...state.manage,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_MANAGE: {
      const columns = handleChangeColumnOrders(payload, manage.resultColumnsShow);

      return {
        ...state,
        manage: {
          ...state.manage,
          ...columns,
        },
      };
    }
    default: {
      return { ...state };
    }
  }
};

export { StoreManageFile, reducerManageFile, initialState };
