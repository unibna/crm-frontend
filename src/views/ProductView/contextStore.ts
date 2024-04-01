// Libraries
import { createContext, Dispatch } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { AttributeVariant, FilterChild } from "_types_/ProductType";

// Constants
import {
  actionType,
  columnShowProduct,
  columnShowDetailVariant,
  columnShowEcommerce,
  headerFilterStatus,
} from "views/ProductView/constants";
import { VariantNotificationType } from "contexts/ToastContext";
import {
  handleToggleVisibleColumn,
  getColumnsShow,
  handleChangeColumnOrders,
} from "utils/tableUtil";

interface ItemColumns<T> {
  columnsShow: ColumnTypeDefault<T>[];
  resultColumnsShow: ColumnTypeDefault<T>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnSelected: string[];
}

interface InitialState {
  product: ItemColumns<FacebookType>;
  ecommerce: ItemColumns<FacebookType>;
  variant: ItemColumns<AttributeVariant>;
  attributes: FilterChild[];
  params: any;
  dataFilter: any;
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
  product: {
    columnsShow: columnShowProduct.columnShowTable || [],
    resultColumnsShow: getColumnsShow(columnShowProduct.columnsShowHeader),
    countShowColumn: (columnShowProduct.columnShowTable || []).filter(
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    ).length,
    columnsWidthResize: columnShowProduct.columnWidths,
    columnSelected: [],
  },
  ecommerce: {
    columnsShow: columnShowEcommerce.columnShowTable || [],
    resultColumnsShow: columnShowEcommerce.columnsShowHeader.filter(
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    ),
    countShowColumn: (columnShowEcommerce.columnShowTable || []).filter(
      (item: ColumnTypeDefault<FacebookType>) => item.isShow
    ).length,
    columnsWidthResize: columnShowEcommerce.columnWidths,
    columnSelected: [],
  },
  variant: {
    columnsShow: columnShowDetailVariant.columnShowTable || [],
    resultColumnsShow: columnShowDetailVariant.columnsShowHeader.filter(
      (item: ColumnTypeDefault<AttributeVariant>) => item.isShow
    ),
    countShowColumn: (columnShowDetailVariant.columnShowTable || []).filter(
      (item: ColumnTypeDefault<AttributeVariant>) => item.isShow
    ).length,
    columnsWidthResize: columnShowDetailVariant.columnWidths,
    columnSelected: [],
  },
  dataFilter: {
    dataValueAttribute: [],
  },
  params: {
    status: headerFilterStatus[1].value,
  },
  attributes: [],
  notifications: {
    message: "",
    variant: "info",
  },
};

const StoreProduct = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerProduct = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { product, ecommerce, variant } = state;

  switch (action.type) {
    case actionType.UPDATE_PRODUCT: {
      const columns = handleToggleVisibleColumn(payload, product.columnsShow);

      return {
        ...state,
        product: {
          ...state.product,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_VARIANT: {
      const columns = handleToggleVisibleColumn(payload, variant.columnsShow);

      return {
        ...state,
        variant: {
          ...state.variant,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_ECOMMERCE: {
      const columns = handleToggleVisibleColumn(payload, ecommerce.columnsShow);

      return {
        ...state,
        ecommerce: {
          ...state.ecommerce,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_PRODUCT: {
      return {
        ...state,
        product: {
          ...state.product,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_VARIANT: {
      return {
        ...state,
        variant: {
          ...state.variant,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_ECOMMERCE: {
      return {
        ...state,
        ecommerce: {
          ...state.ecommerce,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_PRODUCT: {
      const columns = handleChangeColumnOrders(payload, product.resultColumnsShow);

      return {
        ...state,
        product: {
          ...state.product,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_ECOMMERCE: {
      const columns = handleChangeColumnOrders(payload, ecommerce.resultColumnsShow);

      return {
        ...state,
        ecommerce: {
          ...state.ecommerce,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_VARIANT: {
      const columns = handleChangeColumnOrders(payload, variant.resultColumnsShow);

      return {
        ...state,
        variant: {
          ...state.variant,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_DATA_FILTER: {
      return {
        ...state,
        dataFilter: {
          ...state.dataFilter,
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
    case actionType.UPDATE_COLUMN_SELECTED_PRODUCT: {
      return {
        ...state,
        product: {
          ...product,
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
    default: {
      return { ...state };
    }
  }
};

export { StoreProduct, reducerProduct, initialState };
