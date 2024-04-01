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
  columnShowImports,
  columnShowExports,
  columnShowTransfer,
  columnShowListWarehouse,
  columnShowStocktaking,
  columnShowScanLogs,
  paramsDefault,
} from "views/WarehouseView/constants";
import { VariantNotificationType } from "contexts/ToastContext";

// -------------------------------------------------------------------
interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnSelected: string[];
}

interface InitialState {
  imports: ItemColumns;
  exports: ItemColumns;
  transfer: ItemColumns;
  stocktaking: ItemColumns;
  listWarehouse: ItemColumns;
  scanLogs: ItemColumns;
  dataPopup: any;
  params: any;
  notifications: {
    message: string;
    variant: VariantNotificationType;
  };
}
interface DispatchAction {
  type: string;
  payload: any;
}

const initialState: InitialState = {
  imports: {
    columnsShow: columnShowImports.columnsShowHeader,
    resultColumnsShow: columnShowImports.columnsShowHeader,
    countShowColumn: columnShowImports.columnsShowHeader.length,
    columnsWidthResize: columnShowImports.columnWidths,
    columnSelected: [],
  },
  exports: {
    columnsShow: columnShowExports.columnsShowHeader,
    resultColumnsShow: columnShowExports.columnsShowHeader,
    countShowColumn: columnShowExports.columnsShowHeader.length,
    columnsWidthResize: columnShowExports.columnWidths,
    columnSelected: [],
  },
  transfer: {
    columnsShow: columnShowTransfer.columnsShowHeader,
    resultColumnsShow: columnShowTransfer.columnsShowHeader,
    countShowColumn: columnShowTransfer.columnsShowHeader.length,
    columnsWidthResize: columnShowTransfer.columnWidths,
    columnSelected: [],
  },
  stocktaking: {
    columnsShow: columnShowStocktaking.columnsShowHeader,
    resultColumnsShow: columnShowStocktaking.columnsShowHeader,
    countShowColumn: columnShowStocktaking.columnsShowHeader.length,
    columnsWidthResize: columnShowStocktaking.columnWidths,
    columnSelected: [],
  },
  listWarehouse: {
    columnsShow: columnShowListWarehouse.columnsShowHeader,
    resultColumnsShow: columnShowListWarehouse.columnsShowHeader,
    countShowColumn: columnShowListWarehouse.columnsShowHeader.length,
    columnsWidthResize: columnShowListWarehouse.columnWidths,
    columnSelected: [],
  },
  scanLogs: {
    columnsShow: columnShowScanLogs.columnsShowHeader,
    resultColumnsShow: columnShowScanLogs.columnsShowHeader,
    countShowColumn: columnShowScanLogs.columnsShowHeader.length,
    columnsWidthResize: columnShowScanLogs.columnWidths,
    columnSelected: [],
  },
  dataPopup: {
    valueOptional: {},
    isOpenPopup: false,
    isLoadingButton: false,
    funcContentRender: () => [],
    defaultData: {},
    funcContentSchema: (value: any) => {},
    title: "",
    type: "",
    buttonText: "Tạo",
    maxWidthForm: "sm",
    isShowFooter: true,
  },
  params: paramsDefault,
  notifications: {
    message: "",
    variant: "info",
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

const StoreWarehouse = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerWarehouse = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { imports, exports, transfer, stocktaking, dataPopup, listWarehouse, scanLogs } = state;

  switch (action.type) {
    case actionType.UPDATE_IMPORTS: {
      const columns = handleToggleVisibleColumn(
        payload,
        imports.columnsShow,
        imports.resultColumnsShow
      );

      return {
        ...state,
        imports: {
          ...state.imports,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_EXPORTS: {
      const columns = handleToggleVisibleColumn(
        payload,
        exports.columnsShow,
        exports.resultColumnsShow
      );

      return {
        ...state,
        exports: {
          ...state.exports,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_TRANSFER: {
      const columns = handleToggleVisibleColumn(
        payload,
        transfer.columnsShow,
        transfer.resultColumnsShow
      );

      return {
        ...state,
        transfer: {
          ...state.transfer,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_STOCKTAKING: {
      const columns = handleToggleVisibleColumn(
        payload,
        stocktaking.columnsShow,
        stocktaking.resultColumnsShow
      );

      return {
        ...state,
        stocktaking: {
          ...state.stocktaking,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_LIST_WAREHOUSE: {
      const columns = handleToggleVisibleColumn(
        payload,
        listWarehouse.columnsShow,
        listWarehouse.resultColumnsShow
      );

      return {
        ...state,
        listWarehouse: {
          ...state.listWarehouse,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_SCAN_LOGS: {
      const columns = handleToggleVisibleColumn(
        payload,
        scanLogs.columnsShow,
        scanLogs.resultColumnsShow
      );

      return {
        ...state,
        scanLogs: {
          ...state.scanLogs,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_IMPORTS: {
      return {
        ...state,
        imports: {
          ...state.imports,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_EXPORTS: {
      return {
        ...state,
        exports: {
          ...state.exports,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_TRANSFER: {
      return {
        ...state,
        transfer: {
          ...state.transfer,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_STOCKTAKING: {
      return {
        ...state,
        stocktaking: {
          ...state.stocktaking,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_LIST_WAREHOUSE: {
      return {
        ...state,
        listWarehouse: {
          ...state.listWarehouse,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_SCAN_LOGS: {
      return {
        ...state,
        scanLogs: {
          ...state.scanLogs,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_IMPORTS: {
      const columns = handleChangeColumnOrders(payload, imports.resultColumnsShow);

      return {
        ...state,
        imports: {
          ...state.imports,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_EXPORTS: {
      const columns = handleChangeColumnOrders(payload, exports.resultColumnsShow);

      return {
        ...state,
        exports: {
          ...state.exports,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_TRANSFER: {
      const columns = handleChangeColumnOrders(payload, transfer.resultColumnsShow);

      return {
        ...state,
        transfer: {
          ...state.transfer,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_STOCKTAKING: {
      const columns = handleChangeColumnOrders(payload, stocktaking.resultColumnsShow);

      return {
        ...state,
        stocktaking: {
          ...state.stocktaking,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_LIST_WAREHOUSE: {
      const columns = handleChangeColumnOrders(payload, listWarehouse.resultColumnsShow);

      return {
        ...state,
        listWarehouse: {
          ...state.listWarehouse,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_SCAN_LOGS: {
      const columns = handleChangeColumnOrders(payload, scanLogs.resultColumnsShow);

      return {
        ...state,
        scanLogs: {
          ...state.scanLogs,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_IMPORTS: {
      return {
        ...state,
        imports: {
          ...imports,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_EXPORTS: {
      return {
        ...state,
        exports: {
          ...exports,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_TRANSFER: {
      return {
        ...state,
        transfer: {
          ...transfer,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_STOCKTAKINGS: {
      return {
        ...state,
        stocktaking: {
          ...stocktaking,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_SCAN_LOGS: {
      return {
        ...state,
        scanLogs: {
          ...scanLogs,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_NOTIFICATIONS: {
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_DATA_POPUP: {
      return {
        ...state,
        dataPopup: {
          ...dataPopup,
          ...payload,
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

export { StoreWarehouse, reducerWarehouse, initialState };
