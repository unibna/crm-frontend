// hooks
import { Dispatch, SetStateAction, useReducer } from "react";

//utils
import { DEFAULT_ORDER_CO, ORDER_COLUMNS_SHOW_SORT } from "../constants/columns";

//types
import { ColumnActionTypes, TableActions } from "_types_/ColumnType";
import { ColumnShowSortType } from "_types_/DGridType";

export const COMPLETED_ORDER_STORAGE = "tab-completed-order";
// const tabStorage = getStorage(COMPLETED_ORDER_STORAGE);
const tabStorage = undefined;

export interface CompletedReducerType {
  completedHC: string[];
  setCompletedHC: Dispatch<SetStateAction<string[]>>;
  completedCO: string[];
  setCompletedCO: Dispatch<SetStateAction<string[]>>;
  completedParams: any;
  setCompletedParams: Dispatch<SetStateAction<any>>;
  isFullCompleted: boolean;
  setFullCompleted: Dispatch<SetStateAction<boolean>>;
  completedShowSort?: ColumnShowSortType[];
  setColumnCompletedShowSort?: Dispatch<SetStateAction<ColumnShowSortType[]>>;
}

const initialState: Partial<CompletedReducerType> = {
  completedCO:
    tabStorage && JSON.parse(tabStorage)?.columnsOrder === DEFAULT_ORDER_CO.length
      ? JSON.parse(tabStorage).columnsOrder
      : DEFAULT_ORDER_CO,
  completedParams: {
    limit: 30,
    page: 1,
    status: ["completed"],
    ordering: "-created",
  },
  completedHC:
    tabStorage && JSON.parse(tabStorage).columnsHidden ? JSON.parse(tabStorage).columnsHidden : [],
  isFullCompleted: false,
  completedShowSort: ORDER_COLUMNS_SHOW_SORT,
};

const CompletedReducer = (
  state: CompletedReducerType,
  action: TableActions
): Partial<CompletedReducerType> => {
  switch (action.type) {
    case ColumnActionTypes.SetCO:
      return {
        ...state,
        completedCO: action.payload.columnOrders,
      };
    case ColumnActionTypes.SetIsFullRow:
      return {
        ...state,
        isFullCompleted: action.payload.isFullRow,
      };
    case ColumnActionTypes.SetHC:
      return {
        ...state,
        completedHC: action.payload.hiddenColumns,
      };
    case ColumnActionTypes.SetParams:
      return {
        ...state,
        completedParams: action.payload.params,
      };
    case ColumnActionTypes.SetSort:
      return {
        ...state,
        completedShowSort: action.payload.sort,
      };

    default:
      return state;
  }
};

export const useCompletedReducer = (): Partial<CompletedReducerType> => {
  const [tabCompletedState, tabCompletedDispatch] = useReducer(CompletedReducer, initialState);

  // useEffect(() => {
  //   setStorage(
  //     COMPLETED_ORDER_STORAGE,
  //     JSON.stringify({
  //       columnsOrder: tabCompletedState.completedCO,
  //       columnsHidden: tabCompletedState.completedHC,
  //     })
  //   );
  // }, [tabCompletedState.completedCO, tabCompletedState.completedHC]);

  const setCompletedCO = (payload: string[]) => {
    tabCompletedDispatch({
      type: ColumnActionTypes.SetCO,
      payload: {
        columnOrders: payload,
      },
    });
  };
  const setCompletedParams = (payload: any) => {
    tabCompletedDispatch({
      type: ColumnActionTypes.SetParams,
      payload: {
        params: payload,
      },
    });
  };
  const setCompletedHC = (payload: string[]) => {
    tabCompletedDispatch({
      type: ColumnActionTypes.SetHC,
      payload: {
        hiddenColumns: payload,
      },
    });
  };
  const setFullCompleted = (payload: boolean) => {
    tabCompletedDispatch({
      type: ColumnActionTypes.SetIsFullRow,
      payload: {
        isFullRow: payload,
      },
    });
  };
  const setColumnCompletedShowSort = (payload: ColumnShowSortType[]) => {
    tabCompletedDispatch({
      type: ColumnActionTypes.SetSort,
      payload: {
        sort: payload,
      },
    });
  };

  return {
    ...tabCompletedState,
    setColumnCompletedShowSort,
    setFullCompleted,
    setCompletedCO,
    setCompletedHC,
    setCompletedParams,
  };
};
