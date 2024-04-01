// Libraries
import { createContext, Dispatch } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import produce from "immer";

// Constants
import {
  columnShowFacebookContentIdFilterConversation,
  columnShowFacebookContentIdFilterMessage,
  columnShowGoogleContentId,
  columnShowReportByDate,
  columnShowBuyRateByChannel,
  columnShowReportByChannel,
  columnShowReportByProduct,
  actionType,
  columnShowTiktokContentIdFilterConversation,
  columnShowTiktokContentIdFilterMessage,
} from "views/DashboardView/constants";

// Types
import { ColumnTypeDefault, ItemColumnsDatagrid } from "_types_/ColumnType";
import { FacebookType } from "_types_/FacebookType";
import { VariantNotificationType } from "contexts/ToastContext";
import { ReportByDateType } from "_types_/ReportRevenueType";
import {
  getColumnsShow,
  handleChangeColumnOrders,
  handleToggleVisibleColumn,
} from "utils/tableUtil";
interface ItemColumns {
  columnsShow: ColumnTypeDefault<FacebookType>[];
  resultColumnsShow: ColumnTypeDefault<FacebookType>[];
  columnsWidthResize: TableColumnWidthInfo[];
  countShowColumn: number;
}
interface InitialState {
  topContentIdFacebookMessage: ItemColumns;
  topContentIdTiktokMessage: ItemColumns;
  topContentIdFacebookConversation: ItemColumns;
  topContentIdTiktokConversation: ItemColumns;
  topContentIdGoogle: ItemColumns;
  reportByDate: ItemColumnsDatagrid<ReportByDateType>;
  buyRateByChannel: ItemColumns;
  reportByChannel: ItemColumns;
  reportByProduct: ItemColumns;
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
  topContentIdFacebookMessage: {
    columnsShow: columnShowFacebookContentIdFilterMessage.columnsShowHeader,
    resultColumnsShow: columnShowFacebookContentIdFilterMessage.columnsShowHeader,
    countShowColumn: columnShowFacebookContentIdFilterMessage.columnsShowHeader.length,
    columnsWidthResize: columnShowFacebookContentIdFilterMessage.columnWidths,
  },
  topContentIdTiktokMessage: {
    columnsShow: columnShowTiktokContentIdFilterMessage.columnsShowHeader,
    resultColumnsShow: columnShowTiktokContentIdFilterMessage.columnsShowHeader,
    countShowColumn: columnShowTiktokContentIdFilterMessage.columnsShowHeader.length,
    columnsWidthResize: columnShowTiktokContentIdFilterMessage.columnWidths,
  },
  topContentIdFacebookConversation: {
    columnsShow: columnShowFacebookContentIdFilterConversation.columnsShowHeader,
    resultColumnsShow: columnShowFacebookContentIdFilterConversation.columnsShowHeader,
    countShowColumn: columnShowFacebookContentIdFilterConversation.columnsShowHeader.length,
    columnsWidthResize: columnShowFacebookContentIdFilterConversation.columnWidths,
  },
  topContentIdTiktokConversation: {
    columnsShow: columnShowTiktokContentIdFilterConversation.columnsShowHeader,
    resultColumnsShow: columnShowTiktokContentIdFilterConversation.columnsShowHeader,
    countShowColumn: columnShowTiktokContentIdFilterConversation.columnsShowHeader.length,
    columnsWidthResize: columnShowTiktokContentIdFilterConversation.columnWidths,
  },
  topContentIdGoogle: {
    columnsShow: columnShowGoogleContentId.columnsShowHeader,
    resultColumnsShow: columnShowGoogleContentId.columnsShowHeader,
    countShowColumn: columnShowGoogleContentId.columnsShowHeader.length,
    columnsWidthResize: columnShowGoogleContentId.columnWidths,
  },
  reportByDate: {
    columnsShow: columnShowReportByDate.columnShowTable,
    resultColumnsShow: columnShowReportByDate.columnsShowHeader,
    countShowColumn: columnShowReportByDate.columnsShowHeader.length,
    columnsWidthResize: columnShowReportByDate.columnWidths,
  },
  buyRateByChannel: {
    columnsShow: columnShowBuyRateByChannel.columnsShowHeader,
    resultColumnsShow: columnShowBuyRateByChannel.columnsShowHeader,
    countShowColumn: columnShowBuyRateByChannel.columnsShowHeader.length,
    columnsWidthResize: columnShowBuyRateByChannel.columnWidths,
  },
  reportByChannel: {
    columnsShow: columnShowReportByChannel.columnsShowHeader,
    resultColumnsShow: columnShowReportByChannel.columnsShowHeader,
    countShowColumn: columnShowReportByChannel.columnsShowHeader.length,
    columnsWidthResize: columnShowReportByChannel.columnWidths,
  },
  reportByProduct: {
    columnsShow: columnShowReportByProduct.columnsShowHeader,
    resultColumnsShow: columnShowReportByProduct.columnsShowHeader,
    countShowColumn: columnShowReportByProduct.columnsShowHeader.length,
    columnsWidthResize: columnShowReportByProduct.columnWidths,
  },
  notifications: {
    message: "",
    variant: "info",
  },
};

const handleToggleVisibleColumnStore = (
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

const handleChangeColumnOrdersStore = (
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

const StoreDashboard = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerDashboard = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const {
    topContentIdFacebookMessage,
    topContentIdFacebookConversation,
    topContentIdGoogle,
    reportByDate,
    buyRateByChannel,
    reportByChannel,
    reportByProduct,
  } = state;

  switch (action.type) {
    case actionType.UPDATE_TOP_CONTENT_ID_FACEBOOK_MESSAGE: {
      const columns = handleToggleVisibleColumnStore(
        payload,
        topContentIdFacebookMessage.columnsShow,
        topContentIdFacebookMessage.resultColumnsShow
      );

      return {
        ...state,
        topContentIdFacebookMessage: {
          ...state.topContentIdFacebookMessage,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_TOP_CONTENT_ID_FACEBOOK_CONVERSATION: {
      const columns = handleToggleVisibleColumnStore(
        payload,
        topContentIdFacebookConversation.columnsShow,
        topContentIdFacebookConversation.resultColumnsShow
      );

      return {
        ...state,
        topContentIdFacebookConversation: {
          ...state.topContentIdFacebookConversation,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_REPORT_BY_DATE: {
      const columns = handleToggleVisibleColumn(payload, reportByDate.columnsShow);

      return {
        ...state,
        reportByDate: {
          ...state.reportByDate,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_TOP_CONTENT_ID_GOOGLE: {
      const columns = handleToggleVisibleColumnStore(
        payload,
        topContentIdGoogle.columnsShow,
        topContentIdGoogle.resultColumnsShow
      );

      return {
        ...state,
        topContentIdGoogle: {
          ...state.topContentIdGoogle,
          ...columns,
        },
      };
    }
    case actionType.RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_MESSAGE: {
      return {
        ...state,
        topContentIdFacebookMessage: {
          ...state.topContentIdFacebookMessage,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_TOP_CONTENT_ID_FACEBOOK_CONVERSATION: {
      return {
        ...state,
        topContentIdFacebookConversation: {
          ...state.topContentIdFacebookConversation,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_TOP_CONTENT_ID_GOOGLE: {
      return {
        ...state,
        topContentIdGoogle: {
          ...state.topContentIdGoogle,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_REPORT_BY_DATE: {
      return {
        ...state,
        reportByDate: {
          ...state.reportByDate,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_BUY_RATE_BY_CHANNEL: {
      return {
        ...state,
        buyRateByChannel: {
          ...state.buyRateByChannel,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_REVENUE_BY_CHANNEL: {
      return {
        ...state,
        reportByChannel: {
          ...state.reportByChannel,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_REVENUE_BY_PRODUCT: {
      return {
        ...state,
        reportByProduct: {
          ...state.reportByProduct,
          ...payload,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_MESSAGE: {
      const columns = handleChangeColumnOrdersStore(
        payload,
        topContentIdFacebookMessage.resultColumnsShow
      );

      return {
        ...state,
        topContentIdFacebookMessage: {
          ...state.topContentIdFacebookMessage,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_FACEBOOK_CONVERSATION: {
      const columns = handleChangeColumnOrdersStore(
        payload,
        topContentIdFacebookConversation.resultColumnsShow
      );

      return {
        ...state,
        topContentIdFacebookConversation: {
          ...state.topContentIdFacebookConversation,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_TOP_CONTENT_ID_GOOGLE: {
      const columns = handleChangeColumnOrdersStore(payload, topContentIdGoogle.resultColumnsShow);

      return {
        ...state,
        topContentIdGoogle: {
          ...state.topContentIdGoogle,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_REPORT_BY_DATE: {
      const columns = handleChangeColumnOrders(payload, reportByDate.resultColumnsShow);

      return {
        ...state,
        reportByDate: {
          ...state.reportByDate,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_BUY_RATE_BY_CHANNEL: {
      const columns = handleChangeColumnOrdersStore(payload, buyRateByChannel.resultColumnsShow);

      return {
        ...state,
        buyRateByChannel: {
          ...state.buyRateByChannel,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_REVENUE_BY_CHANNEL: {
      const columns = handleChangeColumnOrdersStore(payload, reportByChannel.resultColumnsShow);

      return {
        ...state,
        reportByChannel: {
          ...state.reportByChannel,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_REVENUE_BY_PRODUCT: {
      const columns = handleChangeColumnOrdersStore(payload, reportByProduct.resultColumnsShow);

      return {
        ...state,
        reportByProduct: {
          ...state.reportByProduct,
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

export { StoreDashboard, reducerDashboard, initialState };
