//hooks
import { Dispatch, SetStateAction, useReducer } from "react";

//components
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

//utils
import {
  DEFAULT_ORDER_CO,
  ORDER_COLUMNS_SHOW_SORT,
  ORDER_COLUMN_WIDTHS,
} from "../constants/columns";

//types
import { ColumnActionTypes, TableActions } from "_types_/ColumnType";
import { ColumnShowSortType } from "_types_/DGridType";

export let ALL_ORDER_STORAGE = "tab-all-order";

// const tabStorage = getStorage(ALL_ORDER_STORAGE);
const tabStorage = undefined;

export interface TabAllReducerType {
  tabAllCW: TableColumnWidthInfo[];
  setTabAllCW: Dispatch<SetStateAction<TableColumnWidthInfo[]>>;
  tabAllCO: string[];
  setTabAllCO: Dispatch<SetStateAction<string[]>>;
  tabAllParams: any;
  setTabAllParams: Dispatch<SetStateAction<any>>;
  tabAllHC: string[];
  setTabAllHC: Dispatch<SetStateAction<string[]>>;
  tabAllIsFullRow: boolean;
  setFullTabAll: Dispatch<SetStateAction<boolean>>;
  tabAllShowSort?: ColumnShowSortType[];
  setColumnAllShowSort?: Dispatch<SetStateAction<ColumnShowSortType[]>>;
}

const initialState: Partial<TabAllReducerType> = {
  tabAllCW:
    tabStorage && JSON.parse(tabStorage)?.columnWidths.length === ORDER_COLUMN_WIDTHS.length
      ? JSON.parse(tabStorage).columnWidths
      : ORDER_COLUMN_WIDTHS,
  tabAllCO:
    tabStorage && JSON.parse(tabStorage)?.columnsOrder.length === DEFAULT_ORDER_CO.length
      ? JSON.parse(tabStorage).columnsOrder
      : DEFAULT_ORDER_CO,
  tabAllParams: {
    limit: 30,
    page: 1,
    ordering: "-created",
  },
  tabAllHC:
    tabStorage && JSON.parse(tabStorage).columnsHidden ? JSON.parse(tabStorage).columnsHidden : [],
  tabAllIsFullRow: false,
  tabAllShowSort: ORDER_COLUMNS_SHOW_SORT,
};

const TabAllReducer = (
  state: TabAllReducerType,
  action: TableActions
): Partial<TabAllReducerType> => {
  switch (action.type) {
    case ColumnActionTypes.SetCO:
      return {
        ...state,
        tabAllCO: action.payload.columnOrders,
      };
    case ColumnActionTypes.SetCW:
      return {
        ...state,
        tabAllCW: action.payload.columnWidths,
      };
    case ColumnActionTypes.SetIsFullRow:
      return {
        ...state,
        tabAllIsFullRow: action.payload.isFullRow,
      };
    case ColumnActionTypes.SetHC:
      return {
        ...state,
        tabAllHC: action.payload.hiddenColumns,
      };
    case ColumnActionTypes.SetParams:
      return {
        ...state,
        tabAllParams: action.payload.params,
      };
    case ColumnActionTypes.SetSort:
      return {
        ...state,
        tabAllShowSort: action.payload.sort,
      };

    default:
      return state;
  }
};

export const useTabAllReducer = (): Partial<TabAllReducerType> => {
  const [tabAllState, tabAllDispatch] = useReducer(TabAllReducer, initialState);

  // useEffect(() => {
  //   setStorage(
  //     ALL_ORDER_STORAGE,
  //     JSON.stringify({
  //       columnsOrder: tabAllState.tabAllCO,
  //       columnsHidden: tabAllState.tabAllHC,
  //       columnWidths: tabAllState.tabAllCW,
  //     })
  //   );
  // }, [tabAllState.tabAllCO, tabAllState.tabAllCW, tabAllState.tabAllHC]);

  const setTabAllCW = (payload: TableColumnWidthInfo[]) => {
    tabAllDispatch({
      type: ColumnActionTypes.SetCW,
      payload: {
        columnWidths: payload,
      },
    });
  };
  const setTabAllCO = (payload: string[]) => {
    tabAllDispatch({
      type: ColumnActionTypes.SetCO,
      payload: {
        columnOrders: payload,
      },
    });
  };
  const setTabAllParams = (payload: any) => {
    tabAllDispatch({
      type: ColumnActionTypes.SetParams,
      payload: {
        params: payload,
      },
    });
  };
  const setTabAllHC = (payload: string[]) => {
    tabAllDispatch({
      type: ColumnActionTypes.SetHC,
      payload: {
        hiddenColumns: payload,
      },
    });
  };
  const setFullTabAll = (payload: boolean) => {
    tabAllDispatch({
      type: ColumnActionTypes.SetIsFullRow,
      payload: {
        isFullRow: payload,
      },
    });
  };
  const setColumnAllShowSort = (payload: ColumnShowSortType[]) => {
    tabAllDispatch({
      type: ColumnActionTypes.SetSort,
      payload: {
        sort: payload,
      },
    });
  };

  return {
    ...tabAllState,
    setColumnAllShowSort,
    setFullTabAll,
    setTabAllCO,
    setTabAllCW,
    setTabAllHC,
    setTabAllParams,
  };
};
