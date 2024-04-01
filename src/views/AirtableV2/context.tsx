// Libraries
import { ROLE_TAB, ROLE_TYPE } from "constants/rolesTab";
import useAuth from "hooks/useAuth";
import { ReactNode, createContext, useReducer } from "react";

// Types
import { DispatchAction } from "_types_/ColumnType";
import { AirTableBase, AirTableLogs, AirTableRow } from "_types_/SkyTableType";
import { ActionType } from "constants/index";

// -----------------------------------------------------------------------

interface Props {
  params: { [key: string]: string };
  loading: boolean;
  fetched: boolean;
  data: {
    listTable: AirTableBase[];
    detailTable?: AirTableBase | null;
    listRecords: AirTableRow[];
    tableLogs: AirTableLogs[];
  };
}

const initialState: Props = {
  params: {},
  loading: false,
  fetched: false,
  data: {
    listTable: [],
    detailTable: null,
    listRecords: [],
    tableLogs: [],
  },
};

const reducerAirtable = (state: Props, action: DispatchAction): any => {
  const { payload = {} } = action;

  const actionType: keyof Props | ActionType = action.type;

  switch (actionType) {
    case ActionType.UPDATE_PARAMS: {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        },
      };
    }
    case ActionType.UPDATE_LOADING: {
      return {
        ...state,
        loading: payload,
      };
    }
    case ActionType.UPDATE_FETCHED: {
      return {
        ...state,
        fetched: payload,
      };
    }
    case ActionType.UPDATE_DATA: {
      return {
        ...state,
        data: {
          ...state.data,
          ...payload,
        },
      };
    }
    default: {
      return {
        ...state,
        // [actionType]: {
        //   ...state[actionType],
        //   ...payload,
        // },
      };
    }
  }
};

const AirtableContext = createContext<{
  state: Props;
  permission:
    | {
        [key: string]: ROLE_TYPE;
      }
    | undefined;
  dispatch: React.Dispatch<DispatchAction>;
  updateParams: (payload: any) => void;
  updateData: (payload: any) => void;
  updateLoading: (payload: boolean) => void;
  updateFetched: (payload: boolean) => void;
}>({
  state: initialState,
  permission: undefined,
  dispatch: () => {},
  updateParams: () => {},
  updateData: () => {},
  updateLoading: () => {},
  updateFetched: () => {},
});

const AirtableProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerAirtable, initialState);

  const { user } = useAuth();

  const permission = user?.group_permission?.data?.[ROLE_TAB.SKYCOM_TABLE];

  const updateLoading = (payload: boolean) => {
    dispatch({
      type: ActionType.UPDATE_LOADING,
      payload,
    });
  };

  const updateFetched = (payload: boolean) => {
    dispatch({
      type: ActionType.UPDATE_FETCHED,
      payload,
    });
  };

  const updateData = (payload: any) => {
    dispatch({
      type: ActionType.UPDATE_DATA,
      payload,
    });
  };

  const updateParams = (payload: any) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload,
    });
  };

  return (
    <AirtableContext.Provider
      value={{
        state,
        permission,
        dispatch,
        updateLoading,
        updateData,
        updateParams,
        updateFetched,
      }}
    >
      {children}
    </AirtableContext.Provider>
  );
};

export { AirtableProvider, AirtableContext };
