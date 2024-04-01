// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Types
import { ColumnTypeDefault, DispatchAction } from "_types_/ColumnType";

// Constants
import { getColumnsShow } from "utils/tableUtil";
import { ActionType } from "constants/index";
import { columnShowReportInventoryActivities, REPORT_DIMENSIONS } from "./constants";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import { differenceInCalendarDays, format, subDays, subMonths } from "date-fns";
import { yyyy_MM_dd } from "constants/time";
import { IReportInventoryActivities } from "_types_/WarehouseType";

// -----------------------------------------------------------------------
type ReportContextStateType = {
  columns: {
    columnsShow: ColumnTypeDefault<IReportInventoryActivities>[];
    resultColumnsShow: ColumnTypeDefault<IReportInventoryActivities>[];
    countShowColumn: number;
    columnsWidthResize: TableColumnWidthInfo[];
  };
  params: any;
};

const initialState: ReportContextStateType = {
  columns: {
    columnsShow: getColumnsShow(columnShowReportInventoryActivities.columnShowTable),
    resultColumnsShow: columnShowReportInventoryActivities.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowReportInventoryActivities.columnShowTable).length,
    columnsWidthResize: columnShowReportInventoryActivities.columnWidths,
  },
  params: {
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
    page: 1,
    limit: 30,
    // dimentions: Object.keys(REPORT_DIMENSIONS),
    dimentions: "all",
  },
};

const reducer = (state: Partial<ReportContextStateType>, action: DispatchAction): Partial<any> => {
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
    default: {
      return {
        ...state,
        [action.type]: {
          ...state[action.type as keyof typeof state],
          ...payload,
        },
      };
    }
  }
};

const ReportContext = createContext<{
  state: Partial<ReportContextStateType>;
  dispatch: React.Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: function (value: DispatchAction): void {
    throw new Error("Function not implemented.");
  },
});

const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ReportContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export { ReportProvider, ReportContext };
