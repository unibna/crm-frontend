// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Types
import { DispatchAction } from "_types_/ColumnType";

// Constants
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_CONTENT_DAILY } from "constants/rolesTab";
import { ActionType } from "constants/index";
import { paramsDefault } from "views/ContentDailyView/constants";
import {
  columnShowOverviewByContentDaily,
  columnShowOverviewByCampaign,
  columnShowContentDailyDefault,
} from "views/ContentDailyView/constants/overview";

// -----------------------------------------------------------------------

const initialState: Partial<any> = {
  [STATUS_ROLE_CONTENT_DAILY.OVERVIEW_BY_CONTENT_DAILY]: {
    columnsShow: getColumnsShow(columnShowOverviewByContentDaily.columnShowTable),
    resultColumnsShow: columnShowOverviewByContentDaily.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowOverviewByContentDaily.columnShowTable).length,
    columnsWidthResize: columnShowOverviewByContentDaily.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_DAILY.OVERVIEW_BY_CAMPAIGN]: {
    columnsShow: getColumnsShow(columnShowOverviewByCampaign.columnShowTable),
    resultColumnsShow: columnShowOverviewByCampaign.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowOverviewByCampaign.columnShowTable).length,
    columnsWidthResize: columnShowOverviewByCampaign.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_CONTENT_DAILY.PIVOT]: {
    columnsShow: getColumnsShow(columnShowContentDailyDefault.columnShowTable),
    resultColumnsShow: columnShowContentDailyDefault.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowContentDailyDefault.columnShowTable).length,
    columnsWidthResize: columnShowContentDailyDefault.columnWidths,
    columnSelected: [],
  },
  params: paramsDefault,
  dataFilter: {
    dataFilterContent: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterStatus: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
    dataFilterChannel: [
      {
        label: "Tất cả",
        value: "all",
      },
    ],
  },
};

const reducerContentId = (state: Partial<any>, action: DispatchAction): Partial<any> => {
  const { payload = {} } = action;

  switch (action.type) {
    case ActionType.UPDATE_PARAMS: {
      return {
        ...state,
        params: {
          ...state.params,
          ...payload,
        },
      };
    }
    case ActionType.UPDATE_DATA_FILTER: {
      return {
        ...state,
        dataFilter: {
          ...state.dataFilter,
          ...payload,
        },
      };
    }
    default: {
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          ...payload,
        },
      };
    }
  }
};

const ContentDailyContext = createContext<{
  state: Partial<any>;
  updateColumn: (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => void;
  updateCell: (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => void;
  resizeColumn: (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => void;
  orderColumn: (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => void;
  updateParams: (payload: Partial<any>) => void;
  updateDataFilter: (payload: Partial<any>) => void;
}>({
  state: initialState,
  updateColumn: () => {},
  updateCell: () => {},
  resizeColumn: () => {},
  orderColumn: () => {},
  updateParams: () => {},
  updateDataFilter: () => {},
});

const ContentDailyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerContentId, initialState);

  const updateColumn = (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => {
    dispatch({
      type,
      payload,
    });
  };

  const updateCell = (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => {
    const columns = handleToggleVisibleColumn(
      payload,
      getObjectPropSafely(() => state[type].columnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const resizeColumn = (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => {
    dispatch({
      type,
      payload: {
        columnsWidthResize: payload,
      },
    });
  };

  const orderColumn = (type: STATUS_ROLE_CONTENT_DAILY, payload: Partial<any>) => {
    const columns = handleChangeColumnOrders(
      payload,
      getObjectPropSafely(() => state[type].resultColumnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const updateParams = (payload: Partial<any>) => {
    dispatch({
      type: ActionType.UPDATE_PARAMS,
      payload,
    });
  };

  const updateDataFilter = (payload: Partial<any>) => {
    dispatch({
      type: ActionType.UPDATE_DATA_FILTER,
      payload,
    });
  };

  return (
    <ContentDailyContext.Provider
      value={{
        state,
        updateColumn,
        updateCell,
        resizeColumn,
        orderColumn,
        updateParams,
        updateDataFilter,
      }}
    >
      {children}
    </ContentDailyContext.Provider>
  );
};

export { ContentDailyProvider, ContentDailyContext };
