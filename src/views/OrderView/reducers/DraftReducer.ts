//hooks
import { Dispatch, SetStateAction, useReducer } from "react";

//utils
import { DEFAULT_ORDER_CO, ORDER_COLUMNS_SHOW_SORT } from "../constants/columns";

//types
import { ColumnActionTypes, TableActions } from "_types_/ColumnType";
import { ColumnShowSortType } from "_types_/DGridType";

export let DRAFT_ORDER_STORAGE = "tab-draft-order";

// const tabStorage = getStorage(DRAFT_ORDER_STORAGE);
const tabStorage = undefined;

export interface DraftReducerType {
  draftHC: string[];
  setDraftHC: Dispatch<SetStateAction<string[]>>;
  draftCO: string[];
  setDraftCO: Dispatch<SetStateAction<string[]>>;
  draftParams: any;
  setDraftParams: Dispatch<SetStateAction<any>>;
  isFullDraft: boolean;
  setFullDraft: Dispatch<SetStateAction<boolean>>;
  columnDraftShowSort?: ColumnShowSortType[];
  setColumnDraftShowSort?: Dispatch<SetStateAction<ColumnShowSortType[]>>;
}

const initialState: Partial<DraftReducerType> = {
  draftCO:
    tabStorage && JSON.parse(tabStorage)?.columnsOrder.length === DEFAULT_ORDER_CO.length
      ? JSON.parse(tabStorage).columnsOrder
      : DEFAULT_ORDER_CO,
  draftParams: {
    limit: 30,
    page: 1,
    status: ["draft"],
    ordering: "-created",
  },
  draftHC:
    tabStorage && JSON.parse(tabStorage).columnsHidden
      ? JSON.parse(tabStorage).columnsHidden
      : ["shipping", "expected_delivery_time"],
  isFullDraft: false,
  columnDraftShowSort: ORDER_COLUMNS_SHOW_SORT,
};

const DraftReducer = (state: DraftReducerType, action: TableActions): Partial<DraftReducerType> => {
  switch (action.type) {
    case ColumnActionTypes.SetCO:
      return {
        ...state,
        draftCO: action.payload.columnOrders,
      };
    case ColumnActionTypes.SetIsFullRow:
      return {
        ...state,
        isFullDraft: action.payload.isFullRow,
      };
    case ColumnActionTypes.SetHC:
      return {
        ...state,
        draftHC: action.payload.hiddenColumns,
      };
    case ColumnActionTypes.SetParams:
      return {
        ...state,
        draftParams: action.payload.params,
      };
    case ColumnActionTypes.SetSort:
      return {
        ...state,
        columnDraftShowSort: action.payload.sort,
      };

    default:
      return state;
  }
};

export const useDraftReducer = (): Partial<DraftReducerType> => {
  const [tabDraftState, tabDraftDispatch] = useReducer(DraftReducer, initialState);

  // useEffect(() => {
  //   setStorage(
  //     DRAFT_ORDER_STORAGE,
  //     JSON.stringify({
  //       columnsOrder: tabDraftState.draftCO,
  //       columnsHidden: tabDraftState.draftHC,
  //     })
  //   );
  // }, [tabDraftState.draftCO, tabDraftState.draftHC]);

  const setDraftCO = (payload: string[]) => {
    tabDraftDispatch({
      type: ColumnActionTypes.SetCO,
      payload: {
        columnOrders: payload,
      },
    });
  };
  const setDraftParams = (payload: any) => {
    tabDraftDispatch({
      type: ColumnActionTypes.SetParams,
      payload: {
        params: payload,
      },
    });
  };
  const setDraftHC = (payload: string[]) => {
    tabDraftDispatch({
      type: ColumnActionTypes.SetHC,
      payload: {
        hiddenColumns: payload,
      },
    });
  };
  const setFullDraft = (payload: boolean) => {
    tabDraftDispatch({
      type: ColumnActionTypes.SetIsFullRow,
      payload: {
        isFullRow: payload,
      },
    });
  };
  const setColumnDraftShowSort = (payload: ColumnShowSortType[]) => {
    tabDraftDispatch({
      type: ColumnActionTypes.SetSort,
      payload: {
        sort: payload,
      },
    });
  };

  return {
    ...tabDraftState,
    setDraftHC,
    setDraftCO,
    setDraftParams,
    setColumnDraftShowSort,
    setFullDraft,
  };
};
