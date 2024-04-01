// Libraries
import { createContext, ReactNode, useReducer } from "react";

// Types
import { DispatchAction } from "_types_/ColumnType";

// Constants
import { ActionType, columnShowTabContainer, paramsDefault } from "views/ShippingView/constants";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
import { getObjectPropSafely } from "utils/getObjectPropsSafelyUtil";
import { STATUS_ROLE_SHIPPING } from "constants/rolesTab";

// -----------------------------------------------------------------------

const initialState: Partial<any> = {
  [STATUS_ROLE_SHIPPING.ALL]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.PICKING]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.CANCELLED]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.DELIVERING]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.LOST]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.RETURNED]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.RETURNING]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.SUCCESS]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  [STATUS_ROLE_SHIPPING.WAIT_DELIVERY]: {
    columnsShow: getColumnsShow(columnShowTabContainer.columnShowTable),
    resultColumnsShow: columnShowTabContainer.columnsShowHeader,
    countShowColumn: getColumnsShow(columnShowTabContainer.columnShowTable).length,
    columnsWidthResize: columnShowTabContainer.columnWidths,
    columnSelected: [],
  },
  params: paramsDefault,
  dataPopup: {},
};

const reducerShipping = (state: Partial<any>, action: DispatchAction): Partial<any> => {
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
          ...state[action.type],
          ...payload,
        },
      };
    }
  }
};

const ShippingContext = createContext<{
  state: Partial<any>;
  updateColumn: (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => void;
  updateCell: (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => void;
  resizeColumn: (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => void;
  orderColumn: (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => void;
  updateParams: (payload: Partial<any>) => void;
}>({
  state: initialState,
  updateColumn: () => {},
  updateCell: () => {},
  resizeColumn: () => {},
  orderColumn: () => {},
  updateParams: () => {},
});

const ShippingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducerShipping, initialState);

  const updateColumn = (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => {
    dispatch({
      type,
      payload,
    });
  };

  const updateCell = (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => {
    const columns = handleToggleVisibleColumn(
      payload,
      getObjectPropSafely(() => state[type].columnsShow)
    );

    dispatch({
      type,
      payload: columns,
    });
  };

  const resizeColumn = (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => {
    dispatch({
      type,
      payload: {
        columnsWidthResize: payload,
      },
    });
  };

  const orderColumn = (type: STATUS_ROLE_SHIPPING, payload: Partial<any>) => {
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
      payload: payload,
    });
  };

  return (
    <ShippingContext.Provider
      value={{ state, updateColumn, updateCell, resizeColumn, orderColumn, updateParams }}
    >
      {children}
    </ShippingContext.Provider>
  );
};

export { ShippingProvider, ShippingContext };
