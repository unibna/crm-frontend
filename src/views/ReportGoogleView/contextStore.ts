// Libraries
import { createContext, Dispatch } from "react";
import produce from "immer";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";

// Constants
import { actionType } from "views/ReportGoogleView/constants";
import {
  columnShowCustomer,
  columnShowCampaign,
  columnShowAdGroup,
  columnShowAd,
} from "views/ReportGoogleView/constants";
import { yyyy_MM_dd } from "constants/time";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { VariantNotificationType } from "contexts/ToastContext";
import format from "date-fns/format";
import subDays from "date-fns/subDays";
interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
  columnSelected: string[];
  dataFilter?: any;
}

interface InitialState {
  customer: ItemColumns;
  campaign: ItemColumns;
  adGroup: ItemColumns;
  ad: ItemColumns;
  params:
    | {
        date_from?: string;
        date_to?: string;
        dateValue?: string | number;
        effective_status?: string | string[];
        objective?: string | string[];
      }
    | any;
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
  customer: {
    columnsShow: columnShowCustomer.columnsShowHeader, // show button bộ lọc cột trên header
    resultColumnsShow: columnShowCustomer.columnsShowHeader, // show column table
    countShowColumn: columnShowCustomer.columnsShowHeader.length,
    columnsWidthResize: columnShowCustomer.columnWidths,
    columnSelected: [],
  },
  campaign: {
    columnsShow: columnShowCampaign.columnsShowHeader,
    resultColumnsShow: columnShowCampaign.columnsShowHeader,
    countShowColumn: columnShowCampaign.columnsShowHeader.length,
    columnsWidthResize: columnShowCampaign.columnWidths,
    columnSelected: [],
    dataFilter: {
      objective: "all",
    },
  },
  adGroup: {
    columnsShow: columnShowAdGroup.columnsShowHeader,
    resultColumnsShow: columnShowAdGroup.columnsShowHeader,
    countShowColumn: columnShowAdGroup.columnsShowHeader.length,
    columnsWidthResize: columnShowAdGroup.columnWidths,
    columnSelected: [],
    dataFilter: {
      objective: "all",
    },
  },
  ad: {
    columnsShow: columnShowAd.columnsShowHeader,
    resultColumnsShow: columnShowAd.columnsShowHeader,
    countShowColumn: columnShowAd.columnsShowHeader.length,
    columnsWidthResize: columnShowAd.columnWidths,
    columnSelected: [],
    dataFilter: {
      objective: "all",
    },
  },
  params: {
    dateValue: 0,
    date_from: format(subDays(new Date(), 0), yyyy_MM_dd),
    date_to: format(subDays(new Date(), 0), yyyy_MM_dd),
  },
  notifications: {
    message: "",
    variant: "info",
  },
};

const StoreReportGoogle = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

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

const reducerReportGoogle = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { customer, campaign, adGroup, ad } = state;

  switch (action.type) {
    case actionType.UPDATE_CUSTOMER: {
      const columns = handleToggleVisibleColumn(
        payload,
        customer.columnsShow,
        customer.resultColumnsShow
      );

      return {
        ...state,
        customer: {
          ...state.customer,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_CAMPAIGN: {
      const columns = handleToggleVisibleColumn(
        payload,
        campaign.columnsShow,
        campaign.resultColumnsShow
      );

      return {
        ...state,
        campaign: {
          ...state.campaign,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_AD: {
      const columns = handleToggleVisibleColumn(payload, ad.columnsShow, ad.resultColumnsShow);

      return {
        ...state,
        ad: {
          ...state.ad,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_AD_GROUP: {
      const columns = handleToggleVisibleColumn(
        payload,
        adGroup.columnsShow,
        adGroup.resultColumnsShow
      );

      return {
        ...state,
        adGroup: {
          ...state.adGroup,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_DATA_FILTER_CAMPAIGN: {
      return {
        ...state,
        campaign: {
          ...state.campaign,
          dataFilter: {
            ...state.campaign.dataFilter,
            ...payload,
          },
        },
      };
    }
    case actionType.UPDATE_DATA_FILTER_AD_GROUP: {
      return {
        ...state,
        adGroup: {
          ...state.adGroup,
          dataFilter: {
            ...state.adGroup.dataFilter,
            ...payload,
          },
        },
      };
    }
    case actionType.UPDATE_DATA_FILTER_AD: {
      return {
        ...state,
        ad: {
          ...state.ad,
          dataFilter: {
            ...state.ad.dataFilter,
            ...payload,
          },
        },
      };
    }
    case actionType.RESIZE_COLUMN_CAMPAIGN: {
      return {
        ...state,
        campaign: {
          ...state.campaign,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_AD_GROUP: {
      return {
        ...state,
        adGroup: {
          ...state.adGroup,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_AD: {
      return {
        ...state,
        ad: {
          ...state.ad,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_CUSTOMER: {
      return {
        ...state,
        customer: {
          ...state.customer,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_CUSTOMER: {
      return {
        ...state,
        customer: {
          ...state.customer,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_CAMPAIGN: {
      return {
        ...state,
        campaign: {
          ...state.campaign,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_AD_GROUP: {
      return {
        ...state,
        adGroup: {
          ...state.adGroup,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_AD: {
      return {
        ...state,
        ad: {
          ...state.ad,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_CUSTOMER: {
      const columns = handleChangeColumnOrders(payload, customer.resultColumnsShow);

      return {
        ...state,
        customer: {
          ...state.customer,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_CAMPAIGN: {
      const columns = handleChangeColumnOrders(payload, campaign.resultColumnsShow);

      return {
        ...state,
        campaign: {
          ...state.campaign,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_AD_GROUP: {
      const columns = handleChangeColumnOrders(payload, adGroup.resultColumnsShow);

      return {
        ...state,
        adGroup: {
          ...state.adGroup,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_AD: {
      const columns = handleChangeColumnOrders(payload, ad.resultColumnsShow);

      return {
        ...state,
        ad: {
          ...state.ad,
          ...columns,
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

export { StoreReportGoogle, reducerReportGoogle, initialState };
