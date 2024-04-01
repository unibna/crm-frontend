// Libraries
import { createContext, Dispatch } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import produce from "immer";

// Constants
import {
  columnShowCampaign,
  columnShowAdSet,
  columnShowAd,
  columnShowAdInsight,
  actionType,
} from "views/AdFacebookView/constants";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { VariantNotificationType } from "contexts/ToastContext";
interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
}
interface InitialState {
  campaign: ItemColumns;
  adset: ItemColumns;
  ad: ItemColumns;
  adInsight: ItemColumns;
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
  campaign: {
    columnsShow: columnShowCampaign.columnsShowHeader,
    resultColumnsShow: columnShowCampaign.columnsShowHeader,
    countShowColumn: columnShowCampaign.columnsShowHeader.length,
    columnsWidthResize: columnShowCampaign.columnWidths,
  },
  adset: {
    columnsShow: columnShowAdSet.columnsShowHeader,
    resultColumnsShow: columnShowAdSet.columnsShowHeader,
    countShowColumn: columnShowAdSet.columnsShowHeader.length,
    columnsWidthResize: columnShowAdSet.columnWidths,
  },
  ad: {
    columnsShow: columnShowAd.columnsShowHeader,
    resultColumnsShow: columnShowAd.columnsShowHeader,
    countShowColumn: columnShowAd.columnsShowHeader.length,
    columnsWidthResize: columnShowAd.columnWidths,
  },
  adInsight: {
    columnsShow: columnShowAdInsight.columnsShowHeader,
    resultColumnsShow: columnShowAdInsight.columnsShowHeader,
    countShowColumn: columnShowAdInsight.columnsShowHeader.length,
    columnsWidthResize: columnShowAdInsight.columnWidths,
  },
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

const StoreFacebook = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerFacebook = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { campaign, adset, ad, adInsight } = state;

  switch (action.type) {
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
    case actionType.UPDATE_AD_SET: {
      const columns = handleToggleVisibleColumn(
        payload,
        adset.columnsShow,
        adset.resultColumnsShow
      );

      return {
        ...state,
        adset: {
          ...state.adset,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_AD_INSIGHT: {
      const columns = handleToggleVisibleColumn(
        payload,
        adInsight.columnsShow,
        adInsight.resultColumnsShow
      );

      return {
        ...state,
        adInsight: {
          ...state.adInsight,
          ...columns,
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
    case actionType.RESIZE_COLUMN_AD_SET: {
      return {
        ...state,
        adset: {
          ...state.adset,
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
    case actionType.RESIZE_COLUMN_AD_INSIGHT: {
      return {
        ...state,
        adInsight: {
          ...state.adInsight,
          ...payload,
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
    case actionType.UPDATE_COLUMN_ORDER_AD_SET: {
      const columns = handleChangeColumnOrders(payload, adset.resultColumnsShow);

      return {
        ...state,
        adset: {
          ...state.adset,
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
    case actionType.UPDATE_COLUMN_ORDER_AD_INSIGHT: {
      const columns = handleChangeColumnOrders(payload, adInsight.resultColumnsShow);

      return {
        ...state,
        adInsight: {
          ...state.adInsight,
          ...columns,
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

export { StoreFacebook, reducerFacebook, initialState };
