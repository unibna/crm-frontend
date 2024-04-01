// Libraries
import { createContext, Dispatch } from "react";
import { TableColumnWidthInfo } from "@devexpress/dx-react-grid";
import produce from "immer";

// Constants
import {
  columnShowFacebookContentIdFilterConversation,
  columnShowFacebookContentIdFilterMessage,
  columnShowGoogleContentId,
  columnShowGoogleProduct,
  columnShowFacebookProduct,
  columnShowTopLivestreamGood,
  actionType,
} from "views/DashboardMKTView/constants";
import { columnShowReportByDate } from "views/DashboardView/constants";

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
  topContentIdFacebookConversation: ItemColumns;
  topContentIdGoogle: ItemColumns;
  facebookProduct: ItemColumns;
  googleProduct: ItemColumns;
  topLivestreamGood: ItemColumns;
  reportByDate: ItemColumnsDatagrid<ReportByDateType>;
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
  topContentIdFacebookConversation: {
    columnsShow: columnShowFacebookContentIdFilterConversation.columnsShowHeader,
    resultColumnsShow: columnShowFacebookContentIdFilterConversation.columnsShowHeader,
    countShowColumn: columnShowFacebookContentIdFilterConversation.columnsShowHeader.length,
    columnsWidthResize: columnShowFacebookContentIdFilterConversation.columnWidths,
  },
  topContentIdGoogle: {
    columnsShow: columnShowGoogleContentId.columnsShowHeader,
    resultColumnsShow: columnShowGoogleContentId.columnsShowHeader,
    countShowColumn: columnShowGoogleContentId.columnsShowHeader.length,
    columnsWidthResize: columnShowGoogleContentId.columnWidths,
  },
  facebookProduct: {
    columnsShow: columnShowFacebookProduct.columnsShowHeader,
    resultColumnsShow: columnShowFacebookProduct.columnsShowHeader,
    countShowColumn: columnShowFacebookProduct.columnsShowHeader.length,
    columnsWidthResize: columnShowFacebookProduct.columnWidths,
  },
  googleProduct: {
    columnsShow: columnShowGoogleProduct.columnsShowHeader,
    resultColumnsShow: columnShowGoogleProduct.columnsShowHeader,
    countShowColumn: columnShowGoogleProduct.columnsShowHeader.length,
    columnsWidthResize: columnShowGoogleProduct.columnWidths,
  },
  topLivestreamGood: {
    columnsShow: columnShowTopLivestreamGood.columnsShowHeader,
    resultColumnsShow: columnShowTopLivestreamGood.columnsShowHeader,
    countShowColumn: columnShowTopLivestreamGood.columnsShowHeader.length,
    columnsWidthResize: columnShowTopLivestreamGood.columnWidths,
  },
  reportByDate: {
    columnsShow: getColumnsShow(columnShowReportByDate.columnShowTable),
    resultColumnsShow: columnShowReportByDate.columnsShowHeader,
    countShowColumn: columnShowReportByDate.columnsShowHeader.length,
    columnsWidthResize: columnShowReportByDate.columnWidths,
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

const StoreDashboardMkt = createContext<{
  state: InitialState;
  dispatch: Dispatch<DispatchAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducerDashboardMkt = (state: InitialState, action: DispatchAction): InitialState => {
  const { payload } = action;
  const {
    topContentIdFacebookMessage,
    topContentIdFacebookConversation,
    topContentIdGoogle,
    facebookProduct,
    googleProduct,
    topLivestreamGood,
    reportByDate,
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
    case actionType.UPDATE_FACEBOOK_PRODUCT: {
      const columns = handleToggleVisibleColumnStore(
        payload,
        facebookProduct.columnsShow,
        facebookProduct.resultColumnsShow
      );

      return {
        ...state,
        facebookProduct: {
          ...state.facebookProduct,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_GOOGLE_PRODUCT: {
      const columns = handleToggleVisibleColumnStore(
        payload,
        googleProduct.columnsShow,
        googleProduct.resultColumnsShow
      );

      return {
        ...state,
        googleProduct: {
          ...state.googleProduct,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_TOP_LIVESTREAM_GOOD: {
      const columns = handleToggleVisibleColumnStore(
        payload,
        topLivestreamGood.columnsShow,
        topLivestreamGood.resultColumnsShow
      );

      return {
        ...state,
        topLivestreamGood: {
          ...state.topLivestreamGood,
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
    case actionType.RESIZE_COLUMN_FACEBOOK_PRODUCT: {
      return {
        ...state,
        facebookProduct: {
          ...state.facebookProduct,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_GOOGLE_PRODUCT: {
      return {
        ...state,
        googleProduct: {
          ...state.googleProduct,
          ...payload,
        },
      };
    }
    case actionType.RESIZE_COLUMN_TOP_LIVESTREAM_GOOD: {
      return {
        ...state,
        topLivestreamGood: {
          ...state.topLivestreamGood,
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
    case actionType.UPDATE_COLUMN_ORDER_FACEBOOK_PRODUCT: {
      const columns = handleChangeColumnOrdersStore(payload, facebookProduct.resultColumnsShow);

      return {
        ...state,
        facebookProduct: {
          ...state.facebookProduct,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_GOOGLE_PRODUCT: {
      const columns = handleChangeColumnOrdersStore(payload, googleProduct.resultColumnsShow);

      return {
        ...state,
        googleProduct: {
          ...state.googleProduct,
          ...columns,
        },
      };
    }
    case actionType.UPDATE_COLUMN_ORDER_TOP_LIVESTREAM_GOOD: {
      const columns = handleChangeColumnOrdersStore(payload, topLivestreamGood.resultColumnsShow);

      return {
        ...state,
        topLivestreamGood: {
          ...state.topLivestreamGood,
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

export { StoreDashboardMkt, reducerDashboardMkt, initialState };
