// Libraries
import { createContext, Dispatch } from "react";
import produce from "immer";

// Constants
import { actionType } from "views/ReportFacebookView/constants";
import {
  columnShowAdAccout,
  columnShowCampaign,
  columnShowAdSet,
  columnShowAd,
  columnShowFanpage,
  columnShowPost,
  columnShowAttributes,
} from "views/ReportFacebookView/constants";
import { yyyy_MM_dd } from "constants/time";

// Types
import { ColumnTypeDefault } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
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
  adAccount: ItemColumns;
  campaign: ItemColumns;
  adset: ItemColumns;
  ad: ItemColumns;
  fanpage: ItemColumns;
  post: ItemColumns;
  attributes: ItemColumns;
  listAttributes: any;
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
  adAccount: {
    columnsShow: columnShowAdAccout.columnsShowHeader, // show button bộ lọc cột trên header
    resultColumnsShow: columnShowAdAccout.columnsShowHeader, // show column table
    countShowColumn: columnShowAdAccout.columnsShowHeader.length,
    columnsWidthResize: columnShowAdAccout.columnWidths,
    columnSelected: [],
  },
  campaign: {
    columnsShow: columnShowCampaign.columnsShowHeader,
    resultColumnsShow: columnShowCampaign.columnsShowHeader,
    countShowColumn: columnShowCampaign.columnsShowHeader.length,
    columnsWidthResize: columnShowCampaign.columnWidths,
    columnSelected: [],
  },
  adset: {
    columnsShow: columnShowAdSet.columnsShowHeader,
    resultColumnsShow: columnShowAdSet.columnsShowHeader,
    countShowColumn: columnShowAdSet.columnsShowHeader.length,
    columnsWidthResize: columnShowAdSet.columnWidths,
    columnSelected: [],
  },
  ad: {
    columnsShow: columnShowAd.columnsShowHeader,
    resultColumnsShow: columnShowAd.columnsShowHeader,
    countShowColumn: columnShowAd.columnsShowHeader.length,
    columnsWidthResize: columnShowAd.columnWidths,
    columnSelected: [],
  },
  fanpage: {
    columnsShow: columnShowFanpage.columnsShowHeader,
    resultColumnsShow: columnShowFanpage.columnsShowHeader,
    countShowColumn: columnShowFanpage.columnsShowHeader.length,
    columnsWidthResize: columnShowFanpage.columnWidths,
    columnSelected: [],
  },
  post: {
    columnsShow: columnShowPost.columnsShowHeader,
    resultColumnsShow: columnShowPost.columnsShowHeader,
    countShowColumn: columnShowPost.columnsShowHeader.length,
    columnsWidthResize: columnShowPost.columnWidths,
    columnSelected: [],
  },
  attributes: {
    columnsShow: columnShowAttributes.columnsShowHeader,
    resultColumnsShow: columnShowAttributes.columnsShowHeader,
    countShowColumn: columnShowAttributes.columnsShowHeader.length,
    columnsWidthResize: columnShowAttributes.columnWidths,
    columnSelected: [],
  },
  listAttributes: [],
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

const StoreReportFacebook = createContext<{
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

const reducerReportFacebook = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const { adAccount, campaign, adset, ad, fanpage, post, attributes } = state;

  switch (action.type) {
    case actionType.UPDATE_AD_ACCOUNT: {
      const columns = handleToggleVisibleColumn(
        payload,
        adAccount.columnsShow,
        adAccount.resultColumnsShow
      );

      return {
        ...state,
        adAccount: {
          ...state.adAccount,
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
    case actionType.UPDATE_FANPAGE: {
      const columns = handleToggleVisibleColumn(
        payload,
        fanpage.columnsShow,
        fanpage.resultColumnsShow
      );

      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_POST: {
      const columns = handleToggleVisibleColumn(payload, post.columnsShow, post.resultColumnsShow);

      return {
        ...state,
        post: {
          ...state.post,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_ATTRIBUTES: {
      const columns = handleToggleVisibleColumn(
        payload,
        attributes.columnsShow,
        attributes.resultColumnsShow
      );

      return {
        ...state,
        attributes: {
          ...state.attributes,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_AD_ACCOUNT: {
      return {
        ...state,
        adAccount: {
          ...state.adAccount,
          ...payload,
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
    case actionType.RESIZE_COLUMN_FANPAGE: {
      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_POST: {
      return {
        ...state,
        post: {
          ...state.post,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_ATTIBUTES: {
      return {
        ...state,
        attributes: {
          ...state.attributes,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_SELECTED_AD_ACCOUNT: {
      return {
        ...state,
        adAccount: {
          ...state.adAccount,
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
    case actionType.UPDATE_COLUMN_SELECTED_AD_SET: {
      return {
        ...state,
        adset: {
          ...state.adset,
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
    case actionType.UPDATE_COLUMN_SELECTED_FANPAGE: {
      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_AD_ACCOUNT: {
      const columns = handleChangeColumnOrders(payload, adAccount.resultColumnsShow);

      return {
        ...state,
        adAccount: {
          ...state.adAccount,
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
    case actionType.UPDATE_COLUMN_ORDER_FANPAGE: {
      const columns = handleChangeColumnOrders(payload, fanpage.resultColumnsShow);

      return {
        ...state,
        fanpage: {
          ...state.fanpage,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_POST: {
      const columns = handleChangeColumnOrders(payload, post.resultColumnsShow);

      return {
        ...state,
        post: {
          ...state.post,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_ATTRIBUTES: {
      const columns = handleChangeColumnOrders(payload, attributes.resultColumnsShow);

      return {
        ...state,
        attributes: {
          ...state.attributes,
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
    case actionType.UPDATE_INITIAL_PARAMS: {
      return {
        ...state,
        ...payload,
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
    case actionType.UPDATE_LIST_ATTRIBUTES: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export { StoreReportFacebook, reducerReportFacebook, initialState };
