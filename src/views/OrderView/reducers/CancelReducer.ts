//hooks
import { Dispatch, SetStateAction, useReducer } from "react";

//utils
import { DEFAULT_ORDER_CO, ORDER_COLUMNS_SHOW_SORT } from "../constants/columns";

//types
import { ColumnActionTypes, TableActions } from "_types_/ColumnType";
import { ColumnShowSortType } from "_types_/DGridType";

export let CANCELED_ORDER_STORAGE = "tab-canceled-order";
// const tabStorage = getStorage(CANCELED_ORDER_STORAGE);
const tabStorage = undefined;

export interface CancelReducerType {
  canceledHC: string[];
  setCanceledHC: Dispatch<SetStateAction<string[]>>;
  canceledCO: string[];
  setCanceledCO: Dispatch<SetStateAction<string[]>>;
  canceledParams: any;
  setCanceledParams: Dispatch<SetStateAction<any>>;
  isFullCanceled: boolean;
  setFullCanceled: Dispatch<SetStateAction<boolean>>;
  columnCanceledShowSort?: ColumnShowSortType[];
  setColumnCanceledShowSort?: Dispatch<SetStateAction<ColumnShowSortType[]>>;
}

const initialState: Partial<CancelReducerType> = {
  canceledCO:
    tabStorage && JSON.parse(tabStorage)?.columnsOrder.length === DEFAULT_ORDER_CO.length
      ? JSON.parse(tabStorage).columnsOrder
      : DEFAULT_ORDER_CO,
  canceledParams: {
    limit: 30,
    page: 1,
    status: ["cancel"],
    ordering: "-created",
  },
  canceledHC:
    tabStorage && JSON.parse(tabStorage).columnsHidden ? JSON.parse(tabStorage).columnsHidden : [],
  isFullCanceled: false,
  columnCanceledShowSort: ORDER_COLUMNS_SHOW_SORT,
};

const CanceledReducer = (
  state: CancelReducerType,
  action: TableActions
): Partial<CancelReducerType> => {
  switch (action.type) {
    case ColumnActionTypes.SetCO:
      return {
        ...state,
        canceledCO: action.payload.columnOrders,
      };
    case ColumnActionTypes.SetIsFullRow:
      return {
        ...state,
        isFullCanceled: action.payload.isFullRow,
      };
    case ColumnActionTypes.SetHC:
      return {
        ...state,
        canceledHC: action.payload.hiddenColumns,
      };
    case ColumnActionTypes.SetParams:
      return {
        ...state,
        canceledParams: action.payload.params,
      };
    case ColumnActionTypes.SetSort:
      return {
        ...state,
        columnCanceledShowSort: action.payload.sort,
      };

    default:
      return state;
  }
};

export const useCanceledReducer = (): Partial<CancelReducerType> => {
  const [tabDraftState, tabCanceledDispatch] = useReducer(CanceledReducer, initialState);

  // useEffect(() => {
  //   setStorage(
  //     CANCELED_ORDER_STORAGE,
  //     JSON.stringify({
  //       columnsOrder: tabDraftState.canceledCO,
  //       columnsHidden: tabDraftState.canceledHC,
  //     })
  //   );
  // }, [tabDraftState.canceledCO, tabDraftState.canceledHC]);

  const setCanceledCO = (payload: string[]) => {
    tabCanceledDispatch({
      type: ColumnActionTypes.SetCO,
      payload: {
        columnOrders: payload,
      },
    });
  };
  const setCanceledParams = (payload: any) => {
    tabCanceledDispatch({
      type: ColumnActionTypes.SetParams,
      payload: {
        params: payload,
      },
    });
  };
  const setCanceledHC = (payload: string[]) => {
    tabCanceledDispatch({
      type: ColumnActionTypes.SetHC,
      payload: {
        hiddenColumns: payload,
      },
    });
  };
  const setFullCanceled = (payload: boolean) => {
    tabCanceledDispatch({
      type: ColumnActionTypes.SetIsFullRow,
      payload: {
        isFullRow: payload,
      },
    });
  };
  const setColumnCanceledShowSort = (payload: ColumnShowSortType[]) => {
    tabCanceledDispatch({
      type: ColumnActionTypes.SetSort,
      payload: {
        sort: payload,
      },
    });
  };

  return {
    ...tabDraftState,
    setCanceledCO,
    setCanceledParams,
    setCanceledHC,
    setFullCanceled,
    setColumnCanceledShowSort,
  };
};
